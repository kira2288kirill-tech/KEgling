const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || "KEgling_chop_BOT";
const OWNER_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
const OWNER_COMMAND = "/owner";

const PRODUCTS = {
    socks: {
        code: "s",
        title: "Набор носков SoxBox",
        price: 420,
        description: "Набор из 12 пар хлопковых носков для повседневной носки.",
        sizes: ["40", "41", "42", "43", "44"]
    },
    hoodie: {
        code: "h",
        title: "Худи Direct Action Shaka, Black",
        price: 1850,
        description: "Черное худи с плотной тканью и акцентной вышивкой.",
        sizes: ["S", "M", "L", "XL"]
    },
    sweatshirt: {
        code: "w",
        title: "Толстовка KEgling White",
        price: 1700,
        description: "Светлая толстовка на каждый день.",
        sizes: ["S", "M", "L", "XL"]
    },
    shirt: {
        code: "sh",
        title: "Рубашка Camel Active",
        price: 2100,
        description: "Легкая рубашка с коротким рукавом для летнего образа.",
        sizes: ["S", "M", "L", "XL"]
    },
    tie: {
        code: "t",
        title: "Галстук Emilio Corali",
        price: 690,
        description: "Классический галстук для аккуратного образа.",
        sizes: []
    },
    cap: {
        code: "c",
        title: "Кепка SumWin",
        price: 880,
        description: "Бейсболка с изогнутым козырьком и регулируемой застежкой.",
        sizes: []
    },
    bag: {
        code: "b",
        title: "Сумка KEgling Daily",
        price: 1450,
        description: "Компактная сумка через плечо для повседневных вещей.",
        sizes: []
    }
};

const PRODUCT_BY_CODE = Object.fromEntries(
    Object.entries(PRODUCTS).map(([id, product]) => [product.code, { id, ...product }])
);

exports.handler = async function handler(event) {
    if (event.httpMethod !== "POST") {
        return json(405, { ok: false });
    }

    if (!BOT_TOKEN) {
        return json(503, { ok: false, error: "TELEGRAM_BOT_TOKEN is not configured" });
    }

    const update = JSON.parse(event.body || "{}");

    try {
        if (update.message) {
            await handleMessage(update.message);
        }

        if (update.callback_query) {
            await handleCallback(update.callback_query);
        }
    } catch (error) {
        console.error("Telegram webhook error:", error);
    }

    return json(200, { ok: true });
};

async function handleMessage(message) {
    const chatId = String(message.chat.id);
    const text = (message.text || "").trim();

    if (text === OWNER_COMMAND) {
        await sendMessage(chatId, "Владелец закреплен. Новые заказы будут дублироваться в этот чат.");
        return;
    }

    if (text.startsWith("/start")) {
        const payload = text.split(" ").slice(1).join(" ").trim();
        await handleStart(chatId, payload);
        return;
    }

    const replyText = message.reply_to_message?.text || "";
    const token = extractDraftToken(replyText);
    if (!token) {
        await sendMainMenu(chatId, "Напиши /start или выбери действие кнопками ниже.");
        return;
    }

    const draft = parseDraftToken(token);
    if (!draft.items?.length) {
        await sendMainMenu(chatId, "Не удалось восстановить заказ. Выбери товар заново.");
        return;
    }

    const customer = parseCustomerLine(text);
    if (!customer) {
        await sendCustomerPrompt(
            chatId,
            draft,
            "Не смог разобрать данные. Отправь одним сообщением так:\nИмя Фамилия; Телефон; Email"
        );
        return;
    }

    const orderId = `KEG-${Date.now().toString().slice(-6)}`;
    const customerFull = buildOrderDetailsText(orderId, customer, draft, message.from, { audience: "customer" });
    await sendLongMessage(chatId, customerFull, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Каталог", callback_data: "catalog" }]
            ]
        }
    });

    const ownerChatId = OWNER_CHAT_ID || await resolveOwnerChatId();
    if (ownerChatId) {
        const ownerText = buildOrderDetailsText(orderId, customer, draft, message.from, { audience: "owner" });
        await sendLongMessage(ownerChatId, ownerText);
    }
}

async function handleStart(chatId, payload) {
    if (!payload || payload === "catalog") {
        await sendMainMenu(
            chatId,
            `Привет! Я бот заказов KEgling (@${BOT_USERNAME}). Открой «Каталог» или оформи корзину на сайте и перейди сюда по кнопке — подставлю товары и попрошу контакты.`
        );
        return;
    }

    if (payload.startsWith("site_")) {
        const draft = decodeSiteDraft(payload.slice(5));
        if (!draft.items.length) {
            await sendMainMenu(chatId, "Не смог загрузить заказ с сайта. Открой каталог и выбери товар заново.");
            return;
        }

        const summary = [
            "Я получил твой заказ с сайта. Ниже полный состав — проверь размеры и сумму.",
            "",
            formatDraftBlock(draft.items),
            "",
            "Теперь пришли одним сообщением (через точку с запятой):",
            "Имя Фамилия; Телефон; Email"
        ].join("\n");

        await sendCustomerPrompt(chatId, draft, summary);
        return;
    }

    await sendMainMenu(chatId, "Открыл каталог. Выбери товар ниже.");
}

async function handleCallback(callbackQuery) {
    const data = callbackQuery.data || "";
    const chatId = String(callbackQuery.message.chat.id);

    await answerCallbackQuery(callbackQuery.id);

    if (data === "catalog") {
        await sendCatalog(chatId, "Каталог KEgling:");
        return;
    }

    if (data.startsWith("product:")) {
        const productId = data.slice(8);
        await sendProduct(chatId, productId);
        return;
    }

    if (data.startsWith("buy:")) {
        const [, productId, size] = data.split(":");
        const draft = {
            items: [{ id: productId, size: normalizeSize(size) }]
        };

        await sendCustomerPrompt(
            chatId,
            draft,
            [
                "Отлично, продолжаем оформление.",
                "",
                formatDraftBlock(draft.items),
                "",
                "Теперь пришли одним сообщением:",
                "Имя Фамилия; Телефон; Email"
            ].join("\n")
        );
    }
}

async function sendMainMenu(chatId, text) {
    await sendMessage(chatId, text, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Каталог", callback_data: "catalog" }]
            ]
        }
    });
}

async function sendCatalog(chatId, text) {
    const keyboard = Object.entries(PRODUCTS).map(([id, product]) => ([
        { text: `${product.title} - ${product.price} грн`, callback_data: `product:${id}` }
    ]));

    await sendMessage(chatId, text, {
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
}

async function sendProduct(chatId, productId) {
    const product = PRODUCTS[productId];
    if (!product) {
        await sendCatalog(chatId, "Товар не найден. Вот актуальный каталог:");
        return;
    }

    const message = [
        product.title,
        product.description,
        `Цена: ${product.price} грн`
    ].join("\n");

    const keyboard = product.sizes.length
        ? product.sizes.map((size) => ([{ text: `Размер ${size}`, callback_data: `buy:${productId}:${encodeSize(size)}` }]))
        : [[{ text: "Оформить", callback_data: `buy:${productId}:none` }]];

    await sendMessage(chatId, message, {
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
}

async function sendCustomerPrompt(chatId, draft, text) {
    const token = encodeDraftToken(draft);
    await sendMessage(chatId, `${text}\n\n#keg:${token}`, {
        reply_markup: {
            force_reply: true,
            input_field_placeholder: "Имя Фамилия; Телефон; Email"
        }
    });
}

function formatOrderDateRu() {
    return new Date().toLocaleString("ru-RU", {
        timeZone: "Europe/Kyiv",
        dateStyle: "long",
        timeStyle: "short"
    });
}

function formatTelegramBuyer(fromUser) {
    if (!fromUser) return "данные Telegram недоступны";
    const lines = [];
    const fullName = [fromUser.first_name, fromUser.last_name].filter(Boolean).join(" ");
    if (fullName) lines.push(`Имя в Telegram: ${fullName}`);
    if (fromUser.username) lines.push(`Username: @${fromUser.username}`);
    lines.push(`Chat id: ${fromUser.id}`);
    if (fromUser.language_code) lines.push(`Язык интерфейса: ${fromUser.language_code}`);
    if (fromUser.is_premium) lines.push("Telegram Premium: да");
    return lines.join("\n");
}

function formatDraftItemLine(item, index) {
    const product = PRODUCTS[item.id];
    const n = typeof index === "number" ? `${index + 1}) ` : "— ";
    if (!product) return `${n}Неизвестный товар (id: ${item.id || "?"})`;
    const size = item.size && item.size !== "none" ? item.size : "без размера / единый";
    return `${n}${product.title}\n   Размер: ${size}\n   Описание: ${product.description}\n   Цена: ${product.price} грн`;
}

function formatDraftBlock(items) {
    const lines = items.map((item, i) => formatDraftItemLine(item, i));
    const total = calculateTotal(items);
    return ["Состав заказа:", "", ...lines, "", `Позиций: ${items.length}`, `Сумма: ${total} грн`].join("\n");
}

function buildOrderDetailsText(orderId, customer, draft, fromUser, { audience }) {
    const items = draft.items || [];
    const total = calculateTotal(items);
    const header =
        audience === "owner"
            ? ["🛒 Новый заказ (KEgling)", `Номер: ${orderId}`, `Создан: ${formatOrderDateRu()}`]
            : ["✅ Заказ принят — сохрани эту сводку.", `Номер заказа: ${orderId}`, `Дата и время: ${formatOrderDateRu()}`];

    const contacts = [
        "",
        "—— Контакты покупателя ——",
        `Имя и фамилия: ${customer.name}`,
        `Телефон: ${customer.phone}`,
        `Email: ${customer.email}`
    ];

    const tg = ["", "—— Покупатель в Telegram ——", formatTelegramBuyer(fromUser)];

    const goods = ["", "—— Товары (подробно) ——", ...items.map((item, i) => formatDraftItemLine(item, i)), "", `Позиций в заказе: ${items.length}`, `Итого к оплате: ${total} грн`];

    const footer =
        audience === "owner"
            ? ["", "Свяжись с клиентом для подтверждения, оплаты и доставки."]
            : [
                  "",
                  "Дальше мы свяжемся с тобой по телефону или почте для подтверждения и доставки.",
                  "Если нужно что-то изменить — напиши нам в ответ на это сообщение или снова оформи заказ на сайте."
              ];

    return [...header, ...contacts, ...tg, ...goods, ...footer].join("\n");
}

function calculateTotal(items) {
    return items.reduce((sum, item) => {
        const product = PRODUCTS[item.id];
        return sum + (product ? product.price : 0);
    }, 0);
}

function parseCustomerLine(text) {
    const parts = text.split(";").map((part) => part.trim()).filter(Boolean);
    if (parts.length < 3) return null;

    return {
        name: parts[0],
        phone: parts[1],
        email: parts[2]
    };
}

function encodeDraftToken(draft) {
    return Buffer.from(JSON.stringify(draft)).toString("base64url");
}

function parseDraftToken(token) {
    try {
        return JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
    } catch {
        return { items: [] };
    }
}

function extractDraftToken(text) {
    const marker = "#keg:";
    const index = text.lastIndexOf(marker);
    if (index === -1) return "";
    return text.slice(index + marker.length).trim();
}

function decodeSiteDraft(payload) {
    try {
        const raw = Buffer.from(payload, "base64url").toString("utf8");
        const items = raw
            .split(".")
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part) => {
                const [code, ...sizeParts] = part.split("-");
                const sizeCode = sizeParts.join("-") || "none";
                const product = PRODUCT_BY_CODE[code];
                if (!product) return null;

                return {
                    id: product.id,
                    size: normalizeSize(sizeCode)
                };
            })
            .filter(Boolean);

        return { items };
    } catch {
        return { items: [] };
    }
}

function encodeSize(size) {
    return size.replace(/[^a-zA-Z0-9]/g, "_");
}

function normalizeSize(size) {
    if (!size || size === "none") return "none";
    return size.replace(/_/g, "-");
}

async function resolveOwnerChatId() {
    const response = await fetch(`${telegramApiBase()}/getUpdates`);
    const data = await response.json().catch(() => ({}));
    if (!data?.ok || !Array.isArray(data.result)) {
        return "";
    }

    const ownerUpdate = [...data.result].reverse().find((item) => item?.message?.text?.trim() === OWNER_COMMAND);
    return ownerUpdate?.message?.chat?.id ? String(ownerUpdate.message.chat.id) : "";
}

const TELEGRAM_MAX_MESSAGE = 4096;

function chunkTelegramText(text, maxLen = TELEGRAM_MAX_MESSAGE - 80) {
    if (text.length <= maxLen) return [text];
    const chunks = [];
    let rest = text;
    while (rest.length) {
        if (rest.length <= maxLen) {
            chunks.push(rest);
            break;
        }
        let at = rest.lastIndexOf("\n\n", maxLen);
        if (at < maxLen * 0.4) at = rest.lastIndexOf("\n", maxLen);
        if (at < maxLen * 0.3) at = maxLen;
        chunks.push(rest.slice(0, at).trimEnd());
        rest = rest.slice(at).trimStart();
    }
    return chunks;
}

async function sendLongMessage(chatId, text, lastMessageExtra = {}) {
    const parts = chunkTelegramText(text);
    const total = parts.length;
    for (let i = 0; i < total; i++) {
        const isLast = i === total - 1;
        const body = total > 1 ? `(${i + 1}/${total})\n${parts[i]}` : parts[i];
        await sendMessage(chatId, body, isLast ? lastMessageExtra : {});
    }
}

async function sendMessage(chatId, text, extra = {}) {
    await fetch(`${telegramApiBase()}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            ...extra
        })
    });
}

async function answerCallbackQuery(callbackQueryId) {
    await fetch(`${telegramApiBase()}/answerCallbackQuery`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            callback_query_id: callbackQueryId
        })
    });
}

function telegramApiBase() {
    return `https://api.telegram.org/bot${BOT_TOKEN}`;
}

function json(statusCode, body) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(body)
    };
}

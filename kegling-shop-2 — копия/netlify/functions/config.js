const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || "KEgling_chop_BOT";

const BOT_PROFILE_NAME = process.env.TELEGRAM_BOT_DISPLAY_NAME || "KEgling — магазин";
const BOT_PROFILE_SHORT =
    process.env.TELEGRAM_BOT_SHORT_DESC || "Одежда KEgling: каталог и оформление заказа в чате.";
const BOT_PROFILE_DESC =
    process.env.TELEGRAM_BOT_LONG_DESC ||
    "Бот для заказов магазина KEgling. Собери корзину на сайте и нажми «Перейти в Telegram» — заказ подставится сюда. Либо выбери товар из каталога кнопками ниже.";

exports.handler = async function handler(event) {
    await ensureWebhook(event);
    await maybeSyncBotProfile();

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            ok: true,
            telegramUrl: `https://t.me/${BOT_USERNAME}?start=catalog`
        })
    };
};

async function ensureWebhook(event) {
    const siteUrl = getSiteUrl(event);
    if (!siteUrl || !BOT_TOKEN) return;

    const webhookUrl = `${siteUrl}${getWebhookPath()}`;
    const infoResponse = await fetch(`${telegramApiBase()}/getWebhookInfo`);
    const info = await infoResponse.json().catch(() => ({}));

    if (info?.ok && info?.result?.url === webhookUrl) {
        return;
    }

    await fetch(`${telegramApiBase()}/setWebhook`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: webhookUrl
        })
    });
}

function getSiteUrl(event) {
    if (process.env.URL) {
        return process.env.URL.replace(/\/$/, "");
    }

    if (process.env.VERCEL_URL) {
        const raw = process.env.VERCEL_URL.replace(/\/$/, "");
        if (raw.startsWith("http://") || raw.startsWith("https://")) {
            return raw;
        }
        return `https://${raw}`;
    }

    const host = event?.headers?.host || event?.headers?.Host;
    if (!host) return "";
    return `https://${host}`;
}

function getWebhookPath() {
    if (process.env.VERCEL || process.env.VERCEL_URL) {
        return "/api/telegram-webhook";
    }
    return "/.netlify/functions/telegram-webhook";
}

function telegramApiBase() {
    return `https://api.telegram.org/bot${BOT_TOKEN}`;
}

async function maybeSyncBotProfile() {
    if (!BOT_TOKEN || process.env.TELEGRAM_SYNC_PROFILE === "0") return;
    const g = globalThis;
    const key = "__keglingTelegramProfileSyncAt";
    const now = Date.now();
    const last = g[key] || 0;
    if (now - last < 6 * 60 * 60 * 1000) return;
    g[key] = now;
    try {
        await fetch(`${telegramApiBase()}/setMyName`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: BOT_PROFILE_NAME })
        });
        await fetch(`${telegramApiBase()}/setMyShortDescription`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ short_description: BOT_PROFILE_SHORT })
        });
        await fetch(`${telegramApiBase()}/setMyDescription`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: BOT_PROFILE_DESC })
        });
    } catch (error) {
        console.error("Telegram profile sync:", error);
    }
}

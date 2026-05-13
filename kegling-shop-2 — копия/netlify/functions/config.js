const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || "KEgling_chop_BOT";

const BOT_PROFILE_NAME = process.env.TELEGRAM_BOT_DISPLAY_NAME || "KEgling — магазин";
const BOT_PROFILE_SHORT =
    process.env.TELEGRAM_BOT_SHORT_DESC || "Одежда KEgling: каталог и оформление заказа в чате.";
const BOT_PROFILE_DESC =
    process.env.TELEGRAM_BOT_LONG_DESC ||
    "Бот для заказов магазина KEgling. Собери корзину на сайте и нажми «Перейти в Telegram» — заказ подставится сюда. Либо выбери товар из каталога кнопками ниже.";

exports.handler = async function handler(event) {
    const webhookStatus = await ensureWebhook(event);
    await maybeSyncBotProfile();

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            ok: true,
            telegramUrl: `https://t.me/${BOT_USERNAME}?start=catalog`,
            ...webhookStatus
        })
    };
};

function headerGet(headers, name) {
    if (!headers || typeof headers !== "object") return "";
    const target = name.toLowerCase();
    for (const key of Object.keys(headers)) {
        if (key.toLowerCase() === target) {
            const v = headers[key];
            if (Array.isArray(v)) return String(v[0] ?? "").trim();
            return String(v ?? "").trim();
        }
    }
    return "";
}

function getSiteUrl(event) {
    const headers = event?.headers || {};
    const rawHost =
        headerGet(headers, "x-forwarded-host") ||
        headerGet(headers, "x-vercel-forwarded-host") ||
        headerGet(headers, "host") ||
        "";

    const hostPart = rawHost.split(",")[0].trim().split(":")[0];
    if (hostPart && !/^localhost$/i.test(hostPart) && !/^127\.\d+\.\d+\.\d+$/i.test(hostPart)) {
        return `https://${hostPart}`.replace(/\/$/, "");
    }

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

    return "";
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

function isAcceptedWebhookUrl(registeredUrl, siteUrl) {
    if (!registeredUrl || !siteUrl) return false;
    const base = siteUrl.replace(/\/$/, "");
    const u = registeredUrl.replace(/\/$/, "");
    return u === `${base}/api/telegram-webhook` || u === `${base}/api/webhook`;
}

async function ensureWebhook(event) {
    const siteUrl = getSiteUrl(event);
    const path = getWebhookPath();
    const webhookFullUrl = siteUrl && BOT_TOKEN ? `${siteUrl}${path}` : null;

    const status = {
        botTokenSet: Boolean(BOT_TOKEN),
        siteUrlResolved: siteUrl || null,
        webhookFullUrl,
        telegramWebhookOk: null,
        telegramWebhookDescription: null
    };

    if (!BOT_TOKEN) {
        status.telegramWebhookOk = false;
        status.telegramWebhookDescription = "TELEGRAM_BOT_TOKEN is not set on the server";
        return status;
    }

    if (!siteUrl) {
        status.telegramWebhookOk = false;
        status.telegramWebhookDescription = "Could not resolve public site URL (no Host / URL / VERCEL_URL)";
        return status;
    }

    const infoResponse = await fetch(`${telegramApiBase()}/getWebhookInfo`);
    const info = await infoResponse.json().catch(() => ({}));

    if (info?.ok && isAcceptedWebhookUrl(info?.result?.url, siteUrl)) {
        status.telegramWebhookOk = true;
        status.telegramWebhookDescription = "webhook already registered";
        status.webhookFullUrl = info.result.url;
        return status;
    }

    const setResponse = await fetch(`${telegramApiBase()}/setWebhook`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: webhookFullUrl
        })
    });
    const setJson = await setResponse.json().catch(() => ({}));
    status.telegramWebhookOk = setJson?.ok === true;
    status.telegramWebhookDescription =
        (setJson?.description && String(setJson.description)) ||
        (setJson?.error_code != null ? `error ${setJson.error_code}: ${setJson.description || ""}` : "") ||
        JSON.stringify(setJson).slice(0, 400);

    if (status.telegramWebhookOk) {
        const verify = await fetch(`${telegramApiBase()}/getWebhookInfo`);
        const v = await verify.json().catch(() => ({}));
        const got = v?.result?.url;
        if (v?.ok && got && !isAcceptedWebhookUrl(got, siteUrl)) {
            status.telegramWebhookOk = false;
            status.telegramWebhookDescription = `Webhook mismatch: expected ${webhookFullUrl}, Telegram has ${got}`;
        }
    }

    return status;
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

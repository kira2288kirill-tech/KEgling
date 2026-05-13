const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || "KEgling_SHOPP_bot";

exports.handler = async function handler(event) {
    await ensureWebhook(event);

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

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8642740979:AAFFDPM2kGcFIbWnaCqqFJmGcDkRI0oHOhI";
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

    const webhookUrl = `${siteUrl}/.netlify/functions/telegram-webhook`;
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

    const host = event?.headers?.host || event?.headers?.Host;
    if (!host) return "";
    return `https://${host}`;
}

function telegramApiBase() {
    return `https://api.telegram.org/bot${BOT_TOKEN}`;
}

const webhook = require("../netlify/functions/telegram-webhook.js");

function netlifyBody(req) {
    if (req.body == null) return "{}";
    return typeof req.body === "string" ? req.body : JSON.stringify(req.body);
}

module.exports = async function vercelTelegramWebhook(req, res) {
    const result = await webhook.handler({
        httpMethod: req.method || "GET",
        body: netlifyBody(req),
        headers: req.headers || {}
    });
    res.status(result.statusCode || 200);
    Object.entries(result.headers || {}).forEach(([key, value]) => {
        res.setHeader(key, value);
    });
    const body = result.body;
    if (typeof body === "string") {
        try {
            res.json(JSON.parse(body));
        } catch {
            res.send(body);
        }
    } else {
        res.json(body ?? { ok: true });
    }
};

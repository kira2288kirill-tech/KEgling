const config = require("../netlify/functions/config.js");

module.exports = async function vercelConfig(req, res) {
    const result = await config.handler({
        httpMethod: req.method || "GET",
        headers: req.headers || {}
    });
    res.status(result.statusCode || 200);
    Object.entries(result.headers || {}).forEach(([key, value]) => {
        res.setHeader(key, value);
    });
    res.send(result.body);
};

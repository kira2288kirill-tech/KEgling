# KEgling shop

## Deploy

This project is prepared for Netlify Functions:

- `/.netlify/functions/config`
- `/.netlify/functions/telegram-webhook`

For the first successful order:

[@KEgling_SHOPP_bot](https://t.me/KEgling_SHOPP_bot)

1. Open the site once after deploy so it can register the webhook.
2. Open the bot and send `/start`.
3. Owner notifications are wired to the configured owner chat id.

The footer Telegram link opens the catalog in the bot. Checkout from the site opens the bot with the selected cart and the user finishes the order there.

# KEgling shop

## Deploy

Netlify Functions (или Vercel `api/*`, они проксируют те же модули):

- `/.netlify/functions/config` или `/api/config`
- `/.netlify/functions/telegram-webhook` или `/api/telegram-webhook`

Бот заказов: [@KEgling_chop_BOT](https://t.me/KEgling_chop_BOT)

### Переменные окружения

| Переменная | Назначение |
|------------|------------|
| `TELEGRAM_BOT_TOKEN` | Токен из @BotFather |
| `TELEGRAM_BOT_USERNAME` | Имя без `@`, например `KEgling_chop_BOT` |
| `TELEGRAM_CHAT_ID` | Чат владельца для копий заказов (числовой id). Пусто — после деплоя можно один раз написать боту `/owner` из своего аккаунта |
| `TELEGRAM_SYNC_PROFILE` | `0` — не вызывать API смены имени/описания бота при `/api/config` |

После деплоя открой сайт один раз (чтобы выставился webhook и при необходимости обновились имя/описание бота), затем в Telegram: `/start` у бота.

Ссылка «Telegram» в подвале ведёт в каталог бота. Оформление с сайта открывает бота с корзиной; контакты пользователь вставляет в чат по подсказке.

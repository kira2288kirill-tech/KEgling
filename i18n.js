(function () {
    const LANGUAGE_KEY = "kegling-language";
    const NO_SIZE_VALUE = "__none__";
    const SUPPORTED_LANGUAGES = ["ru", "uk", "en"];
    let currentLanguage = loadLanguage();
    let selectedVariantIndex = 0;

    const catalogFilterLabels = {
        ru: {
            hoodies: "Худи и свитшоты",
            shirts: "Рубашки",
            ties: "Галстуки",
            caps: "Кепки",
            socks: "Носки",
            bags: "Сумки",
            casual: "Casual",
            accessories: "Аксессуары"
        },
        uk: {
            hoodies: "Худі та світшоти",
            shirts: "Сорочки",
            ties: "Краватки",
            caps: "Кепки",
            socks: "Шкарпетки",
            bags: "Сумки",
            casual: "Casual",
            accessories: "Аксесуари"
        },
        en: {
            hoodies: "Hoodies & sweatshirts",
            shirts: "Shirts",
            ties: "Ties",
            caps: "Caps",
            socks: "Socks",
            bags: "Bags",
            casual: "Casual",
            accessories: "Accessories"
        }
    };

    const uiText = {
        ru: {
            title: "KEgling - Магазин одежды",
            languageLabel: "Язык",
            languageAria: "Выбор языка",
            welcomeKicker: "Коллекция / 2026",
            scrollHint: "Листай вниз",
            navFavorites: "Избранное",
            navCatalog: "Каталог",
            navAbout: "О нас",
            navCart: "Корзина",
            miniCartTitle: "Корзина",
            miniCartClose: "Закрыть",
            miniCartCheckout: "Перейти в корзину",
            miniCartEmpty: "Корзина пуста — добавь товар из каталога.",
            sidebarTitle: "Коллекция",
            sidebarKicker: "Разделы",
            sidebarNote: "Кураторский подбор — городской настрой, чистые линии, гардероб на каждый день.",
            searchLabel: "Поиск",
            searchPlaceholder: "Название, цвет, категория",
            sortLabel: "Сортировка",
            sortAria: "Сортировка",
            sortDefault: "По умолчанию",
            sortPriceAsc: "Сначала дешевле",
            sortPriceDesc: "Сначала дороже",
            sortTitleAsc: "По названию A-Я",
            filtersTitle: "Фильтры",
            filtersReset: "Сбросить фильтры",
            filtersSize: "Размер",
            filtersColor: "Цвет",
            filtersPriceTo: "Цена до:",
            cartHeading: "Ваша корзина",
            checkoutHeading: "Оформление заказа",
            checkoutNote: "Заполни контакты, и мы сразу перекинем тебя в Telegram-бота для подтверждения.",
            fieldName: "Имя",
            fieldSurname: "Фамилия",
            fieldPhone: "Телефон",
            fieldEmail: "Почта",
            warningTelegram: "После кнопки откроется Telegram-бот. Контакты скопируются в буфер, и их можно будет сразу вставить в чат для завершения заказа.",
            checkoutButton: "Оформить заказ",
            checkoutSubmit: "Перейти в Telegram и оформить",
            backToCatalog: "← Назад в каталог",
            aboutHeading: "О KEgling",
            aboutLead: "Мы делаем KEgling для тех, кто любит стильные вещи и аккуратные детали.",
            support: "Поддержка:",
            footerCopy: "© 2026 Все права защищены.",
            modalMaterial: "Материал",
            modalFit: "Посадка",
            modalUse: "Для чего",
            chooseSize: "Выберите размер:",
            chooseColor: "Выберите цвет:",
            addToCart: "Добавить в корзину",
            added: "Добавлено",
            relatedTitle: "Подойдёт вместе с этим",
            relatedText: "Собрали вещи, которые хорошо дополняют этот товар.",
            reviewsTitle: "Отзывы",
            reviewsText: "Поставь оценку и напиши свой отзыв по этому товару.",
            reviewName: "Имя",
            reviewNamePlaceholder: "Например, Кирилл",
            reviewRating: "Оценка",
            reviewTextLabel: "Отзыв",
            reviewTextPlaceholder: "Напиши, как тебе товар.",
            reviewSubmit: "Оставить отзыв",
            toastReady: "Готово",
            toastAddedDefault: "Товар добавлен в корзину.",
            recentlyTitle: "Недавно просмотренные",
            recentlyText: "Быстрый доступ к товарам, которые ты уже открывал.",
            galleryPrev: "Предыдущее фото",
            galleryNext: "Следующее фото",
            favoriteAria: "В избранное",
            quickView: "Быстрый просмотр",
            shortAbout: "Кратко о товаре",
            delivery: "Доставка по Украине · 1-3 дня",
            noReviews: "Пока нет отзывов. Будь первым, кто поставит оценку и напишет комментарий.",
            deleteReview: "Удалить отзыв",
            chooseRatingTitle: "Выбери оценку",
            chooseRatingText: "Сначала поставь от 1 до 5 звёзд.",
            needReviewTitle: "Нужен отзыв",
            needReviewText: "Напиши пару слов о товаре перед отправкой.",
            reviewAddedTitle: "Отзыв добавлен",
            reviewAddedText: "Спасибо, отзыв сохранён для этого товара.",
            reviewDeletedTitle: "Отзыв удалён",
            reviewDeletedText: "Комментарий убран из этого товара.",
            catalogEmpty: "По этим фильтрам пока нет товаров.",
            home: "Главная",
            allProducts: "Все товары",
            favorites: "Избранное",
            removedFavoriteTitle: "Убрано из избранного",
            removedFavoriteText: "Товар больше не сохранён.",
            addedFavoriteTitle: "Добавлено в избранное",
            addedFavoriteText: "Товар сохранён, чтобы вернуться к нему позже.",
            emptyCart: "Корзина пока пустая. Добавь товар и возвращайся сюда.",
            colorPrefix: "Цвет: {value}",
            sizePrefix: "Размер: {value}",
            articlePrefix: "Артикул: {value}",
            inStockPrefix: "Наличие: {value}",
            ratingPrefix: "Рейтинг: {value}",
            photoAlt: "Фото товара {index}",
            chooseSizeToastTitle: "Выбери размер",
            chooseSizeToastText: "Сначала отметь размер, затем добавь товар.",
            inCartTitle: "В корзине",
            inCartText: "{title} добавлен.",
            removedTitle: "Удалено",
            removedText: "Позиция убрана из корзины.",
            emptyCartTitle: "Корзина пустая",
            emptyCartText: "Сначала добавь хотя бы один товар.",
            nameRequired: "Введите имя.",
            surnameRequired: "Введите фамилию.",
            phoneRequired: "Укажите украинский номер: +380 и 9 цифр (например +380 50 123 45 67).",
            emailRequired: "Введите email.",
            emailInvalid: "Проверьте формат: name@example.com",
            checkFieldsTitle: "Проверьте поля",
            checkFieldsText: "Исправьте ошибки в форме ниже.",
            telegramTitle: "Переход в Telegram",
            telegramText: "Открою бота. Твои данные уже скопированы, осталось вставить их в чат и завершить заказ на {total}.",
            noSize: "Без размера",
            oneSize: "Один размер",
            sizesLabel: "Размеры: {value}",
            buyer: "Покупатель",
            inStock: "В наличии",
            lowStock: "Мало в наличии",
            noReviewsLabel: "Пока нет отзывов",
            badgeFallback: "Выбор",
            cartTotalLabel: "Итого: {total}",
            badges: {
                hoodie: "Хит",
                sweatshirt: "Новое",
                shirt: "Свежее",
                tie: "Классика",
                cap: "Стрит",
                bag: "Каждый день",
                socks: "Набор"
            }
        },
        uk: {
            title: "KEgling - Магазин одягу",
            languageLabel: "Мова",
            languageAria: "Вибір мови",
            welcomeKicker: "Колекція / 2026",
            scrollHint: "Гортай вниз",
            navFavorites: "Обране",
            navCatalog: "Каталог",
            navAbout: "Про нас",
            navCart: "Кошик",
            miniCartTitle: "Кошик",
            miniCartClose: "Закрити",
            miniCartCheckout: "Перейти в кошик",
            miniCartEmpty: "Кошик порожній — додай товар із каталогу.",
            sidebarTitle: "Колекція",
            sidebarKicker: "Розділи",
            sidebarNote: "Кураторський підбір — міський настрій, чисті лінії, гардероб на щодень.",
            searchLabel: "Пошук",
            searchPlaceholder: "Назва, колір, категорія",
            sortLabel: "Сортування",
            sortAria: "Сортування",
            sortDefault: "За замовчуванням",
            sortPriceAsc: "Спочатку дешевше",
            sortPriceDesc: "Спочатку дорожче",
            sortTitleAsc: "За назвою A-Я",
            filtersTitle: "Фільтри",
            filtersReset: "Скинути фільтри",
            filtersSize: "Розмір",
            filtersColor: "Колір",
            filtersPriceTo: "Ціна до:",
            cartHeading: "Ваш кошик",
            checkoutHeading: "Оформлення замовлення",
            checkoutNote: "Заповни контакти, і ми одразу перекинемо тебе в Telegram-бот для підтвердження.",
            fieldName: "Ім'я",
            fieldSurname: "Прізвище",
            fieldPhone: "Телефон",
            fieldEmail: "Пошта",
            warningTelegram: "Після кнопки відкриється Telegram-бот. Контакти скопіюються в буфер, і їх можна буде одразу вставити в чат для завершення замовлення.",
            checkoutButton: "Оформити замовлення",
            checkoutSubmit: "Перейти в Telegram і оформити",
            backToCatalog: "← Назад до каталогу",
            aboutHeading: "Про KEgling",
            aboutLead: "Ми робимо KEgling для тих, хто любить стильні речі й акуратні деталі.",
            support: "Підтримка:",
            footerCopy: "© 2026 Усі права захищені.",
            modalMaterial: "Матеріал",
            modalFit: "Посадка",
            modalUse: "Для чого",
            chooseSize: "Оберіть розмір:",
            chooseColor: "Оберіть колір:",
            addToCart: "Додати в кошик",
            added: "Додано",
            relatedTitle: "Підійде разом із цим",
            relatedText: "Зібрали речі, які добре доповнюють цей товар.",
            reviewsTitle: "Відгуки",
            reviewsText: "Постав оцінку й напиши свій відгук про цей товар.",
            reviewName: "Ім'я",
            reviewNamePlaceholder: "Наприклад, Кирило",
            reviewRating: "Оцінка",
            reviewTextLabel: "Відгук",
            reviewTextPlaceholder: "Напиши, як тобі товар.",
            reviewSubmit: "Залишити відгук",
            toastReady: "Готово",
            toastAddedDefault: "Товар додано в кошик.",
            recentlyTitle: "Нещодавно переглянуті",
            recentlyText: "Швидкий доступ до товарів, які ти вже відкривав.",
            galleryPrev: "Попереднє фото",
            galleryNext: "Наступне фото",
            favoriteAria: "В обране",
            quickView: "Швидкий перегляд",
            shortAbout: "Коротко про товар",
            delivery: "Доставка по Україні · 1-3 дні",
            noReviews: "Поки немає відгуків. Будь першим, хто поставить оцінку й напише коментар.",
            deleteReview: "Видалити відгук",
            chooseRatingTitle: "Обери оцінку",
            chooseRatingText: "Спочатку постав від 1 до 5 зірок.",
            needReviewTitle: "Потрібен відгук",
            needReviewText: "Напиши кілька слів про товар перед відправленням.",
            reviewAddedTitle: "Відгук додано",
            reviewAddedText: "Дякуємо, відгук збережено для цього товару.",
            reviewDeletedTitle: "Відгук видалено",
            reviewDeletedText: "Коментар прибрано з цього товару.",
            catalogEmpty: "За цими фільтрами товарів поки немає.",
            home: "Головна",
            allProducts: "Усі товари",
            favorites: "Обране",
            removedFavoriteTitle: "Прибрано з обраного",
            removedFavoriteText: "Товар більше не збережений.",
            addedFavoriteTitle: "Додано в обране",
            addedFavoriteText: "Товар збережено, щоб повернутися до нього пізніше.",
            emptyCart: "Кошик поки порожній. Додай товар і повертайся сюди.",
            colorPrefix: "Колір: {value}",
            sizePrefix: "Розмір: {value}",
            articlePrefix: "Артикул: {value}",
            inStockPrefix: "Наявність: {value}",
            ratingPrefix: "Рейтинг: {value}",
            photoAlt: "Фото товару {index}",
            chooseSizeToastTitle: "Обери розмір",
            chooseSizeToastText: "Спочатку познач розмір, а потім додай товар.",
            inCartTitle: "У кошику",
            inCartText: "{title} додано.",
            removedTitle: "Видалено",
            removedText: "Позицію прибрано з кошика.",
            emptyCartTitle: "Кошик порожній",
            emptyCartText: "Спочатку додай хоча б один товар.",
            nameRequired: "Введіть ім'я.",
            surnameRequired: "Введіть прізвище.",
            phoneRequired: "Вкажіть український номер: +380 і 9 цифр (наприклад +380 50 123 45 67).",
            emailRequired: "Введіть email.",
            emailInvalid: "Перевірте формат: name@example.com",
            checkFieldsTitle: "Перевірте поля",
            checkFieldsText: "Виправте помилки у формі нижче.",
            telegramTitle: "Перехід у Telegram",
            telegramText: "Відкрию бота. Твої дані вже скопійовано, залишилось вставити їх у чат і завершити замовлення на {total}.",
            noSize: "Без розміру",
            oneSize: "Один розмір",
            sizesLabel: "Розміри: {value}",
            buyer: "Покупець",
            inStock: "У наявності",
            lowStock: "Мало в наявності",
            noReviewsLabel: "Поки немає відгуків",
            badgeFallback: "Вибір",
            cartTotalLabel: "Разом: {total}",
            badges: {
                hoodie: "Хіт",
                sweatshirt: "Нове",
                shirt: "Свіже",
                tie: "Класика",
                cap: "Стріт",
                bag: "Щодня",
                socks: "Набір"
            }
        },
        en: {
            title: "KEgling - Clothing Store",
            languageLabel: "Language",
            languageAria: "Choose language",
            welcomeKicker: "Collection / 2026",
            scrollHint: "Scroll down",
            navFavorites: "Favorites",
            navCatalog: "Catalog",
            navAbout: "About",
            navCart: "Cart",
            miniCartTitle: "Cart",
            miniCartClose: "Close",
            miniCartCheckout: "Open cart",
            miniCartEmpty: "Your cart is empty — add something from the catalog.",
            sidebarTitle: "Collection",
            sidebarKicker: "Sections",
            sidebarNote: "Curated essentials — city mood, clean lines, everyday wardrobe.",
            searchLabel: "Search",
            searchPlaceholder: "Name, color, category",
            sortLabel: "Sort",
            sortAria: "Sort products",
            sortDefault: "Default",
            sortPriceAsc: "Price: low to high",
            sortPriceDesc: "Price: high to low",
            sortTitleAsc: "Title A-Z",
            filtersTitle: "Filters",
            filtersReset: "Reset filters",
            filtersSize: "Size",
            filtersColor: "Color",
            filtersPriceTo: "Price up to:",
            cartHeading: "Your cart",
            checkoutHeading: "Checkout",
            checkoutNote: "Fill in your contact details and we will instantly send you to the Telegram bot for confirmation.",
            fieldName: "First name",
            fieldSurname: "Last name",
            fieldPhone: "Phone",
            fieldEmail: "Email",
            warningTelegram: "After tapping the button, the Telegram bot will open. Your contact details will be copied to the clipboard so you can paste them into the chat and complete the order.",
            checkoutButton: "Checkout",
            checkoutSubmit: "Open Telegram and order",
            backToCatalog: "← Back to catalog",
            aboutHeading: "About KEgling",
            aboutLead: "We build KEgling for people who love stylish pieces and sharp details.",
            support: "Support:",
            footerCopy: "© 2026 All rights reserved.",
            modalMaterial: "Material",
            modalFit: "Fit",
            modalUse: "Best for",
            chooseSize: "Choose a size:",
            chooseColor: "Choose a color:",
            addToCart: "Add to cart",
            added: "Added",
            relatedTitle: "Pairs well with this",
            relatedText: "Picked a few items that complete this product nicely.",
            reviewsTitle: "Reviews",
            reviewsText: "Leave a rating and write your review for this product.",
            reviewName: "Name",
            reviewNamePlaceholder: "For example, Kirill",
            reviewRating: "Rating",
            reviewTextLabel: "Review",
            reviewTextPlaceholder: "Tell us what you think about the product.",
            reviewSubmit: "Submit review",
            toastReady: "Done",
            toastAddedDefault: "Item added to cart.",
            recentlyTitle: "Recently viewed",
            recentlyText: "Quick access to products you already opened.",
            galleryPrev: "Previous photo",
            galleryNext: "Next photo",
            favoriteAria: "Add to favorites",
            quickView: "Quick view",
            shortAbout: "Quick product facts",
            delivery: "Shipping across Ukraine · 1-3 days",
            noReviews: "No reviews yet. Be the first to rate this item and leave a comment.",
            deleteReview: "Delete review",
            chooseRatingTitle: "Choose a rating",
            chooseRatingText: "Select from 1 to 5 stars first.",
            needReviewTitle: "Review needed",
            needReviewText: "Write a few words about the product before submitting.",
            reviewAddedTitle: "Review added",
            reviewAddedText: "Thanks, your review has been saved for this product.",
            reviewDeletedTitle: "Review deleted",
            reviewDeletedText: "The comment has been removed from this product.",
            catalogEmpty: "No products match these filters yet.",
            home: "Home",
            allProducts: "All products",
            favorites: "Favorites",
            removedFavoriteTitle: "Removed from favorites",
            removedFavoriteText: "The product is no longer saved.",
            addedFavoriteTitle: "Added to favorites",
            addedFavoriteText: "The product was saved so you can return to it later.",
            emptyCart: "Your cart is empty for now. Add a product and come back here.",
            colorPrefix: "Color: {value}",
            sizePrefix: "Size: {value}",
            articlePrefix: "SKU: {value}",
            inStockPrefix: "Availability: {value}",
            ratingPrefix: "Rating: {value}",
            photoAlt: "Product photo {index}",
            chooseSizeToastTitle: "Choose a size",
            chooseSizeToastText: "Pick a size first, then add the product.",
            inCartTitle: "In cart",
            inCartText: "{title} has been added.",
            removedTitle: "Removed",
            removedText: "The item has been removed from the cart.",
            emptyCartTitle: "Cart is empty",
            emptyCartText: "Add at least one product first.",
            nameRequired: "Enter a first name.",
            surnameRequired: "Enter a last name.",
            phoneRequired: "Enter a Ukrainian phone number: +380 and 9 digits (for example +380 50 123 45 67).",
            emailRequired: "Enter an email.",
            emailInvalid: "Check the format: name@example.com",
            checkFieldsTitle: "Check the fields",
            checkFieldsText: "Fix the errors in the form below.",
            telegramTitle: "Opening Telegram",
            telegramText: "I will open the bot. Your details are already copied, so you only need to paste them into the chat and finish the order for {total}.",
            noSize: "No size",
            oneSize: "One size",
            sizesLabel: "Sizes: {value}",
            buyer: "Customer",
            inStock: "In stock",
            lowStock: "Low stock",
            noReviewsLabel: "No reviews yet",
            badgeFallback: "Pick",
            cartTotalLabel: "Total: {total}",
            badges: {
                hoodie: "Hit",
                sweatshirt: "New",
                shirt: "Fresh",
                tie: "Classic",
                cap: "Street",
                bag: "Daily",
                socks: "Set"
            }
        }
    };

    const productTranslations = {
        socks: {
            ru: {
                title: "Набор хлопковых носков SoxBox 12MS-WT-MIX 40-44 Микс",
                desc: "Набор из 12 пар хлопковых носков в миксе цветов для повседневной носки и базового гардероба.",
                tag: "На каждый день",
                material: "Хлопок / эластан",
                fit: "Средняя высота",
                use: "На каждый день",
                points: [
                    "В наборе 12 пар в синем, сером и чёрном цветах.",
                    "Мягкая ткань подходит для повседневной носки.",
                    "В галерее можно посмотреть общий комплект и каждый цвет отдельно."
                ]
            },
            uk: {
                title: "Набір бавовняних шкарпеток SoxBox 12MS-WT-MIX 40-44 Мікс",
                desc: "Набір із 12 пар бавовняних шкарпеток у міксі кольорів для щоденного носіння та базового гардероба.",
                tag: "На щодень",
                material: "Бавовна / еластан",
                fit: "Середня висота",
                use: "На щодень",
                points: [
                    "У наборі 12 пар у синьому, сірому та чорному кольорах.",
                    "М'яка тканина підходить для щоденного носіння.",
                    "У галереї можна подивитися загальний комплект і кожен колір окремо."
                ]
            },
            en: {
                title: "SoxBox 12MS-WT-MIX Cotton Socks Set 40-44",
                desc: "A 12-pair cotton sock set in mixed colors for daily wear and a clean everyday wardrobe.",
                tag: "Daily wear",
                material: "Cotton / elastane",
                fit: "Mid height",
                use: "Everyday use",
                points: [
                    "The set includes 12 pairs in blue, gray, and black.",
                    "Soft fabric works well for everyday wear.",
                    "The gallery shows the full set and each color separately."
                ]
            }
        },
        hoodie: {
            ru: {
                title: "Худи Direct Action Shaka, Black",
                desc: "Чёрное худи с плотной тканью, чистым силуэтом и акцентной вышивкой на груди.",
                tag: "Базовая вещь",
                material: "Хлопок / футер",
                fit: "Свободный крой",
                use: "Город, вечер, повседневный стиль",
                points: [
                    "Глубокий чёрный цвет легко собирает цельный повседневный образ.",
                    "Свободная посадка работает и solo, и поверх базового слоя.",
                    "Три фото в карточке показывают перед, спину и боковой ракурс."
                ]
            },
            uk: {
                title: "Худі Direct Action Shaka, Black",
                desc: "Чорне худі з щільною тканиною, чистим силуетом і виразною вишивкою на грудях.",
                tag: "Базова річ",
                material: "Бавовна / футер",
                fit: "Вільний крій",
                use: "Місто, вечір, повсякденний стиль",
                points: [
                    "Глибокий чорний колір легко збирає цілісний повсякденний образ.",
                    "Вільна посадка працює і solo, і поверх базового шару.",
                    "Три фото в картці показують перед, спину та боковий ракурс."
                ]
            },
            en: {
                title: "Direct Action Shaka Hoodie, Black",
                desc: "A black heavyweight hoodie with a clean silhouette and a bold embroidered detail on the chest.",
                tag: "Core piece",
                material: "Cotton / fleece",
                fit: "Relaxed fit",
                use: "City, evening, everyday style",
                points: [
                    "The deep black tone pulls an everyday outfit together fast.",
                    "The relaxed fit works on its own or over a base layer.",
                    "Three photos show the front, back, and side profile."
                ]
            }
        },
        sweatshirt: {
            ru: {
                title: "Толстовка KEgling White",
                desc: "Светлая толстовка с чистым минималистичным видом и мягким everyday-настроением.",
                tag: "Чистый образ",
                material: "Хлопок / мягкий футер",
                fit: "Стандартный крой",
                use: "Повседневный light-образ",
                points: [
                    "Светлый верх делает образ заметнее и чище.",
                    "Подходит под джинсы, карго и спокойную обувь.",
                    "Хороший вариант для тех, кто любит мягкие базовые цвета."
                ]
            },
            uk: {
                title: "Світшот KEgling White",
                desc: "Світлий світшот із чистим мінімалістичним виглядом і м'яким everyday-настроєм.",
                tag: "Чистий образ",
                material: "Бавовна / м'який футер",
                fit: "Стандартний крій",
                use: "Повсякденний light-образ",
                points: [
                    "Світлий верх робить образ помітнішим і чистішим.",
                    "Пасує до джинсів, карго та спокійного взуття.",
                    "Хороший варіант для тих, хто любить м'які базові кольори."
                ]
            },
            en: {
                title: "KEgling White Sweatshirt",
                desc: "A light sweatshirt with a clean minimalist look and a soft everyday feel.",
                tag: "Clean look",
                material: "Cotton / soft fleece",
                fit: "Regular fit",
                use: "Light everyday outfit",
                points: [
                    "The bright top makes the whole look feel cleaner and more visible.",
                    "Pairs well with jeans, cargos, and understated shoes.",
                    "A strong choice if you like soft neutral basics."
                ]
            }
        },
        shirt: {
            ru: {
                title: "Рубашка 1/2 sleeves Camel Active",
                desc: "Лёгкая рубашка с коротким рукавом в клетку для повседневного летнего образа.",
                tag: "Умный слой",
                material: "Хлопок / поплин",
                fit: "Прямой крой",
                use: "Офис, встреча, вечер",
                points: [
                    "Мягкая ткань комфортно ощущается в течение дня.",
                    "Клетчатый рисунок добавляет образу фактуру и характер.",
                    "Хорошо сочетается с джинсами, чиносами и лёгкими кедами."
                ],
                variants: [
                    { color: "Жёлтый", title: "Рубашка Camel Active" },
                    { color: "Коричневый", title: "Рубашка Camel Active" },
                    { color: "Разноцветный", title: "Рубашка Camel Active" }
                ]
            },
            uk: {
                title: "Сорочка 1/2 sleeves Camel Active",
                desc: "Легка сорочка з коротким рукавом у клітинку для повсякденного літнього образу.",
                tag: "Розумний шар",
                material: "Бавовна / поплін",
                fit: "Прямий крій",
                use: "Офіс, зустріч, вечір",
                points: [
                    "М'яка тканина комфортно відчувається протягом дня.",
                    "Клітинка додає образу фактуру й характер.",
                    "Добре поєднується з джинсами, чиносами та легкими кедами."
                ],
                variants: [
                    { color: "Жовтий", title: "Сорочка Camel Active" },
                    { color: "Коричневий", title: "Сорочка Camel Active" },
                    { color: "Різнокольорова", title: "Сорочка Camel Active" }
                ]
            },
            en: {
                title: "Camel Active Short-Sleeve Shirt",
                desc: "A lightweight checked short-sleeve shirt for an easy summer everyday look.",
                tag: "Smart layer",
                material: "Cotton / poplin",
                fit: "Straight fit",
                use: "Office, meetings, evening",
                points: [
                    "The soft fabric stays comfortable throughout the day.",
                    "The check pattern adds texture and personality.",
                    "Works well with jeans, chinos, and light sneakers."
                ],
                variants: [
                    { color: "Yellow", title: "Camel Active Shirt" },
                    { color: "Brown", title: "Camel Active Shirt" },
                    { color: "Multicolor", title: "Camel Active Shirt" }
                ]
            }
        },
        tie: {
            ru: {
                title: "Галстук Emilio Corali",
                desc: "Классический галстук Emilio Corali с гладкой фактурой для аккуратного делового образа.",
                tag: "Чёткий акцент",
                material: "Полиэстер / сатин",
                fit: "Узкая форма",
                use: "Рубашка, пиджак, событие",
                points: [
                    "Гладкая поверхность смотрится аккуратно и строго.",
                    "Универсальная форма подходит под рубашку и пиджак.",
                    "Хорошо работает в офисном и вечернем комплекте."
                ],
                variants: [
                    { color: "Коричневый", title: "Галстук 8,5х150 см Emilio Corali" },
                    { color: "Серый", title: "Галстук Emilio Corali тёмно-серый мужской" },
                    { color: "Тёмно-серый", title: "Галстук 9х150 см Emilio Corali" },
                    { color: "Фиолетовый", title: "Мужской галстук тёмно-фиолетовый Emilio Corali" }
                ]
            },
            uk: {
                title: "Краватка Emilio Corali",
                desc: "Класична краватка Emilio Corali з гладкою фактурою для акуратного ділового образу.",
                tag: "Чіткий акцент",
                material: "Поліестер / сатин",
                fit: "Вузька форма",
                use: "Сорочка, піджак, подія",
                points: [
                    "Гладка поверхня виглядає акуратно й стримано.",
                    "Універсальна форма пасує до сорочки та піджака.",
                    "Добре працює в офісному й вечірньому комплекті."
                ],
                variants: [
                    { color: "Коричневий", title: "Краватка 8,5х150 см Emilio Corali" },
                    { color: "Сірий", title: "Краватка Emilio Corali темно-сіра чоловіча" },
                    { color: "Темно-сірий", title: "Краватка 9х150 см Emilio Corali" },
                    { color: "Фіолетовий", title: "Чоловіча краватка темно-фіолетова Emilio Corali" }
                ]
            },
            en: {
                title: "Emilio Corali Tie",
                desc: "A classic Emilio Corali tie with a smooth texture for a sharp business look.",
                tag: "Sharp accent",
                material: "Polyester / satin",
                fit: "Slim shape",
                use: "Shirt, blazer, occasion",
                points: [
                    "The smooth surface looks neat and formal.",
                    "Its versatile shape works with shirts and blazers.",
                    "A solid option for office and evening outfits."
                ],
                variants: [
                    { color: "Brown", title: "Emilio Corali Tie 8.5x150 cm" },
                    { color: "Gray", title: "Emilio Corali Dark Gray Tie" },
                    { color: "Dark gray", title: "Emilio Corali Tie 9x150 cm" },
                    { color: "Violet", title: "Emilio Corali Dark Violet Men's Tie" }
                ]
            }
        },
        cap: {
            ru: {
                title: "Кепка SumWin",
                desc: "Бейсболка SumWin с изогнутым козырьком и регулируемой застёжкой на каждый день.",
                tag: "Уличный акцент",
                material: "Хлопок",
                fit: "Регулируемая посадка",
                use: "Город, прогулка, casual",
                points: [
                    "Плотный материал хорошо держит форму.",
                    "Изогнутый козырёк защищает глаза от солнца.",
                    "Регулируемая застёжка помогает подогнать посадку под себя."
                ],
                variants: [
                    { color: "Бордовый", title: "Кепка SumWin" },
                    { color: "Салатовый", title: "Кепка SumWin" }
                ]
            },
            uk: {
                title: "Кепка SumWin",
                desc: "Бейсболка SumWin з вигнутим козирком і регульованою застібкою на щодень.",
                tag: "Вуличний акцент",
                material: "Бавовна",
                fit: "Регульована посадка",
                use: "Місто, прогулянка, casual",
                points: [
                    "Щільний матеріал добре тримає форму.",
                    "Вигнутий козирок захищає очі від сонця.",
                    "Регульована застібка допомагає підігнати посадку під себе."
                ],
                variants: [
                    { color: "Бордовий", title: "Кепка SumWin" },
                    { color: "Салатовий", title: "Кепка SumWin" }
                ]
            },
            en: {
                title: "SumWin Cap",
                desc: "A SumWin baseball cap with a curved brim and adjustable strap for daily wear.",
                tag: "Street accent",
                material: "Cotton",
                fit: "Adjustable fit",
                use: "City, walks, casual",
                points: [
                    "The dense fabric holds its shape well.",
                    "The curved brim helps shield your eyes from the sun.",
                    "The adjustable strap makes the fit easy to tune."
                ],
                variants: [
                    { color: "Burgundy", title: "SumWin Cap" },
                    { color: "Light green", title: "SumWin Cap" }
                ]
            }
        },
        bag: {
            ru: {
                title: "Сумка KEgling Daily",
                desc: "Компактная чёрная сумка через плечо для повседневных вещей и чистого городского силуэта.",
                tag: "Повседневный формат",
                material: "Нейлон / плотная стропа",
                fit: "Компактная кроссбоди",
                use: "Город, учёба, поездки",
                points: [
                    "Вмещает базовые вещи и не утяжеляет образ.",
                    "Работает и с casual, и с более собранным комплектом.",
                    "Особенно хорошо сочетается с худи, рубашкой и кепкой."
                ]
            },
            uk: {
                title: "Сумка KEgling Daily",
                desc: "Компактна чорна сумка через плече для повсякденних речей і чистого міського силуету.",
                tag: "Щоденний формат",
                material: "Нейлон / щільна стропа",
                fit: "Компактна кросбоді",
                use: "Місто, навчання, поїздки",
                points: [
                    "Вміщує базові речі й не обтяжує образ.",
                    "Працює і з casual, і з більш зібраним комплектом.",
                    "Особливо добре поєднується з худі, сорочкою та кепкою."
                ]
            },
            en: {
                title: "KEgling Daily Bag",
                desc: "A compact black crossbody bag for everyday essentials and a clean city silhouette.",
                tag: "Daily format",
                material: "Nylon / dense strap",
                fit: "Compact crossbody",
                use: "City, study, trips",
                points: [
                    "Fits the basics without weighing down the outfit.",
                    "Works with casual looks and more polished sets alike.",
                    "Especially strong with a hoodie, shirt, and cap."
                ]
            }
        }
    };

    function loadLanguage() {
        try {
            const saved = localStorage.getItem(LANGUAGE_KEY);
            return SUPPORTED_LANGUAGES.includes(saved) ? saved : "ru";
        } catch {
            return "ru";
        }
    }

    function saveLanguage(lang) {
        try {
            localStorage.setItem(LANGUAGE_KEY, lang);
        } catch {}
    }

    function t(key, vars = {}) {
        const dict = uiText[currentLanguage] || uiText.ru;
        let value = dict[key] ?? uiText.ru[key] ?? "";
        if (typeof value !== "string") return "";
        return value.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
    }

    function getLocalizedProduct(id) {
        const product = products[id];
        const translation = productTranslations[id]?.[currentLanguage] || productTranslations[id]?.ru || {};
        const localized = { ...product, ...translation };
        if (Array.isArray(product.variants)) {
            localized.variants = product.variants.map((variant, index) => ({
                ...variant,
                ...(translation.variants?.[index] || {})
            }));
        }
        return localized;
    }

    function getCatalogFilterLabel(id) {
        return catalogFilterLabels[currentLanguage]?.[id] || catalogFilterLabels.ru?.[id] || id;
    }

    function getLocalizedCartItem(item) {
        const product = item.productId ? getLocalizedProduct(item.productId) : null;
        const variant = product?.variants?.[item.variantIndex ?? -1] || null;
        return {
            title: variant?.title || product?.title || item.title,
            color: variant?.color || item.color || null,
            size: item.size === NO_SIZE_VALUE ? t("noSize") : item.size
        };
    }

    function updateCartCountUi() {
        const nav = document.getElementById("cart-nav-link");
        if (nav) {
            nav.innerHTML = `${t("navCart")} (<span id="cart-count">${cart.length}</span>)`;
        }
    }

    function applyStaticTexts() {
        document.documentElement.lang = currentLanguage;
        document.title = t("title");

        const setText = (selector, value) => {
            const node = document.querySelector(selector);
            if (node) node.textContent = value;
        };
        const setPlaceholder = (selector, value) => {
            const node = document.querySelector(selector);
            if (node) node.placeholder = value;
        };

        setText("#language-picker-label", t("languageLabel"));
        const languageSelect = document.getElementById("language-select");
        if (languageSelect) {
            languageSelect.value = currentLanguage;
            languageSelect.setAttribute("aria-label", t("languageAria"));
        }

        setText(".welcome-kicker", t("welcomeKicker"));
        setText(".scroll-hint", t("scrollHint"));
        setText("#favorites-nav-link", t("navFavorites"));
        setText("header nav a:nth-of-type(2)", t("navCatalog"));
        setText("header nav a:nth-of-type(3)", t("navAbout"));
        updateCartCountUi();
        setText("#mini-cart-title", t("miniCartTitle"));
        setText(".mini-cart__checkout", t("miniCartCheckout"));
        document.querySelector(".mini-cart__close")?.setAttribute("aria-label", t("miniCartClose"));
        setText(".sidebar-title", t("sidebarTitle"));
        setText(".sidebar-kicker", t("sidebarKicker"));
        setText(".sidebar-note", t("sidebarNote"));
        document.querySelectorAll(".sidebar-link").forEach((button) => {
            const filterId = button.dataset.filter;
            if (filterId) button.textContent = getCatalogFilterLabel(filterId);
        });
        setText(".catalog-field--search .catalog-field__label", t("searchLabel"));
        setText(".catalog-field--sort .catalog-field__label", t("sortLabel"));
        setPlaceholder("#catalog-search", t("searchPlaceholder"));
        const sortSelect = document.getElementById("catalog-sort");
        if (sortSelect) {
            sortSelect.setAttribute("aria-label", t("sortAria"));
            if (sortSelect.options[0]) sortSelect.options[0].text = t("sortDefault");
            if (sortSelect.options[1]) sortSelect.options[1].text = t("sortPriceAsc");
            if (sortSelect.options[2]) sortSelect.options[2].text = t("sortPriceDesc");
            if (sortSelect.options[3]) sortSelect.options[3].text = t("sortTitleAsc");
        }
        setText(".catalog-filters-panel__title", t("filtersTitle"));
        setText("#catalog-filters-reset", t("filtersReset"));
        const rows = document.querySelectorAll(".catalog-filters-panel__kicker");
        if (rows[0]) rows[0].textContent = t("filtersSize");
        if (rows[1]) rows[1].textContent = t("filtersColor");
        const priceLabel = document.querySelector(".catalog-filters-panel__price-label");
        if (priceLabel) {
            const output = document.getElementById("catalog-price-output");
            priceLabel.childNodes[0].textContent = `${t("filtersPriceTo")} `;
            if (output) priceLabel.appendChild(output);
        }
        setText("#section-cart h2", t("cartHeading"));
        setText("#order-form h3", t("checkoutHeading"));
        setText(".form-note", t("checkoutNote"));
        setText(".bot-warning", t("warningTelegram"));
        setText("#checkout-btn", t("checkoutButton"));
        setText("#order-form .buy-now-btn", t("checkoutSubmit"));
        document.querySelectorAll(".back-link").forEach((link) => {
            link.textContent = t("backToCatalog");
        });
        setText("#section-about h2", t("aboutHeading"));
        setText(".about-lead", t("aboutLead"));
        setText(".support-card p", t("support"));
        setText(".footer-copy", t("footerCopy"));
        const orderFields = document.querySelectorAll("#order-form .field > span");
        if (orderFields[0]) orderFields[0].textContent = t("fieldName");
        if (orderFields[1]) orderFields[1].textContent = t("fieldSurname");
        if (orderFields[2]) orderFields[2].textContent = t("fieldPhone");
        if (orderFields[3]) orderFields[3].textContent = t("fieldEmail");
        setPlaceholder("#user-name", currentLanguage === "en" ? "Kirill" : currentLanguage === "uk" ? "Кирило" : "Кирилл");
        setPlaceholder("#user-surname", currentLanguage === "en" ? "Ivanov" : currentLanguage === "uk" ? "Іванов" : "Иванов");
        setText(".detail-card:nth-of-type(1) .detail-label", t("modalMaterial"));
        setText(".detail-card:nth-of-type(2) .detail-label", t("modalFit"));
        setText(".detail-card:nth-of-type(3) .detail-label", t("modalUse"));
        setText("#size-section p b", t("chooseSize"));
        setText("#color-section p b", t("chooseColor"));
        setText("#modal-add-btn", t("addToCart"));
        setText(".related-section .related-head h3", t("relatedTitle"));
        setText(".related-section .related-head p", t("relatedText"));
        setText(".reviews-section .related-head h3", t("reviewsTitle"));
        setText(".reviews-section .related-head p", t("reviewsText"));
        const reviewAuthorLabel = document.querySelector("#review-author")?.closest(".field")?.querySelector("span");
        const reviewTextLabel = document.querySelector("#review-text")?.closest(".field")?.querySelector("span");
        const reviewRating = document.querySelector("#review-stars")?.closest(".field")?.querySelector("span");
        if (reviewAuthorLabel) reviewAuthorLabel.textContent = t("reviewName");
        if (reviewTextLabel) reviewTextLabel.textContent = t("reviewTextLabel");
        if (reviewRating) reviewRating.textContent = t("reviewRating");
        setPlaceholder("#review-author", t("reviewNamePlaceholder"));
        setPlaceholder("#review-text", t("reviewTextPlaceholder"));
        setText(".review-submit", t("reviewSubmit"));
        setText("#toast-title", t("toastReady"));
        setText("#toast-message", t("toastAddedDefault"));
        setText("#recently-viewed .related-head h3", t("recentlyTitle"));
        setText("#recently-viewed .related-head p", t("recentlyText"));
        document.getElementById("gallery-prev")?.setAttribute("aria-label", t("galleryPrev"));
        document.getElementById("gallery-next")?.setAttribute("aria-label", t("galleryNext"));
        document.querySelectorAll(".review-delete").forEach((button) => {
            button.setAttribute("aria-label", t("deleteReview"));
        });
    }

    function getLocalizedBadge(id) {
        return uiText[currentLanguage].badges[id] || uiText.ru.badges[id] || t("badgeFallback");
    }

    function getLocalizedAvailability(id) {
        return id === "sweatshirt" || id === "cap" ? t("lowStock") : t("inStock");
    }

    function getLocalizedSizeSummary(product) {
        if (!product?.sizes || !product.sizes.length) return t("oneSize");
        if (product.sizes.length <= 4) return t("sizesLabel", { value: product.sizes.join(", ") });
        return t("sizesLabel", { value: `${product.sizes[0]}-${product.sizes[product.sizes.length - 1]}` });
    }

    function getLocalizedRatingMeta(id) {
        const reviews = getProductReviews(id);
        if (!reviews.length) return { average: 0, count: 0, label: t("noReviewsLabel") };
        const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const average = total / reviews.length;
        return { average, count: reviews.length, label: `${average.toFixed(1)} ★ (${reviews.length})` };
    }

    function getSearchTextLocalized(product, id) {
        const localized = getLocalizedProduct(id);
        const variantsText = Array.isArray(localized.variants)
            ? localized.variants.map((variant) => `${variant.title} ${variant.color || ""}`).join(" ")
            : "";
        const categoriesText = Array.isArray(localized.categories)
            ? localized.categories.map((category) => getCatalogFilterLabel(category)).join(" ")
            : "";
        return [
            localized.title,
            localized.desc,
            localized.tag,
            getLocalizedBadge(id),
            getLocalizedAvailability(id),
            getLocalizedSizeSummary(localized),
            categoriesText,
            variantsText
        ].join(" ").toLowerCase();
    }

    createProductCard = function (id, index = 0, options = {}) {
        const product = getLocalizedProduct(id);
        if (!product) return null;
        const card = document.createElement("article");
        const rating = getLocalizedRatingMeta(id);
        const isFavorite = favoriteIds.has(id);
        const compactClass = options.compact ? " compact" : "";
        const availability = getLocalizedAvailability(id);

        card.className = `card${compactClass} reveal-card`.trim();
        card.dataset.productId = id;
        card.innerHTML = `
            <div class="card-badges">
                <span class="card-badge">${getLocalizedBadge(id)}</span>
                <span class="card-rating">${rating.label}</span>
            </div>
            <button type="button" class="favorite-btn${isFavorite ? " active" : ""}" aria-label="${t("favoriteAria")}">♥</button>
            <img src="${product.img}" alt="${escapeHtml(product.title)}" loading="lazy" decoding="async" style="object-position:${product.imagePosition || "center center"};">
            <h3>${escapeHtml(product.title)}</h3>
            <div class="card-meta">
                <span class="card-meta-pill">${escapeHtml(getLocalizedSizeSummary(product))}</span>
                <span class="card-meta-pill availability ${availability.toLowerCase().includes("low") || availability.toLowerCase().includes("мало") ? "low" : ""}">${escapeHtml(availability)}</span>
            </div>
            <div class="card-spec-row" aria-label="${t("shortAbout")}">
                <span class="card-spec card-spec--material">${escapeHtml(truncateText(product.material, 36))}</span>
                <span class="card-spec card-spec--delivery">${t("delivery")}</span>
            </div>
            <p class="card-price">${formatPriceHtml(product.price)}</p>
            <button type="button" class="quick-view-btn">${t("quickView")}</button>
        `;
        card.addEventListener("click", () => openModal(id));
        card.querySelector(".quick-view-btn")?.addEventListener("click", (event) => {
            event.stopPropagation();
            openModal(id);
        });
        card.querySelector(".favorite-btn")?.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleFavorite(id);
        });
        return card;
    };

    renderCatalog = function () {
        const grid = document.getElementById("products-grid");
        if (!grid) return;
        grid.innerHTML = "";
        let visibleIds = catalogOrder.filter((id) => {
            const product = products[id];
            if (!product) return false;
            if (!activeCatalogFilter) return true;
            return Array.isArray(product.categories) && product.categories.includes(activeCatalogFilter);
        });
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            visibleIds = visibleIds.filter((id) => getSearchTextLocalized(products[id], id).includes(query));
        }
        visibleIds = visibleIds.filter((id) => productMatchesPriceSlider(products[id].price));
        visibleIds = visibleIds.filter((id) => productMatchesSizeFilters(id));
        visibleIds = visibleIds.filter((id) => productMatchesColorFilters(id));
        if (favoritesOnly) visibleIds = visibleIds.filter((id) => favoriteIds.has(id));
        if (sortMode === "price-asc") visibleIds.sort((a, b) => products[a].price - products[b].price);
        else if (sortMode === "price-desc") visibleIds.sort((a, b) => products[b].price - products[a].price);
        else if (sortMode === "title-asc") visibleIds.sort((a, b) => getLocalizedProduct(a).title.localeCompare(getLocalizedProduct(b).title, currentLanguage));
        visibleIds.forEach((id, index) => {
            const card = createProductCard(id, index);
            if (card) grid.appendChild(card);
        });
        if (!visibleIds.length) grid.innerHTML = `<div class="catalog-empty">${t("catalogEmpty")}</div>`;
        updateActiveFilterUi();
        updateCatalogBreadcrumb();
        renderRecentlyViewed();
        document.dispatchEvent(new CustomEvent("kegling:dom-updated"));
    };

    renderRecentlyViewed = function () {
        const section = document.getElementById("recently-viewed");
        const grid = document.getElementById("recently-viewed-grid");
        if (!section || !grid) return;
        const ids = loadRecentlyViewed().filter((id) => products[id]);
        grid.innerHTML = "";
        if (!ids.length || favoritesOnly) {
            section.style.display = "none";
            return;
        }
        ids.forEach((id, index) => {
            const card = createProductCard(id, index, { compact: true });
            if (card) grid.appendChild(card);
        });
        section.style.display = "block";
    };

    updateActiveFilterUi = function () {
        const filterNode = document.getElementById("active-filter");
        const filterLabel = document.getElementById("active-filter-label");
        const buttons = document.querySelectorAll(".sidebar-link");
        const catalogPage = document.getElementById("section-main");
        const favoritesLink = document.getElementById("favorites-nav-link");
        const mainVisible = catalogPage && getComputedStyle(catalogPage).display !== "none";
        buttons.forEach((button) => {
            const match = button.dataset.filter === activeCatalogFilter;
            button.classList.toggle("active", mainVisible && match);
        });
        catalogPage?.classList.toggle("favorites-mode", favoritesOnly);
        favoritesLink?.classList.toggle("active", mainVisible && favoritesOnly);
        if (!filterNode || !filterLabel) return;
        if (!activeCatalogFilter || favoritesOnly) {
            filterNode.style.display = "none";
            filterLabel.innerText = "";
            return;
        }
        filterNode.style.display = "inline-flex";
        filterLabel.innerText = getCatalogFilterLabel(activeCatalogFilter);
    };

    toggleFavorite = function (id) {
        if (favoriteIds.has(id)) {
            favoriteIds.delete(id);
            showToast(t("removedFavoriteTitle"), t("removedFavoriteText"), "success");
        } else {
            favoriteIds.add(id);
            showToast(t("addedFavoriteTitle"), t("addedFavoriteText"), "success");
        }
        saveFavorites();
        renderCatalog();
    };

    renderColorOptions = function (product) {
        const colorSection = document.getElementById("color-section");
        const colorContainer = document.getElementById("color-container");
        colorContainer.innerHTML = "";
        if (!product.variants || !product.variants.length) {
            colorSection.style.display = "none";
            return;
        }
        colorSection.style.display = "block";
        product.variants.forEach((variant, index) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `color-btn${index === 0 ? " active" : ""}`;
            btn.innerText = variant.color;
            btn.addEventListener("click", () => selectColorVariant(variant, btn, product, index));
            colorContainer.appendChild(btn);
        });
    };

    selectColorVariant = function (variant, button, product, index) {
        selectedVariantIndex = index;
        selectedVariant = variant;
        document.querySelectorAll(".color-btn").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        document.getElementById("modalTitle").innerText = variant.title;
        renderModalMeta(variant, product);
        setModalImage(variant.img, product.imagePosition);
        renderGallery(variant.gallery || [variant.img], product.imagePosition);
    };

    renderModalMeta = function (activeProduct, baseProduct) {
        const metaNode = document.getElementById("modalMeta");
        if (!metaNode) return;
        const parts = [];
        if (activeProduct.color) parts.push(t("colorPrefix", { value: activeProduct.color }));
        if (activeProduct.sku) parts.push(t("articlePrefix", { value: activeProduct.sku }));
        if (activeProduct.sizeLabel) parts.push(t("sizePrefix", { value: activeProduct.sizeLabel }));
        else if (baseProduct.sizes && baseProduct.sizes.length === 1) parts.push(t("sizePrefix", { value: baseProduct.sizes[0] }));
        metaNode.innerText = parts.join(" • ");
    };

    renderRelatedProducts = function (ids) {
        const container = document.getElementById("related-products");
        container.innerHTML = "";
        ids.forEach((id) => {
            const product = getLocalizedProduct(id);
            if (!product) return;
            const card = document.createElement("button");
            card.type = "button";
            card.className = "related-card";
            card.onclick = () => openModal(id);
            card.innerHTML = `
                <img src="${product.img}" alt="${product.title}" loading="lazy" decoding="async" style="object-position:${product.imagePosition || "center center"};">
                <div class="related-card-copy">
                    <div class="related-card-title">${product.title}</div>
                    <div class="related-card-desc">${product.tag}</div>
                    <div class="related-card-meta">${formatPriceHtml(product.price)}</div>
                </div>
            `;
            container.appendChild(card);
        });
    };

    renderReviews = function (reviews) {
        const container = document.getElementById("reviews-list");
        if (!container) return;
        container.innerHTML = "";
        if (!reviews.length) {
            container.innerHTML = `<div class="reviews-empty">${t("noReviews")}</div>`;
            return;
        }
        reviews.forEach((review) => {
            const card = document.createElement("div");
            card.className = "review-card";
            card.innerHTML = `
                <div class="review-head">
                    <strong>${escapeHtml(review.author)}</strong>
                    <div class="review-head-actions">
                        <span>${"★".repeat(review.rating || 0)}</span>
                        <button type="button" class="review-delete" aria-label="${t("deleteReview")}">×</button>
                    </div>
                </div>
                <p>${escapeHtml(review.text)}</p>
            `;
            card.querySelector(".review-delete")?.addEventListener("click", () => {
                deleteReview(currentId, review.createdAt);
            });
            container.appendChild(card);
        });
    };

    submitReview = function (event) {
        event.preventDefault();
        if (!currentId) return;
        const authorInput = document.getElementById("review-author");
        const textInput = document.getElementById("review-text");
        const author = authorInput?.value.trim() || t("buyer");
        const text = textInput?.value.trim() || "";
        if (!selectedReviewRating) {
            showToast(t("chooseRatingTitle"), t("chooseRatingText"), "error");
            return;
        }
        if (!text) {
            showToast(t("needReviewTitle"), t("needReviewText"), "error");
            return;
        }
        const reviewsMap = loadUserReviews();
        const nextReview = { author, text, rating: selectedReviewRating, createdAt: Date.now() };
        reviewsMap[currentId] = [nextReview, ...(reviewsMap[currentId] || [])];
        saveUserReviews(reviewsMap);
        resetReviewForm();
        renderReviews(getProductReviews(currentId));
        showToast(t("reviewAddedTitle"), t("reviewAddedText"), "success");
    };

    deleteReview = function (productId, reviewId) {
        if (!productId || !reviewId) return;
        const reviewsMap = loadUserReviews();
        const reviews = Array.isArray(reviewsMap[productId]) ? reviewsMap[productId] : [];
        reviewsMap[productId] = reviews.filter((review) => review.createdAt !== reviewId);
        saveUserReviews(reviewsMap);
        renderReviews(getProductReviews(productId));
        showToast(t("reviewDeletedTitle"), t("reviewDeletedText"), "success");
    };

    updateCatalogBreadcrumb = function () {
        const el = document.getElementById("catalog-breadcrumb");
        if (!el) return;
        const parts = [];
        parts.push(`<span class="catalog-breadcrumb__item"><a href="#" class="catalog-breadcrumb__link" data-bc="home">${t("home")}</a></span>`);
        parts.push(`<span class="catalog-breadcrumb__sep" aria-hidden="true">›</span>`);
        parts.push(`<span class="catalog-breadcrumb__item"><a href="#" class="catalog-breadcrumb__link" data-bc="catalog">${t("navCatalog")}</a></span>`);
        if (favoritesOnly) {
            parts.push(`<span class="catalog-breadcrumb__sep" aria-hidden="true">›</span>`);
            parts.push(`<span class="catalog-breadcrumb__current">${t("favorites")}</span>`);
        } else if (activeCatalogFilter) {
            parts.push(`<span class="catalog-breadcrumb__sep" aria-hidden="true">›</span>`);
            parts.push(`<span class="catalog-breadcrumb__current">${escapeHtml(getCatalogFilterLabel(activeCatalogFilter))}</span>`);
        } else {
            parts.push(`<span class="catalog-breadcrumb__sep" aria-hidden="true">›</span>`);
            parts.push(`<span class="catalog-breadcrumb__current">${t("allProducts")}</span>`);
        }
        el.innerHTML = parts.join("");
        el.querySelectorAll("[data-bc]").forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const target = link.getAttribute("data-bc");
                if (target === "home") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    return;
                }
                if (target === "catalog") openCatalogPage();
            });
        });
    };

    renderMiniCart = function () {
        const list = document.getElementById("mini-cart-list");
        const totalEl = document.getElementById("mini-cart-total");
        if (!list || !totalEl) return;
        if (!cart.length) {
            list.innerHTML = `<div class="mini-cart__empty">${t("miniCartEmpty")}</div>`;
            totalEl.textContent = "";
            return;
        }
        let total = 0;
        list.innerHTML = "";
        cart.forEach((item, index) => {
            total += item.price;
            const thumb = item.productId && products[item.productId] ? products[item.productId].img : "";
            const display = getLocalizedCartItem(item);
            const row = document.createElement("div");
            row.className = "mini-cart__item";
            row.innerHTML = `
                ${thumb ? `<img class="mini-cart__thumb" src="${thumb}" alt="">` : `<div class="mini-cart__thumb mini-cart__thumb--ph"></div>`}
                <div class="mini-cart__item-body">
                    <div class="mini-cart__item-title">${escapeHtml(display.title)}</div>
                    <div class="mini-cart__item-meta">${display.color ? `${escapeHtml(display.color)} · ` : ""}${escapeHtml(display.size)}</div>
                    <div class="mini-cart__item-price">${formatPrice(item.price)}</div>
                </div>
                <button type="button" class="mini-cart__remove" aria-label="${t("removedTitle")}">×</button>
            `;
            row.querySelector(".mini-cart__remove")?.addEventListener("click", (e) => {
                e.stopPropagation();
                removeItem(index);
            });
            list.appendChild(row);
        });
        totalEl.textContent = t("cartTotalLabel", { total: formatPrice(total) });
    };

    openModal = function (id) {
        currentId = id;
        selectedSize = null;
        selectedVariantIndex = 0;
        const product = getLocalizedProduct(id);
        if (!product) return;
        closeMiniCart();
        pushRecentlyViewed(id);
        renderRecentlyViewed();
        const activeProduct = product.variants ? product.variants[0] : product;
        selectedVariant = product.variants ? product.variants[0] : null;
        setModalImage(activeProduct.img, product.imagePosition);
        document.getElementById("modalTitle").innerText = activeProduct.title || product.title;
        renderModalMeta(activeProduct, product);
        document.getElementById("modalDesc").innerText = product.desc;
        document.getElementById("modalTag").innerText = `${getLocalizedBadge(id)} • ${product.tag}`;
        document.getElementById("modalPrice").innerHTML = formatPriceHtml(product.price);
        document.getElementById("modalMaterial").innerText = product.material;
        document.getElementById("modalFit").innerText = product.fit;
        document.getElementById("modalUse").innerText = product.use;
        renderProductPoints([
            ...(product.points || []),
            t("inStockPrefix", { value: getLocalizedAvailability(id) }),
            getLocalizedSizeSummary(product),
            t("ratingPrefix", { value: getLocalizedRatingMeta(id).label })
        ]);
        renderGallery(activeProduct.gallery || product.gallery || [activeProduct.img || product.img], product.imagePosition);
        renderRelatedProducts(product.related);
        resetReviewForm();
        renderReviews(getProductReviews(id));
        const sizeSection = document.getElementById("size-section");
        const container = document.getElementById("size-container");
        container.innerHTML = "";
        if (product.sizes) {
            sizeSection.style.display = "block";
            product.sizes.forEach((size) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "size-btn";
                btn.innerText = size;
                btn.onclick = function () { selectSize(this); };
                container.appendChild(btn);
            });
        } else {
            sizeSection.style.display = "none";
        }
        renderColorOptions(product);
        document.getElementById("modal-add-btn").classList.remove("success");
        document.getElementById("modal-add-btn").innerText = t("addToCart");
        document.getElementById("productModal").style.display = "flex";
        document.body.classList.add("product-modal-open");
    };

    renderGallery = function (images, position = "center center") {
        const gallery = document.getElementById("modalGallery");
        gallery.innerHTML = "";
        currentGalleryImages = images || [];
        currentGalleryIndex = 0;
        currentGalleryPosition = position;
        if (!images || images.length < 2) {
            gallery.style.display = "none";
            syncGalleryImage();
            return;
        }
        gallery.style.display = "grid";
        images.forEach((src, index) => {
            const thumb = document.createElement("button");
            thumb.type = "button";
            thumb.className = `gallery-thumb${index === 0 ? " active" : ""}`;
            thumb.innerHTML = `<img src="${src}" alt="${t("photoAlt", { index: index + 1 })}" style="object-position:${position};">`;
            thumb.addEventListener("click", () => {
                currentGalleryIndex = index;
                syncGalleryImage();
            });
            gallery.appendChild(thumb);
        });
        syncGalleryImage();
    };

    addToCart = function () {
        const product = getLocalizedProduct(currentId);
        if (!product) return;
        if (product.sizes && !selectedSize) {
            showToast(t("chooseSizeToastTitle"), t("chooseSizeToastText"), "error");
            return;
        }
        cart.push({
            title: selectedVariant?.title || product.title,
            price: product.price,
            size: selectedSize || NO_SIZE_VALUE,
            color: selectedVariant?.color || null,
            productId: currentId,
            variantIndex: product.variants ? selectedVariantIndex : null
        });
        updateCartCountUi();
        animateAddToCart();
        if (document.getElementById("mini-cart")?.classList.contains("is-open")) renderMiniCart();
        const btn = document.getElementById("modal-add-btn");
        btn.classList.add("success");
        btn.innerText = t("added");
        setTimeout(() => {
            closeModal();
            renderCart();
            showToast(t("inCartTitle"), t("inCartText", { title: product.title }), "success");
            btn.classList.remove("success");
            btn.innerText = t("addToCart");
        }, 700);
    };

    renderCart = function () {
        const list = document.getElementById("cart-list");
        const totalNode = document.getElementById("cart-total");
        const checkoutBtn = document.getElementById("checkout-btn");
        const formNode = document.getElementById("order-form");
        let total = 0;
        list.innerHTML = "";
        cart.forEach((item, index) => {
            total += item.price;
            const display = getLocalizedCartItem(item);
            list.innerHTML += `
                <div class="cart-row">
                    <div>
                        <div class="cart-row-title">${escapeHtml(display.title)}</div>
                        ${display.color ? `<div class="cart-row-subtitle">${t("colorPrefix", { value: escapeHtml(display.color) })}</div>` : ""}
                        <div class="cart-row-subtitle">${t("sizePrefix", { value: escapeHtml(display.size) })}</div>
                    </div>
                    <div class="cart-row-price">
                        <span>${formatPrice(item.price)}</span>
                        <span class="remove-x" onclick="removeItem(${index})">×</span>
                    </div>
                </div>
            `;
        });
        if (!cart.length) {
            list.innerHTML = `<div class="cart-empty">${t("emptyCart")}</div>`;
            formNode.style.display = "none";
            checkoutBtn.style.display = "block";
        }
        totalNode.innerText = t("cartTotalLabel", { total: formatPrice(total) });
        if (document.getElementById("mini-cart")?.classList.contains("is-open")) renderMiniCart();
    };

    removeItem = function (index) {
        cart.splice(index, 1);
        updateCartCountUi();
        renderCart();
        showToast(t("removedTitle"), t("removedText"), "success");
    };

    showOrderForm = function () {
        if (cart.length === 0) {
            showToast(t("emptyCartTitle"), t("emptyCartText"), "error");
            return;
        }
        document.getElementById("order-form").style.display = "block";
        document.getElementById("checkout-btn").style.display = "none";
        document.getElementById("order-form").scrollIntoView({ behavior: "smooth", block: "start" });
    };

    submitOrder = function (event) {
        event.preventDefault();
        clearOrderFieldErrors();
        const name = document.getElementById("user-name").value.trim();
        const surname = document.getElementById("user-surname").value.trim();
        const phoneRaw = document.getElementById("user-phone").value.trim();
        const email = document.getElementById("user-email").value.trim();
        let hasError = false;
        if (!name) {
            setFieldError("user-name", "err-user-name", t("nameRequired"));
            hasError = true;
        }
        if (!surname) {
            setFieldError("user-surname", "err-user-surname", t("surnameRequired"));
            hasError = true;
        }
        const phoneDigits = normalizeUaPhoneDigits(phoneRaw);
        if (!phoneDigits || !isValidUaMobile(phoneDigits)) {
            setFieldError("user-phone", "err-user-phone", t("phoneRequired"));
            hasError = true;
        }
        if (!email) {
            setFieldError("user-email", "err-user-email", t("emailRequired"));
            hasError = true;
        } else if (!validateEmail(email)) {
            setFieldError("user-email", "err-user-email", t("emailInvalid"));
            hasError = true;
        }
        if (hasError) {
            showToast(t("checkFieldsTitle"), t("checkFieldsText"), "error");
            return;
        }
        const customer = { name, surname, phone: formatUaPhoneDisplay(phoneDigits), email };
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const contactLine = `${customer.name} ${customer.surname}; ${customer.phone}; ${customer.email}`;
        const payload = buildTelegramStartPayload();
        const botUrl = `https://t.me/${BOT_USERNAME}?start=${payload}`;
        copyText(contactLine);
        showToast(t("telegramTitle"), t("telegramText", { total: formatPrice(total) }), "success");
        window.setTimeout(() => {
            window.open(botUrl, "_blank");
            resetOrderState();
        }, 700);
    };

    resetOrderState = function () {
        cart = [];
        updateCartCountUi();
        clearOrderFieldErrors();
        document.getElementById("order-form").reset();
        document.getElementById("order-form").style.display = "none";
        document.getElementById("checkout-btn").style.display = "block";
        renderCart();
        renderMiniCart();
        showSection("main");
    };

    buildTelegramStartPayload = function () {
        const encodedItems = cart
            .map((item) => {
                const productId = item.productId || Object.keys(products).find((id) => products[id].title === item.title);
                if (!productId) return "";
                const productCode = productCodeMap[productId];
                const sizeCode = item.size && item.size !== NO_SIZE_VALUE
                    ? item.size.replace(/[^a-zA-Z0-9]/g, "_")
                    : "none";
                return `${productCode}-${sizeCode}`;
            })
            .filter(Boolean)
            .join(".");
        const safePayload = encodedItems || "catalog";
        return `site_${toBase64Url(safePayload)}`;
    };

    initAdvancedCatalogFilters = function () {
        catalogPriceCeiling = computeCatalogPriceCeiling();
        priceSliderMax = catalogPriceCeiling;
        const slider = document.getElementById("catalog-price-slider");
        const output = document.getElementById("catalog-price-output");
        if (slider) {
            slider.max = String(catalogPriceCeiling);
            slider.value = String(priceSliderMax);
            slider.oninput = () => {
                priceSliderMax = Number(slider.value) || catalogPriceCeiling;
                if (output) output.textContent = formatPrice(priceSliderMax);
                renderCatalog();
            };
        }
        if (output) output.textContent = formatPrice(priceSliderMax);
        const sizeWrap = document.getElementById("filter-size-chips");
        const colorWrap = document.getElementById("filter-color-chips");
        if (sizeWrap) {
            sizeWrap.innerHTML = "";
            collectCatalogSizeOptions().forEach((size) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "filter-chip";
                btn.dataset.value = size;
                btn.textContent = size;
                btn.onclick = () => {
                    if (selectedFilterSizes.has(size)) selectedFilterSizes.delete(size);
                    else selectedFilterSizes.add(size);
                    btn.classList.toggle("is-active", selectedFilterSizes.has(size));
                    renderCatalog();
                };
                sizeWrap.appendChild(btn);
            });
            const noneBtn = document.createElement("button");
            noneBtn.type = "button";
            noneBtn.className = "filter-chip";
            noneBtn.dataset.value = NO_SIZE_VALUE;
            noneBtn.textContent = t("noSize");
            noneBtn.onclick = () => {
                if (selectedFilterSizes.has(NO_SIZE_VALUE)) selectedFilterSizes.delete(NO_SIZE_VALUE);
                else selectedFilterSizes.add(NO_SIZE_VALUE);
                noneBtn.classList.toggle("is-active", selectedFilterSizes.has(NO_SIZE_VALUE));
                renderCatalog();
            };
            sizeWrap.appendChild(noneBtn);
        }
        if (colorWrap) {
            colorWrap.innerHTML = "";
            const colors = new Set();
            catalogOrder.forEach((id) => {
                const product = getLocalizedProduct(id);
                product?.variants?.forEach((variant) => {
                    if (variant.color) colors.add(variant.color);
                });
            });
            [...colors].sort((a, b) => a.localeCompare(b, currentLanguage)).forEach((color) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "filter-chip";
                btn.dataset.value = color;
                btn.textContent = color;
                btn.onclick = () => {
                    if (selectedFilterColors.has(color)) selectedFilterColors.delete(color);
                    else selectedFilterColors.add(color);
                    btn.classList.toggle("is-active", selectedFilterColors.has(color));
                    renderCatalog();
                };
                colorWrap.appendChild(btn);
            });
        }
        const resetBtn = document.getElementById("catalog-filters-reset");
        if (resetBtn) {
            resetBtn.onclick = () => resetCatalogFilters();
        }
    };

    resetCatalogFilters = function () {
        selectedFilterSizes.clear();
        selectedFilterColors.clear();
        searchQuery = "";
        const searchInput = document.getElementById("catalog-search");
        if (searchInput) searchInput.value = "";
        activeCatalogFilter = null;
        favoritesOnly = false;
        sortMode = "default";
        const sortSelect = document.getElementById("catalog-sort");
        if (sortSelect) sortSelect.value = "default";
        priceSliderMax = catalogPriceCeiling;
        const slider = document.getElementById("catalog-price-slider");
        const output = document.getElementById("catalog-price-output");
        if (slider) slider.value = String(catalogPriceCeiling);
        if (output) output.textContent = formatPrice(priceSliderMax);
        document.querySelectorAll("#filter-size-chips .filter-chip, #filter-color-chips .filter-chip").forEach((chip) => {
            chip.classList.remove("is-active");
        });
        renderCatalog();
    };

    productMatchesColorFilters = function (id) {
        if (!selectedFilterColors.size) return true;
        const product = getLocalizedProduct(id);
        if (!product?.variants?.length) return false;
        return product.variants.some((variant) => variant.color && selectedFilterColors.has(variant.color));
    };

    setupCatalogUi();
    initAdvancedCatalogFilters();
    applyStaticTexts();
    renderCatalog();
    renderCart();
    renderMiniCart();
    renderReviews(currentId ? getProductReviews(currentId) : []);

    const languageSelect = document.getElementById("language-select");
    if (languageSelect) {
        languageSelect.value = currentLanguage;
        languageSelect.addEventListener("change", (event) => {
            const next = event.target.value;
            if (!SUPPORTED_LANGUAGES.includes(next)) return;
            currentLanguage = next;
            selectedFilterColors.clear();
            saveLanguage(currentLanguage);
            applyStaticTexts();
            initAdvancedCatalogFilters();
            renderCatalog();
            renderCart();
            renderMiniCart();
            if (document.getElementById("productModal")?.style.display === "flex" && currentId) {
                openModal(currentId);
            }
        });
    }
})();

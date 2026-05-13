let cart = [];
let selectedSize = null;
let currentId = null;
let selectedVariant = null;
let toastTimer = null;
let activeCatalogFilter = null;
let searchQuery = "";
let sortMode = "default";
let favoritesOnly = false;
let catalogRenderToken = 0;
let priceSliderMax = 10000;
let catalogPriceCeiling = 10000;
const selectedFilterSizes = new Set();
const selectedFilterColors = new Set();
let selectedReviewRating = 0;
let currentGalleryImages = [];
let currentGalleryIndex = 0;
let currentGalleryPosition = "center center";
const BOT_USERNAME = "KEgling_chop_BOT";
const FAVORITES_KEY = "kegling-favorites";
const REVIEWS_KEY = "kegling-user-reviews";
const RECENTLY_VIEWED_KEY = "kegling-recently-viewed";
const favoriteIds = loadFavorites();

function isAndroidAppWebView() {
    const ua = navigator.userAgent || "";
    const hasCapacitor = Boolean(window.Capacitor);
    const isAndroid = /Android/i.test(ua);
    const isWebView = /\bwv\b/i.test(ua) || /Version\/[\d.]+ Chrome\/[\d.]+ Mobile/i.test(ua);
    return hasCapacitor || (isAndroid && isWebView);
}

const APP_PERFORMANCE_LITE = isAndroidAppWebView();
if (APP_PERFORMANCE_LITE) {
    document.documentElement.classList.add("app-performance-lite");
}

const catalogFilters = {
    hoodies: "Худі та світшоти",
    shirts: "Сорочки",
    ties: "Краватки",
    caps: "Кепки",
    socks: "Шкарпетки",
    bags: "Сумки",
    casual: "Casual",
    accessories: "Аксесуари"
};

const productCodeMap = {
    socks: "s",
    hoodie: "h",
    sweatshirt: "w",
    shirt: "sh",
    tie: "t",
    cap: "c",
    bag: "b"
};

const catalogOrder = ["hoodie", "sweatshirt", "shirt", "tie", "cap", "bag", "socks"];

const products = {
    socks: {
        title: "Набор носков хлопковых 12 пар SoxBox 12MS-WT-MIX 40-44 Микс",
        price: 420,
        desc: "Набор из 12 пар хлопковых носков в миксе цветов для повседневной носки и базового гардероба.",
        img: "assets/591097701.webp",
        gallery: [
            "assets/591097701.webp",
            "assets/591097703.webp",
            "assets/591097704.webp",
            "assets/591732218.webp",
            "assets/591732219.webp",
            "assets/591732220.webp",
            "assets/591732221.webp"
        ],
        imagePosition: "center center",
        categories: ["socks", "casual", "accessories"],
        sizes: ["40", "41", "42", "43", "44"],
        tag: "На щодень",
        material: "Хлопок / эластан",
        fit: "Средняя высота",
        use: "На каждый день",
        points: [
            "В наборе 12 пар в синем, сером и черном цветах.",
            "Мягкая ткань подходит для ежедневной носки.",
            "В галерее можно посмотреть общий комплект и каждый цвет отдельно."
        ],
        related: ["hoodie", "sweatshirt", "cap"]
    },
    hoodie: {
        title: "Худі Direct Action Shaka, Black",
        price: 1850,
        desc: "Черное худи с плотной тканью, чистой формой и акцентной вышивкой на груди.",
        img: "assets/560534655.webp",
        gallery: [
            "assets/560534655.webp",
            "assets/560534657.webp",
            "assets/560534660.webp"
        ],
        imagePosition: "center center",
        categories: ["hoodies", "casual"],
        sizes: ["S", "M", "L", "XL"],
        tag: "Базова річ",
        material: "Хлопок / футер",
        fit: "Вільний крій",
        use: "Город, вечер, повседневный стиль",
        points: [
            "Глубокий черный цвет легко собирает цельный повседневный образ.",
            "Свободная посадка работает и solo, и поверх базового слоя.",
            "Три фото в карточке показывают перед, спину и боковой ракурс."
        ],
        related: ["socks", "cap", "bag"]
    },
    sweatshirt: {
        title: "Толстовка KEgling White",
        price: 1700,
        desc: "Светлая толстовка с чистым минималистичным видом и мягким everyday-настроением.",
        img: "hoodie.jpg",
        gallery: ["hoodie.jpg"],
        imagePosition: "center center",
        categories: ["hoodies", "casual"],
        sizes: ["S", "M", "L", "XL"],
        tag: "Чистий образ",
        material: "Хлопок / мягкий футер",
        fit: "Стандартний крій",
        use: "Повседневный light-образ",
        points: [
            "Светлый верх делает образ заметнее и чище.",
            "Подходит под джинсы, карго и спокойную обувь.",
            "Хороший вариант для тех, кто любит мягкие базовые цвета."
        ],
        related: ["socks", "bag", "cap"]
    },
    shirt: {
        title: "Теніска Shirts 1/2 sleeves Camel Active",
        price: 2100,
        desc: "Легкая рубашка с коротким рукавом в клетку для повседневного летнего образа.",
        img: "assets/576607403.webp",
        gallery: [
            "assets/576607403.webp",
            "assets/654969627.webp"
        ],
        imagePosition: "center center",
        categories: ["shirts", "casual"],
        sizes: ["S", "M", "L", "XL"],
        tag: "Розумний шар",
        material: "Хлопок / поплин",
        fit: "Прямий крій",
        use: "Офис, встреча, вечер",
        points: [
            "Мягкая ткань комфортно ощущается в течение дня.",
            "Клетчатый рисунок добавляет образу фактуру и характер.",
            "Хорошо сочетается с джинсами, чиносами и легкими кедами."
        ],
        variants: [
            {
                color: "Жовтий",
                title: "Теніска Camel Active",
                sku: "409261-7S61-64",
                sizeLabel: "50",
                img: "assets/654969626.webp",
                gallery: [
                    "assets/654969626.webp",
                    "assets/654969627.webp",
                    "assets/654969629.webp"
                ]
            },
            {
                color: "Коричневий",
                title: "Теніска Camel Active",
                sku: "409261-5S61-19",
                sizeLabel: "50",
                img: "assets/576607391.webp",
                gallery: [
                    "assets/576607391.webp",
                    "assets/576607394.webp",
                    "assets/576607397.webp"
                ]
            },
            {
                color: "Різнокольоровий",
                title: "Теніска Camel Active",
                sku: "409261-7S61-66",
                sizeLabel: "50",
                img: "assets/655395018.webp",
                gallery: [
                    "assets/655395018.webp",
                    "assets/655395024.webp",
                    "assets/655395030.webp"
                ]
            }
        ],
        related: ["tie", "bag"]
    },
    tie: {
        title: "Краватка Emilio Corali",
        price: 690,
        desc: "Классический галстук Emilio Corali с гладкой фактурой для аккуратного делового образа.",
        img: "assets/361175746.webp",
        gallery: [
            "assets/361175746.webp",
            "assets/361175751.webp"
        ],
        imagePosition: "center center",
        categories: ["ties", "accessories"],
        sizes: null,
        tag: "Чіткий акцент",
        material: "Полиэстер / сатин",
        fit: "Вузька форма",
        use: "Рубашка, жакет, событие",
        points: [
            "Гладкая поверхность смотрится аккуратно и строго.",
            "Универсальная форма подходит под рубашку и пиджак.",
            "Хорошо работает в офисном и вечернем комплекте."
        ],
        variants: [
            {
                color: "Коричневий",
                title: "Краватка 8,5х150 см Emilio Corali",
                img: "assets/361175746.webp",
                gallery: [
                    "assets/361175746.webp",
                    "assets/361175751.webp"
                ]
            },
            {
                color: "Сірий",
                title: "Краватка Emilio Corali темно-сіра чоловіча",
                img: "assets/496781942.webp",
                gallery: [
                    "assets/496781942.webp",
                    "assets/496781954.webp"
                ]
            },
            {
                color: "Темно-сірий",
                title: "Краватка 9х150 см Emilio Corali",
                img: "assets/496781964.webp",
                gallery: [
                    "assets/496781964.webp",
                    "assets/361179035.webp",
                    "assets/361179039.webp"
                ]
            },
            {
                color: "Фіолетовий",
                title: "Галстук чоловічий Темно-фіолетовий Баклажановий Emilio Corali",
                img: "assets/535900288.webp",
                gallery: [
                    "assets/535900288.webp",
                    "assets/535900293.webp"
                ]
            }
        ],
        related: ["shirt", "bag"]
    },
    cap: {
        title: "Кепка SumWin",
        price: 880,
        desc: "Бейсболка SumWin с изогнутым козырьком и регулируемой застежкой на каждый день.",
        img: "assets/193581598.webp",
        gallery: [
            "assets/193581598.webp",
            "assets/193581604.webp"
        ],
        imagePosition: "center center",
        categories: ["caps", "casual", "accessories"],
        sizes: null,
        tag: "Вуличний акцент",
        material: "Хлопок",
        fit: "Регульована посадка",
        use: "Город, прогулка, casual",
        points: [
            "Плотный материал хорошо держит форму.",
            "Изогнутый козырек защищает глаза от солнца.",
            "Регулируемая застежка помогает подогнать посадку под себя."
        ],
        variants: [
            {
                color: "Бордовый",
                title: "Кепка SumWin",
                img: "assets/193581598.webp",
                gallery: [
                    "assets/193581598.webp",
                    "assets/193581604.webp"
                ]
            },
            {
                color: "Салатовый",
                title: "Кепка SumWin",
                img: "assets/427427121.webp",
                gallery: [
                    "assets/427427121.webp",
                    "assets/427427122.webp"
                ]
            }
        ],
        related: ["hoodie", "socks", "bag"]
    },
    bag: {
        title: "Сумка KEgling Daily",
        price: 1450,
        desc: "Компактная черная сумка через плечо для повседневных вещей и чистого городского силуэта.",
        img: "bag.svg",
        gallery: [
            "bag.svg"
        ],
        imagePosition: "center center",
        categories: ["bags", "casual", "accessories"],
        sizes: null,
        tag: "Щоденний формат",
        material: "Нейлон / плотная стропа",
        fit: "Компактна кросбоді",
        use: "Город, учеба, поездки",
        points: [
            "Вмещает базовые вещи и не утяжеляет образ.",
            "Работает и с casual, и с более собранным комплектом.",
            "Особенно хорошо сочетается с худи, рубашкой и кепкой."
        ],
        related: ["hoodie", "shirt", "cap"]
    }
};

const orderForm = document.getElementById("order-form");
if (orderForm) {
    orderForm.addEventListener("submit", submitOrder);
}

setupCatalogUi();
initCatalogFilters();
initCatalogToolbar();
initAdvancedCatalogFilters();
initMiniCartUi();
initOrderFormFields();
initReviewForm();
initGalleryControls();
initLookbook();
renderCatalog();
renderRecentlyViewed();
initTelegramLink();

function formatPrice(price) {
    const n = Math.round(Number(price));
    if (Number.isNaN(n)) return "—";
    const formatted = n
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
    return `${formatted}\u00a0₴`;
}

function formatPriceHtml(price) {
    const n = Math.round(Number(price));
    if (Number.isNaN(n)) {
        return "<span class=\"price-lux\"><span class=\"price-lux__value\">—</span></span>";
    }
    const formatted = n
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
    return `<span class="price-lux" aria-label="${n} гривень"><span class="price-lux__value">${formatted}</span><span class="price-lux__currency" aria-hidden="true">₴</span></span>`;
}

function setupCatalogUi() {
    const toolbar = document.querySelector(".catalog-toolbar");
    const main = document.querySelector(".catalog-main");
    const modalMedia = document.querySelector(".modal-media");

    if (main && !document.getElementById("recently-viewed")) {
        const recentSection = document.createElement("section");
        recentSection.id = "recently-viewed";
        recentSection.className = "recently-viewed";
        recentSection.style.display = "none";
        recentSection.innerHTML = `
            <div class="related-head">
                <h3>Нещодавно переглянуті</h3>
                <p>Швидкий доступ до товарів, які ти вже відкривав.</p>
            </div>
            <div id="recently-viewed-grid" class="recently-viewed-grid"></div>
        `;
        main.appendChild(recentSection);
    }

    if (modalMedia && !modalMedia.querySelector(".modal-image-stage")) {
        const image = document.getElementById("modalImg");
        const stage = document.createElement("div");
        stage.className = "modal-image-stage";
        stage.innerHTML = `
            <button id="gallery-prev" type="button" class="gallery-nav prev" aria-label="Попереднє фото">‹</button>
            <button id="gallery-next" type="button" class="gallery-nav next" aria-label="Наступне фото">›</button>
        `;
        if (image) {
            modalMedia.insertBefore(stage, image);
            stage.insertBefore(image, stage.querySelector("#gallery-next"));
        }
    }
}

function getProductBadge(id) {
    const badges = {
        hoodie: "Хіт",
        sweatshirt: "Нове",
        shirt: "Свіже",
        tie: "Класика",
        cap: "Стріт",
        bag: "Щодня",
        socks: "Набір"
    };
    return badges[id] || "Вибір";
}

function getProductAvailability(id) {
    const availability = {
        hoodie: "В наличии",
        sweatshirt: "Мало в наличии",
        shirt: "В наличии",
        tie: "В наличии",
        cap: "Мало в наличии",
        bag: "В наличии",
        socks: "В наличии"
    };
    return availability[id] || "В наличии";
}

function getProductSizeSummary(product) {
    if (!product?.sizes || !product.sizes.length) {
        return "Один размер";
    }
    if (product.sizes.length <= 4) {
        return `Размеры: ${product.sizes.join(", ")}`;
    }
    return `Размеры: ${product.sizes[0]}–${product.sizes[product.sizes.length - 1]}`;
}

function getRatingMeta(id) {
    const reviews = getProductReviews(id);
    if (!reviews.length) {
        return { average: 0, count: 0, label: "Пока нет отзывов" };
    }

    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const average = total / reviews.length;
    return {
        average,
        count: reviews.length,
        label: `${average.toFixed(1)} ★ (${reviews.length})`
    };
}

function getSearchText(product, id) {
    const variantsText = Array.isArray(product.variants)
        ? product.variants.map((variant) => `${variant.title} ${variant.color || ""}`).join(" ")
        : "";
    const categoriesText = Array.isArray(product.categories)
        ? product.categories.map((category) => catalogFilters[category] || category).join(" ")
        : "";

    return [
        product.title,
        product.desc,
        product.tag,
        getProductBadge(id),
        getProductAvailability(id),
        getProductSizeSummary(product),
        categoriesText,
        variantsText
    ].join(" ").toLowerCase();
}

function productMatchesPriceSlider(price) {
    return price <= priceSliderMax;
}

function productMatchesSizeFilters(id) {
    if (!selectedFilterSizes.size) return true;
    const product = products[id];
    if (!product) return false;
    const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
    if (hasSizes) {
        return product.sizes.some((size) => selectedFilterSizes.has(size));
    }
    return selectedFilterSizes.has("__none__");
}

function productMatchesColorFilters(id) {
    if (!selectedFilterColors.size) return true;
    const product = products[id];
    if (!product?.variants?.length) return false;
    return product.variants.some((v) => v.color && selectedFilterColors.has(v.color));
}

function truncateText(str, maxLen) {
    const s = String(str || "").trim();
    if (s.length <= maxLen) return s;
    return `${s.slice(0, maxLen - 1)}…`;
}

function collectCatalogSizeOptions() {
    const sizes = new Set();
    catalogOrder.forEach((id) => {
        const p = products[id];
        if (p?.sizes?.length) {
            p.sizes.forEach((s) => sizes.add(s));
        }
    });
    return [...sizes].sort((a, b) => {
        const na = Number(a);
        const nb = Number(b);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
        return String(a).localeCompare(String(b), "ru");
    });
}

function collectCatalogColorOptions() {
    const colors = new Set();
    catalogOrder.forEach((id) => {
        const p = products[id];
        if (p?.variants?.length) {
            p.variants.forEach((v) => {
                if (v.color) colors.add(v.color);
            });
        }
    });
    return [...colors].sort((a, b) => a.localeCompare(b, "ru"));
}

function computeCatalogPriceCeiling() {
    let maxP = 0;
    catalogOrder.forEach((id) => {
        const p = products[id]?.price;
        if (typeof p === "number" && p > maxP) maxP = p;
    });
    const step = 50;
    const rounded = Math.max(step, Math.ceil(maxP / step) * step);
    return rounded || 5000;
}

function canQuickAddProduct(product) {
    return Boolean(product && !product.sizes && !product.variants);
}

function animateFlyToCartFromElement(sourceEl) {
    const cartCount = document.getElementById("cart-count");
    if (!sourceEl || !cartCount) return;
    const imageRect = sourceEl.getBoundingClientRect();
    const cartRect = cartCount.getBoundingClientRect();
    const flyer = sourceEl.cloneNode(true);
    flyer.className = "cart-fly-image";
    flyer.style.left = `${imageRect.left}px`;
    flyer.style.top = `${imageRect.top}px`;
    flyer.style.width = `${imageRect.width}px`;
    flyer.style.height = `${imageRect.height}px`;
    document.body.appendChild(flyer);

    requestAnimationFrame(() => {
        flyer.style.transform = `translate(${cartRect.left - imageRect.left}px, ${cartRect.top - imageRect.top}px) scale(0.15)`;
        flyer.style.opacity = "0.2";
    });

    cartCount.classList.remove("cart-count-bump");
    void cartCount.offsetWidth;
    cartCount.classList.add("cart-count-bump");

    setTimeout(() => flyer.remove(), 700);
}

function quickAddProductFromCatalog(id, card) {
    const product = products[id];
    if (!product || !canQuickAddProduct(product)) return;

    cart.push({
        title: product.title,
        price: product.price,
        size: "Без размера",
        color: null,
        productId: id
    });

    document.getElementById("cart-count").innerText = cart.length;
    const img = card?.querySelector("img");
    if (img) animateFlyToCartFromElement(img);
    if (document.getElementById("mini-cart")?.classList.contains("is-open")) renderMiniCart();
    showToast("В корзине", `${product.title} добавлен.`, "success");
}

function createProductCard(id, index = 0, options = {}) {
    const product = products[id];
    if (!product) return null;

    const card = document.createElement("article");
    const rating = getRatingMeta(id);
    const isFavorite = favoriteIds.has(id);
    const compactClass = options.compact ? " compact" : "";
    const availability = getProductAvailability(id);

    card.className = `card${compactClass} reveal-card`.trim();
    card.dataset.productId = id;
    card.innerHTML = `
        <div class="card-badges">
            <span class="card-badge">${getProductBadge(id)}</span>
            <span class="card-rating">${rating.label}</span>
        </div>
        <button type="button" class="favorite-btn${isFavorite ? " active" : ""}" aria-label="В избранное">♥</button>
        <img src="${product.img}" alt="${escapeHtml(product.title)}" width="480" height="480" loading="lazy" decoding="async" style="object-position:${product.imagePosition || "center center"};">
        <h3>${escapeHtml(product.title)}</h3>
        <div class="card-meta">
            <span class="card-meta-pill">${escapeHtml(getProductSizeSummary(product))}</span>
            <span class="card-meta-pill availability ${availability.toLowerCase().includes("мало") ? "low" : ""}">${escapeHtml(availability)}</span>
        </div>
        <div class="card-spec-row" aria-label="Кратко о товаре">
            <span class="card-spec card-spec--material">${escapeHtml(truncateText(product.material, 36))}</span>
            <span class="card-spec card-spec--delivery"></span>
        </div>
        <p class="card-price">${formatPriceHtml(product.price)}</p>
        <button type="button" class="quick-view-btn" data-i18n="quickView"></button>
        ${canQuickAddProduct(product) ? '<button type="button" class="quick-add-btn" data-i18n="quickAddToCart"></button>' : ""}
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
    card.querySelector(".quick-add-btn")?.addEventListener("click", (event) => {
        event.stopPropagation();
        quickAddProductFromCatalog(id, card);
    });

    return card;
}

function loadRecentlyViewed() {
    try {
        const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function saveRecentlyViewed(ids) {
    try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids));
    } catch {}
}

function pushRecentlyViewed(id) {
    const next = loadRecentlyViewed().filter((item) => item !== id);
    next.unshift(id);
    saveRecentlyViewed(next.slice(0, 6));
}

function renderRecentlyViewed() {
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
}

function initGalleryControls() {
    document.getElementById("gallery-prev")?.addEventListener("click", () => stepGallery(-1));
    document.getElementById("gallery-next")?.addEventListener("click", () => stepGallery(1));

    document.addEventListener("keydown", (event) => {
        const modal = document.getElementById("productModal");
        const modalOpen = modal && modal.style.display === "flex";
        if (!modalOpen) return;

        if (event.key === "Escape") {
            closeModal();
            event.preventDefault();
            return;
        }

        if (event.key === "ArrowLeft") {
            stepGallery(-1);
        } else if (event.key === "ArrowRight") {
            stepGallery(1);
        }
    });
}

function initLookbook() {
    document.querySelectorAll("[data-open-product]").forEach((btn) => {
        if (btn.dataset.lookbookBound) return;
        btn.dataset.lookbookBound = "1";
        btn.addEventListener("click", () => {
            const pid = btn.getAttribute("data-open-product");
            if (!pid || !products[pid]) return;
            showSection("main");
            requestAnimationFrame(() => openModal(pid));
        });
    });
}

function stepGallery(direction) {
    if (currentGalleryImages.length < 2) return;
    currentGalleryIndex = (currentGalleryIndex + direction + currentGalleryImages.length) % currentGalleryImages.length;
    syncGalleryImage();
}

function syncGalleryImage() {
    if (!currentGalleryImages.length) return;
    setModalImage(currentGalleryImages[currentGalleryIndex], currentGalleryPosition);
    document.querySelectorAll(".gallery-thumb").forEach((item, index) => {
        item.classList.toggle("active", index === currentGalleryIndex);
    });

    const showNav = currentGalleryImages.length > 1;
    document.querySelectorAll(".gallery-nav").forEach((button) => {
        button.style.display = showNav ? "grid" : "none";
    });
}

function initCatalogFilters() {
    document.querySelectorAll(".sidebar-link").forEach((button) => {
        button.addEventListener("click", () => {
            const filterId = button.dataset.filter;
            if (!filterId) return;
            activeCatalogFilter = filterId;
            renderCatalog();
        });
    });
}

function sortCatalogIds(ids) {
    const sorted = [...ids];

    if (sortMode === "price-asc") {
        sorted.sort((a, b) => products[a].price - products[b].price);
    } else if (sortMode === "price-desc") {
        sorted.sort((a, b) => products[b].price - products[a].price);
    } else if (sortMode === "title-asc") {
        sorted.sort((a, b) => products[a].title.localeCompare(products[b].title, "ru"));
    }

    return sorted;
}

function updateActiveFilterUi() {
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
    filterLabel.innerText = catalogFilters[activeCatalogFilter] || activeCatalogFilter;
}

function clearCatalogFilter() {
    activeCatalogFilter = null;
    renderCatalog();
}

function openCatalogPage() {
    favoritesOnly = false;
    activeCatalogFilter = null;
    showSection("main");
    renderCatalog();
}

function openFavoritesPage() {
    favoritesOnly = true;
    activeCatalogFilter = null;
    showSection("main");
    renderCatalog();
}

function loadFavorites() {
    try {
        const saved = localStorage.getItem(FAVORITES_KEY);
        return new Set(saved ? JSON.parse(saved) : []);
    } catch {
        return new Set();
    }
}

function saveFavorites() {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favoriteIds]));
    } catch {}
}

function toggleFavorite(id) {
    if (favoriteIds.has(id)) {
        favoriteIds.delete(id);
        showToast("Убрано из избранного", "Товар больше не сохранен.", "success");
    } else {
        favoriteIds.add(id);
        showToast("Добавлено в избранное", "Товар сохранен, чтобы вернуться к нему позже.", "success");
    }

    saveFavorites();
    renderCatalog();
}

function renderColorOptions(product) {
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
        btn.addEventListener("click", () => selectColorVariant(variant, btn, product));
        colorContainer.appendChild(btn);
    });
}

function selectColorVariant(variant, button, product) {
    selectedVariant = variant;
    document.querySelectorAll(".color-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.getElementById("modalTitle").innerText = variant.title;
    renderModalMeta(variant, product);
    setModalImage(variant.img, product.imagePosition);
    renderGallery(variant.gallery || [variant.img], product.imagePosition);
}

function renderModalMeta(activeProduct, baseProduct) {
    const metaNode = document.getElementById("modalMeta");
    if (!metaNode) return;

    const parts = [];

    if (activeProduct.color) {
        parts.push(`Цвет: ${activeProduct.color}`);
    }

    if (activeProduct.sku) {
        parts.push(`Артикул: ${activeProduct.sku}`);
    }

    if (activeProduct.sizeLabel) {
        parts.push(`Размер: ${activeProduct.sizeLabel}`);
    } else if (baseProduct.sizes && baseProduct.sizes.length === 1) {
        parts.push(`Размер: ${baseProduct.sizes[0]}`);
    }

    metaNode.innerText = parts.join(" • ");
}

function setModalImage(src, position = "center center") {
    const modalImg = document.getElementById("modalImg");
    modalImg.src = src;
    modalImg.style.objectPosition = position;
}

function renderProductPoints(points) {
    const container = document.getElementById("modalPoints");
    container.innerHTML = "";

    points.forEach((point) => {
        const item = document.createElement("div");
        item.className = "product-point";
        item.innerText = point;
        container.appendChild(item);
    });
}

function renderRelatedProducts(ids) {
    const container = document.getElementById("related-products");
    container.innerHTML = "";

    ids.forEach((id) => {
        const product = products[id];
        if (!product) return;

        const card = document.createElement("button");
        card.type = "button";
        card.className = "related-card";
        card.onclick = () => openModal(id);
        card.innerHTML = `
            <img src="${product.img}" alt="${product.title}" width="200" height="200" loading="lazy" decoding="async" style="object-position:${product.imagePosition || "center center"};">
            <div class="related-card-copy">
                <div class="related-card-title">${product.title}</div>
                <div class="related-card-desc">${product.tag}</div>
                <div class="related-card-meta">${formatPriceHtml(product.price)}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

function selectSize(el) {
    document.querySelectorAll(".size-btn").forEach((btn) => btn.classList.remove("active"));
    el.classList.add("active");
    selectedSize = el.innerText;
}

function renderReviews(reviews) {
    const container = document.getElementById("reviews-list");
    if (!container) return;
    container.innerHTML = "";

    if (!reviews.length) {
        container.innerHTML = `<div class="reviews-empty">Пока нет отзывов. Будь первым, кто поставит оценку и напишет комментарий.</div>`;
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
                    <button type="button" class="review-delete" aria-label="Удалить отзыв">×</button>
                </div>
            </div>
            <p>${escapeHtml(review.text)}</p>
        `;
        card.querySelector(".review-delete")?.addEventListener("click", () => {
            deleteReview(currentId, review.createdAt);
        });
        container.appendChild(card);
    });
}

function getProductReviews(id) {
    const reviewsMap = loadUserReviews();
    return Array.isArray(reviewsMap[id]) ? reviewsMap[id] : [];
}

function initReviewForm() {
    const form = document.getElementById("review-form");
    const stars = document.querySelectorAll(".review-star");

    stars.forEach((star) => {
        star.addEventListener("click", () => {
            const rating = Number(star.dataset.rating || 0);
            selectedReviewRating = rating;
            updateReviewStars(rating);
        });
    });

    form?.addEventListener("submit", submitReview);
}

function submitReview(event) {
    event.preventDefault();

    if (!currentId) return;

    const authorInput = document.getElementById("review-author");
    const textInput = document.getElementById("review-text");
    const author = authorInput?.value.trim() || "Покупатель";
    const text = textInput?.value.trim() || "";

    if (!selectedReviewRating) {
        showToast("Выбери оценку", "Сначала поставь от 1 до 5 звёзд.", "error");
        return;
    }

    if (!text) {
        showToast("Нужен отзыв", "Напиши пару слов о товаре перед отправкой.", "error");
        return;
    }

    const reviewsMap = loadUserReviews();
    const nextReview = {
        author,
        text,
        rating: selectedReviewRating,
        createdAt: Date.now()
    };

    reviewsMap[currentId] = [nextReview, ...(reviewsMap[currentId] || [])];
    saveUserReviews(reviewsMap);
    resetReviewForm();
    renderReviews(getProductReviews(currentId));
    showToast("Отзыв добавлен", "Спасибо, отзыв сохранён для этого товара.", "success");
}

function resetReviewForm() {
    const form = document.getElementById("review-form");
    selectedReviewRating = 0;
    form?.reset();
    updateReviewStars(0);
}

function updateReviewStars(rating) {
    document.querySelectorAll(".review-star").forEach((star) => {
        const starRating = Number(star.dataset.rating || 0);
        star.classList.toggle("active", starRating <= rating);
    });
}

function loadUserReviews() {
    try {
        const saved = localStorage.getItem(REVIEWS_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
}

function saveUserReviews(reviewsMap) {
    try {
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviewsMap));
    } catch {}
}

function deleteReview(productId, reviewId) {
    if (!productId || !reviewId) return;

    const reviewsMap = loadUserReviews();
    const reviews = Array.isArray(reviewsMap[productId]) ? reviewsMap[productId] : [];
    reviewsMap[productId] = reviews.filter((review) => review.createdAt !== reviewId);
    saveUserReviews(reviewsMap);
    renderReviews(getProductReviews(productId));
    showToast("Отзыв удалён", "Комментарий убран из этого товара.", "success");
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function createCatalogSkeletonCard() {
    const card = document.createElement("article");
    card.className = "card card-skeleton";
    card.setAttribute("aria-hidden", "true");
    card.innerHTML = `
        <div class="card-skeleton__media skeleton-shimmer"></div>
        <div class="card-skeleton__body">
            <div class="card-skeleton__badges">
                <span class="card-skeleton__pill skeleton-shimmer"></span>
                <span class="card-skeleton__pill skeleton-shimmer"></span>
            </div>
            <div class="card-skeleton__line card-skeleton__line--title skeleton-shimmer"></div>
            <div class="card-skeleton__line card-skeleton__line--title short skeleton-shimmer"></div>
            <div class="card-skeleton__meta">
                <span class="card-skeleton__pill wide skeleton-shimmer"></span>
                <span class="card-skeleton__pill skeleton-shimmer"></span>
            </div>
            <div class="card-skeleton__line card-skeleton__line--price skeleton-shimmer"></div>
            <div class="card-skeleton__button skeleton-shimmer"></div>
        </div>
    `;
    return card;
}

function showCatalogSkeleton(count = 6) {
    const grid = document.getElementById("products-grid");
    if (!grid) return;
    grid.innerHTML = "";
    for (let i = 0; i < count; i += 1) {
        grid.appendChild(createCatalogSkeletonCard());
    }
}

function renderCatalog() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    const token = ++catalogRenderToken;
    showCatalogSkeleton();

    window.requestAnimationFrame(() => {
    if (token !== catalogRenderToken) return;

    grid.innerHTML = "";

    let visibleIds = catalogOrder.filter((id) => {
        const product = products[id];
        if (!product) return false;
        if (!activeCatalogFilter) return true;
        return Array.isArray(product.categories) && product.categories.includes(activeCatalogFilter);
    });

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        visibleIds = visibleIds.filter((id) => getSearchText(products[id], id).includes(query));
    }

    visibleIds = visibleIds.filter((id) => productMatchesPriceSlider(products[id].price));
    visibleIds = visibleIds.filter((id) => productMatchesSizeFilters(id));
    visibleIds = visibleIds.filter((id) => productMatchesColorFilters(id));

    if (favoritesOnly) {
        visibleIds = visibleIds.filter((id) => favoriteIds.has(id));
    }

    visibleIds = sortCatalogIds(visibleIds);

    visibleIds.forEach((id, index) => {
        const card = createProductCard(id, index);
        if (card) grid.appendChild(card);
    });

    if (!visibleIds.length) {
        grid.innerHTML = `<div class="catalog-empty">По этим фильтрам пока нет товаров.</div>`;
    }

    updateActiveFilterUi();
    updateCatalogBreadcrumb();
    renderRecentlyViewed();
    document.dispatchEvent(new CustomEvent("kegling:dom-updated"));
    });
}

function initCatalogToolbar() {
    const searchInput = document.getElementById("catalog-search");
    const sortSelect = document.getElementById("catalog-sort");
    const favoritesButton = document.getElementById("favorites-nav-link");

    searchInput?.addEventListener("input", (event) => {
        searchQuery = event.target.value.trim();
        renderCatalog();
    });

    sortSelect?.addEventListener("change", (event) => {
        sortMode = event.target.value;
        renderCatalog();
    });

    favoritesButton?.addEventListener("click", (event) => {
        event.preventDefault();
        openFavoritesPage();
    });
}

function initAdvancedCatalogFilters() {
    catalogPriceCeiling = computeCatalogPriceCeiling();
    priceSliderMax = catalogPriceCeiling;

    const slider = document.getElementById("catalog-price-slider");
    const output = document.getElementById("catalog-price-output");
    if (slider) {
        slider.max = String(catalogPriceCeiling);
        slider.value = String(catalogPriceCeiling);
        slider.addEventListener("input", () => {
            priceSliderMax = Number(slider.value) || catalogPriceCeiling;
            if (output) output.textContent = formatPrice(priceSliderMax);
            renderCatalog();
        });
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
            btn.addEventListener("click", () => {
                if (selectedFilterSizes.has(size)) selectedFilterSizes.delete(size);
                else selectedFilterSizes.add(size);
                btn.classList.toggle("is-active", selectedFilterSizes.has(size));
                renderCatalog();
            });
            sizeWrap.appendChild(btn);
        });
        const noneBtn = document.createElement("button");
        noneBtn.type = "button";
        noneBtn.className = "filter-chip";
        noneBtn.dataset.value = "__none__";
        noneBtn.textContent = "Без размера";
        noneBtn.addEventListener("click", () => {
            if (selectedFilterSizes.has("__none__")) selectedFilterSizes.delete("__none__");
            else selectedFilterSizes.add("__none__");
            noneBtn.classList.toggle("is-active", selectedFilterSizes.has("__none__"));
            renderCatalog();
        });
        sizeWrap.appendChild(noneBtn);
    }
    if (colorWrap) {
        colorWrap.innerHTML = "";
        collectCatalogColorOptions().forEach((color) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "filter-chip";
            btn.dataset.value = color;
            btn.textContent = color;
            btn.addEventListener("click", () => {
                if (selectedFilterColors.has(color)) selectedFilterColors.delete(color);
                else selectedFilterColors.add(color);
                btn.classList.toggle("is-active", selectedFilterColors.has(color));
                renderCatalog();
            });
            colorWrap.appendChild(btn);
        });
    }

    document.getElementById("catalog-filters-reset")?.addEventListener("click", () => {
        resetCatalogFilters();
    });
}

function resetCatalogFilters() {
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
}

function updateCatalogBreadcrumb() {
    const el = document.getElementById("catalog-breadcrumb");
    if (!el) return;

    const parts = [];
    parts.push(`<span class="catalog-breadcrumb__item"><a href="#" class="catalog-breadcrumb__link" data-bc="home">Главная</a></span>`);
    parts.push(`<span class="catalog-breadcrumb__sep" aria-hidden="true">›</span>`);
    parts.push(`<span class="catalog-breadcrumb__item"><a href="#" class="catalog-breadcrumb__link" data-bc="catalog">Каталог</a></span>`);

    if (favoritesOnly) {
        parts.push(`<span class="catalog-breadcrumb__sep" aria-hidden="true">›</span>`);
        parts.push(`<span class="catalog-breadcrumb__current">Избранное</span>`);
    } else if (activeCatalogFilter) {
        parts.push(`<span class="catalog-breadcrumb__sep" aria-hidden="true">›</span>`);
        parts.push(
            `<span class="catalog-breadcrumb__current">${escapeHtml(catalogFilters[activeCatalogFilter] || activeCatalogFilter)}</span>`
        );
    } else {
        parts.push(`<span class="catalog-breadcrumb__sep" aria-hidden="true">›</span>`);
        parts.push(`<span class="catalog-breadcrumb__current">Все товары</span>`);
    }

    el.innerHTML = parts.join("");
    el.querySelectorAll("[data-bc]").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const t = link.getAttribute("data-bc");
            if (t === "home") {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            if (t === "catalog") openCatalogPage();
        });
    });
}

function initMiniCartUi() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMiniCart();
    });
}

function toggleMiniCart(event) {
    event?.preventDefault();
    const root = document.getElementById("mini-cart");
    if (!root) return;
    const open = root.classList.toggle("is-open");
    root.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("mini-cart-open", open);
    if (open) renderMiniCart();
}

function closeMiniCart() {
    const root = document.getElementById("mini-cart");
    if (!root) return;
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mini-cart-open");
}

function openFullCartFromMini() {
    closeMiniCart();
    showSection("cart");
}

function renderMiniCart() {
    const list = document.getElementById("mini-cart-list");
    const totalEl = document.getElementById("mini-cart-total");
    if (!list || !totalEl) return;

    if (!cart.length) {
        list.innerHTML = `<div class="mini-cart__empty">Корзина пуста — добавь товар из каталога.</div>`;
        totalEl.textContent = "";
        return;
    }

    let total = 0;
    list.innerHTML = "";
    cart.forEach((item, index) => {
        total += item.price;
        const pid = item.productId;
        const thumb = pid && products[pid] ? products[pid].img : "";
        const row = document.createElement("div");
        row.className = "mini-cart__item";
        row.innerHTML = `
            ${thumb ? `<img class="mini-cart__thumb" src="${thumb}" alt="">` : `<div class="mini-cart__thumb mini-cart__thumb--ph"></div>`}
            <div class="mini-cart__item-body">
                <div class="mini-cart__item-title">${escapeHtml(item.title)}</div>
                <div class="mini-cart__item-meta">${item.color ? `${escapeHtml(item.color)} · ` : ""}${escapeHtml(item.size)}</div>
                <div class="mini-cart__item-price">${formatPrice(item.price)}</div>
            </div>
            <button type="button" class="mini-cart__remove" aria-label="Удалить">×</button>
        `;
        row.querySelector(".mini-cart__remove")?.addEventListener("click", (e) => {
            e.stopPropagation();
            removeItem(index);
        });
        list.appendChild(row);
    });
    totalEl.textContent = `Итого: ${formatPrice(total)}`;
}

function setFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    if (err) {
        err.textContent = message || "";
        err.hidden = !message;
    }
    if (input) {
        input.setAttribute("aria-invalid", message ? "true" : "false");
    }
}

function clearOrderFieldErrors() {
    setFieldError("user-name", "err-user-name", "");
    setFieldError("user-surname", "err-user-surname", "");
    setFieldError("user-phone", "err-user-phone", "");
    setFieldError("user-email", "err-user-email", "");
}

function normalizeUaPhoneDigits(raw) {
    let d = String(raw || "").replace(/\D/g, "");
    if (d.startsWith("380") && d.length === 12) return d;
    if (d.startsWith("0") && d.length === 10) return `38${d}`;
    if (d.length === 9) return `380${d}`;
    return null;
}

function formatUaPhoneDisplay(digits12) {
    if (!digits12 || digits12.length !== 12) return "";
    return `+${digits12.slice(0, 3)} ${digits12.slice(3, 5)} ${digits12.slice(5, 8)} ${digits12.slice(8, 10)} ${digits12.slice(10)}`;
}

function isValidUaMobile(d) {
    if (!d || d.length !== 12 || !d.startsWith("380")) return false;
    if (!/^380\d{9}$/.test(d)) return false;
    const op = d.slice(3, 5);
    if (op === "00" || op === "01") return false;
    return true;
}

function initOrderFormFields() {
    const phone = document.getElementById("user-phone");
    phone?.addEventListener("blur", () => {
        const d = normalizeUaPhoneDigits(phone.value);
        if (d) phone.value = formatUaPhoneDisplay(d);
    });
}

function openModal(id) {
    currentId = id;
    selectedSize = null;
    selectedVariant = null;
    const product = products[id];
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
    document.getElementById("modalTag").innerText = `${getProductBadge(id)} • ${product.tag}`;
    document.getElementById("modalPrice").innerHTML = formatPriceHtml(product.price);
    document.getElementById("modalMaterial").innerText = product.material;
    document.getElementById("modalFit").innerText = product.fit;
    document.getElementById("modalUse").innerText = product.use;

    renderProductPoints([
        ...(product.points || []),
        `Наличие: ${getProductAvailability(id)}`,
        getProductSizeSummary(product),
        `Рейтинг: ${getRatingMeta(id).label}`
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
    document.getElementById("modal-add-btn").innerText = "Добавить в корзину";
    document.getElementById("productModal").style.display = "flex";
    document.body.classList.add("product-modal-open");
}

function renderGallery(images, position = "center center") {
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
        thumb.innerHTML = `<img src="${src}" alt="Product photo ${index + 1}" style="object-position:${position};">`;
        thumb.addEventListener("click", () => {
            currentGalleryIndex = index;
            syncGalleryImage();
        });
        gallery.appendChild(thumb);
    });

    syncGalleryImage();
}

function addToCart() {
    const product = products[currentId];
    if (!product) return;

    if (product.sizes && !selectedSize) {
        showToast("Выбери размер", "Сначала отметь размер, затем добавь товар.", "error");
        return;
    }

    cart.push({
        title: selectedVariant?.title || product.title,
        price: product.price,
        size: selectedSize || "Без размера",
        color: selectedVariant?.color || null,
        productId: currentId
    });

    document.getElementById("cart-count").innerText = cart.length;
    animateAddToCart();
    if (document.getElementById("mini-cart")?.classList.contains("is-open")) renderMiniCart();

    const btn = document.getElementById("modal-add-btn");
    btn.classList.add("success");
    btn.innerText = "Добавлено";

    setTimeout(() => {
        closeModal();
        renderCart();
        showToast("В корзине", `${product.title} добавлен.`, "success");
        btn.classList.remove("success");
        btn.innerText = "Добавить в корзину";
    }, 700);
}

function animateAddToCart() {
    const image = document.getElementById("modalImg");
    const cartCount = document.getElementById("cart-count");
    if (!image || !cartCount) return;

    const imageRect = image.getBoundingClientRect();
    const cartRect = cartCount.getBoundingClientRect();
    const flyer = image.cloneNode(true);
    flyer.className = "cart-fly-image";
    flyer.style.left = `${imageRect.left}px`;
    flyer.style.top = `${imageRect.top}px`;
    flyer.style.width = `${imageRect.width}px`;
    flyer.style.height = `${imageRect.height}px`;
    document.body.appendChild(flyer);

    requestAnimationFrame(() => {
        flyer.style.transform = `translate(${cartRect.left - imageRect.left}px, ${cartRect.top - imageRect.top}px) scale(0.15)`;
        flyer.style.opacity = "0.2";
    });

    cartCount.classList.remove("cart-count-bump");
    void cartCount.offsetWidth;
    cartCount.classList.add("cart-count-bump");

    setTimeout(() => flyer.remove(), 700);
}

function showToast(title, message, type = "success") {
    const toast = document.getElementById("toast");
    const badge = document.getElementById("toast-badge");
    const toastTitle = document.getElementById("toast-title");
    const toastMessage = document.getElementById("toast-message");

    toastTitle.innerText = title;
    toastMessage.innerText = message;
    badge.style.backgroundColor = type === "error" ? "#ef4444" : "#22c55e";
    toast.classList.add("show");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

function showSection(name) {
    const sectionDisplayMap = {
        main: "grid",
        cart: "block",
        about: "block"
    };
    const targetId = `section-${name}`;
    const preserveScrollY = name === "about" || name === "cart";
    const prevScrollY = preserveScrollY ? window.scrollY : null;

    document.getElementById("section-main").style.display = "none";
    document.getElementById("section-cart").style.display = "none";
    document.getElementById("section-about").style.display = "none";
    const target = document.getElementById(targetId);
    target.style.display = sectionDisplayMap[name] || "block";
    closeMiniCart();
    if (name === "cart") {
        renderCart();
    }
    updateActiveFilterUi();
    document.dispatchEvent(
        new CustomEvent("kegling:section-changed", { detail: { name } })
    );

    if (preserveScrollY && prevScrollY != null) {
        window.requestAnimationFrame(() => {
            const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            window.scrollTo(0, Math.min(prevScrollY, maxY));
        });
    }
}

function renderCart() {
    const list = document.getElementById("cart-list");
    const totalNode = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const formNode = document.getElementById("order-form");

    let total = 0;
    list.innerHTML = "";

    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `
            <div class="cart-row">
                <div>
                    <div class="cart-row-title">${escapeHtml(item.title)}</div>
                    ${item.color ? `<div class="cart-row-subtitle">Цвет: ${escapeHtml(item.color)}</div>` : ""}
                    <div class="cart-row-subtitle">Размер: ${escapeHtml(item.size)}</div>
                </div>
                <div class="cart-row-price">
                    <span>${formatPrice(item.price)}</span>
                    <span class="remove-x" onclick="removeItem(${index})">×</span>
                </div>
            </div>
        `;
    });

    if (!cart.length) {
        list.innerHTML = '<div class="cart-empty">Корзина пока пустая. Добавь товар и возвращайся сюда.</div>';
        formNode.style.display = "none";
        checkoutBtn.style.display = "block";
    }

    totalNode.innerText = `Итого: ${formatPrice(total)}`;
    if (document.getElementById("mini-cart")?.classList.contains("is-open")) renderMiniCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    document.getElementById("cart-count").innerText = cart.length;
    renderCart();
    showToast("Удалено", "Позиция убрана из корзины.", "success");
}

function closeModal() {
    document.getElementById("productModal").style.display = "none";
    document.body.classList.remove("product-modal-open");
}

window.onclick = (event) => {
    if (event.target.id === "productModal") {
        closeModal();
    }
};

window.onscroll = () => {
    const btn = document.getElementById("btn-up");
    if (!btn) return;
    btn.style.display = window.scrollY > 300 ? "block" : "none";
};

function showOrderForm() {
    if (cart.length === 0) {
        showToast("Корзина пустая", "Сначала добавь хотя бы один товар.", "error");
        return;
    }

    document.getElementById("order-form").style.display = "block";
    document.getElementById("checkout-btn").style.display = "none";
    document.getElementById("order-form").scrollIntoView({ behavior: "smooth", block: "start" });
}

function submitOrder(event) {
    event.preventDefault();
    clearOrderFieldErrors();

    const name = document.getElementById("user-name").value.trim();
    const surname = document.getElementById("user-surname").value.trim();
    const phoneRaw = document.getElementById("user-phone").value.trim();
    const email = document.getElementById("user-email").value.trim();

    let hasError = false;
    if (!name) {
        setFieldError("user-name", "err-user-name", "Введите имя.");
        hasError = true;
    }
    if (!surname) {
        setFieldError("user-surname", "err-user-surname", "Введите фамилию.");
        hasError = true;
    }
    const phoneDigits = normalizeUaPhoneDigits(phoneRaw);
    if (!phoneDigits || !isValidUaMobile(phoneDigits)) {
        setFieldError(
            "user-phone",
            "err-user-phone",
            "Укажите украинский номер: +380 и 9 цифр (например +380 50 123 45 67)."
        );
        hasError = true;
    }
    if (!email) {
        setFieldError("user-email", "err-user-email", "Введите email.");
        hasError = true;
    } else if (!validateEmail(email)) {
        setFieldError("user-email", "err-user-email", "Проверьте формат: name@example.com");
        hasError = true;
    }

    if (hasError) {
        showToast("Проверьте поля", "Исправьте ошибки в форме ниже.", "error");
        return;
    }

    const customer = {
        name,
        surname,
        phone: formatUaPhoneDisplay(phoneDigits),
        email
    };

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const contactLine = `${customer.name} ${customer.surname}; ${customer.phone}; ${customer.email}`;
    const payload = buildTelegramStartPayload();
    const botUrl = `https://t.me/${BOT_USERNAME}?start=${payload}`;

    copyText(contactLine);
    showToast("Переход в Telegram", `Открою бота. Твои данные уже скопированы, осталось вставить их в чат и завершить заказ на ${formatPrice(total)}.`, "success");

    window.setTimeout(() => {
        window.open(botUrl, "_blank");
        resetOrderState();
    }, 700);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function resetOrderState() {
    cart = [];
    document.getElementById("cart-count").innerText = "0";
    clearOrderFieldErrors();
    document.getElementById("order-form").reset();
    document.getElementById("order-form").style.display = "none";
    document.getElementById("checkout-btn").style.display = "block";
    renderCart();
    renderMiniCart();
    showSection("main");
}

async function fetchTelegramConfigPayload() {
    const urls = ["/api/config", "/.netlify/functions/config"];
    for (const url of urls) {
        try {
            const response = await fetch(url);
            const payload = await response.json().catch(() => ({}));
            if (response.ok && payload.ok && payload.telegramUrl) {
                return payload;
            }
        } catch {
            // try next
        }
    }
    return null;
}

function initTelegramLink() {
    const telegramLink = document.getElementById("telegram-link");
    if (!telegramLink) return;

    telegramLink.href = `https://t.me/${BOT_USERNAME}?start=catalog`;
    telegramLink.target = "_blank";
    telegramLink.rel = "noopener noreferrer";

    fetchTelegramConfigPayload().then((payload) => {
        if (payload?.telegramUrl) {
            telegramLink.href = payload.telegramUrl;
            telegramLink.target = "_blank";
            telegramLink.rel = "noopener noreferrer";
        } else if (location.protocol === "https:" && typeof window.__keglingTelegramOfflineToast === "function") {
            window.__keglingTelegramOfflineToast();
        }
    });
}

function buildTelegramStartPayload() {
    const encodedItems = cart
        .map((item) => {
            const productId = item.productId || Object.keys(products).find((id) => products[id].title === item.title);
            if (!productId) return "";

            const productCode = productCodeMap[productId];
            const sizeCode = item.size && item.size !== "Без размера"
                ? item.size.replace(/[^a-zA-Z0-9]/g, "_")
                : "none";

            return `${productCode}-${sizeCode}`;
        })
        .filter(Boolean)
        .join(".");

    const safePayload = encodedItems || "catalog";
    return `site_${toBase64Url(safePayload)}`;
}

function toBase64Url(value) {
    return btoa(unescape(encodeURIComponent(value)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => {});
    }
}

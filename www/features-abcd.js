/**
 * A–D UI: hero CTAs, header cart strip, lookbook grid, modal swipe, checkout steps.
 */
(function () {
    const lookbookTiles = [
        { id: "hoodie", labelKey: "lookbookTile1" },
        { id: "shirt", labelKey: "lookbookTile2" },
        { id: "bag", labelKey: "lookbookTile3" }
    ];

    function t(key) {
        if (typeof window.__keglingTranslate === "function") {
            return window.__keglingTranslate(key);
        }
        return null;
    }

    function scrollToCatalog() {
        if (typeof openCatalogPage === "function") {
            openCatalogPage();
        }
        window.requestAnimationFrame(() => {
            document.getElementById("products-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    function getCartItemImage(item) {
        if (!item?.productId || typeof products === "undefined") return "";
        const product = products[item.productId];
        return product?.img || "";
    }

    window.keglingSetCheckoutStep = function keglingSetCheckoutStep(step) {
        const order = ["cart", "details", "telegram"];
        const activeIndex = order.indexOf(step);
        document.querySelectorAll(".checkout-progress__step").forEach((el) => {
            const elStep = el.getAttribute("data-step");
            const idx = order.indexOf(elStep);
            el.classList.toggle("is-active", elStep === step);
            el.classList.toggle("is-done", idx >= 0 && idx < activeIndex);
        });
    };

    window.keglingRefreshCartChrome = function keglingRefreshCartChrome() {
        const strip = document.getElementById("header-cart-strip");
        const countEl = document.getElementById("header-cart-strip-count");
        const thumbsEl = document.getElementById("header-cart-strip-thumbs");
        if (!strip || typeof cart === "undefined") return;

        const hasItems = cart.length > 0;
        strip.hidden = !hasItems;
        document.body.classList.toggle("has-cart-strip", hasItems);

        if (countEl) {
            countEl.textContent = String(cart.length);
        }

        if (thumbsEl) {
            thumbsEl.innerHTML = "";
            cart.slice(0, 4).forEach((item) => {
                const src = getCartItemImage(item);
                if (!src) return;
                const img = document.createElement("img");
                img.src = src;
                img.alt = "";
                img.width = 32;
                img.height = 32;
                img.loading = "lazy";
                img.decoding = "async";
                thumbsEl.appendChild(img);
            });
        }
    };

    window.keglingRenderLookbookGrid = function keglingRenderLookbookGrid() {
        const grid = document.getElementById("lookbook-grid");
        if (!grid || typeof products === "undefined") return;

        grid.innerHTML = "";
        lookbookTiles.forEach((tile) => {
            const product = products[tile.id];
            if (!product) return;

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "lookbook-tile";
            btn.setAttribute("role", "listitem");
            const label = t(tile.labelKey) || product.tag || product.title;
            btn.innerHTML = `
                <img src="${product.img}" alt="${product.title}" loading="lazy" decoding="async">
                <span class="lookbook-tile__label">${label}</span>
            `;
            btn.addEventListener("click", () => {
                if (typeof showSection === "function") showSection("main");
                window.requestAnimationFrame(() => {
                    if (typeof openModal === "function") openModal(tile.id);
                });
            });
            grid.appendChild(btn);
        });
    };

    function initHeroCtas() {
        document.getElementById("hero-cta-catalog")?.addEventListener("click", scrollToCatalog);
        document.getElementById("hero-cta-new")?.addEventListener("click", () => {
            if (typeof openModal === "function") {
                openModal("sweatshirt");
            }
        });
    }

    function initHeaderCartStrip() {
        document.getElementById("header-cart-strip-btn")?.addEventListener("click", () => {
            if (typeof showSection === "function") {
                showSection("cart");
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    function initModalSwipe() {
        const stage = document.querySelector(".modal-image-stage");
        if (!stage || stage.dataset.swipeBound) return;
        stage.dataset.swipeBound = "1";

        let startX = 0;
        stage.addEventListener(
            "touchstart",
            (event) => {
                startX = event.changedTouches[0]?.clientX || 0;
            },
            { passive: true }
        );
        stage.addEventListener(
            "touchend",
            (event) => {
                const endX = event.changedTouches[0]?.clientX || 0;
                const delta = endX - startX;
                if (Math.abs(delta) < 48) return;
                if (typeof stepGallery === "function") {
                    stepGallery(delta < 0 ? 1 : -1);
                }
            },
            { passive: true }
        );
    }

    function boot() {
        initHeroCtas();
        initHeaderCartStrip();
        initModalSwipe();
        window.keglingRenderLookbookGrid();
        window.keglingRefreshCartChrome();
        window.keglingSetCheckoutStep("cart");

        document.addEventListener("kegling:dom-updated", () => {
            window.keglingRefreshCartChrome();
        });
        document.addEventListener("kegling:section-changed", (event) => {
            if (event.detail?.name === "cart") {
                window.keglingSetCheckoutStep("cart");
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();

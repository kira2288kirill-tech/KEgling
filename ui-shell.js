/**
 * KEgling UI shell — theme, header state, accessibility
 */
(function () {
    const STORAGE_KEY = "kegling-theme";
    const root = document.documentElement;

    function getSystemTheme() {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    function getStoredTheme() {
        try {
            const t = localStorage.getItem(STORAGE_KEY);
            if (t === "light" || t === "dark") return t;
        } catch (_) {}
        return null;
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (_) {}
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute("content", theme === "dark" ? "#09090b" : "#fafafa");
        }
        updateThemeToggleLabel(theme);
    }

    function updateThemeToggleLabel(theme) {
        const btn = document.getElementById("theme-toggle");
        if (!btn) return;
        const next = theme === "dark" ? "light" : "dark";
        btn.setAttribute("aria-label", next === "dark" ? "Тёмная тема" : "Светлая тема");
        btn.setAttribute("title", next === "dark" ? "Тёмная тема" : "Светлая тема");
        btn.dataset.theme = theme;
    }

    function initTheme() {
        applyTheme(getStoredTheme() || getSystemTheme());
        const btn = document.getElementById("theme-toggle");
        if (btn) {
            btn.addEventListener("click", () => {
                const current = root.getAttribute("data-theme") || "light";
                applyTheme(current === "dark" ? "light" : "dark");
            });
        }
        if (window.matchMedia) {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
                if (!getStoredTheme()) applyTheme(e.matches ? "dark" : "light");
            });
        }
    }

    function initHeaderScroll() {
        const header = document.querySelector(".site-header");
        if (!header) return;
        const onScroll = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 24);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    function initBodyClass() {
        document.body.classList.add("kegling-app");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            initBodyClass();
            initTheme();
            initHeaderScroll();
        });
    } else {
        initBodyClass();
        initTheme();
        initHeaderScroll();
    }
})();

(function () {
    const yearEl = document.querySelector("[data-year]");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", () => {
        setOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.matchMedia("(max-width: 720px)").matches) {
                setOpen(false);
            }
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setOpen(false);
    });
})();

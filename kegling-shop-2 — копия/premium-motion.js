/**
 * Premium motion: GSAP + Intersection Observer.
 * Mobile-first; transform/opacity only; respects prefers-reduced-motion.
 */
(function () {
    const gsap = window.gsap;
    const reduceMotion = () =>
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = () =>
        window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const allowParallax = () =>
        !reduceMotion() && window.matchMedia && window.matchMedia("(min-width: 768px)").matches;

    function isElementInLiveLayout(el) {
        if (!el || !el.getBoundingClientRect) return false;
        let p = el;
        while (p) {
            if (getComputedStyle(p).display === "none") return false;
            p = p.parentElement;
        }
        return true;
    }

    const cardObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                cardObserver.unobserve(el);
                if (reduceMotion()) {
                    el.classList.add("is-revealed");
                    if (gsap) gsap.set(el, { clearProps: "all" });
                    return;
                }
                if (gsap) {
                    gsap.fromTo(
                        el,
                        { opacity: 0, y: 20 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            ease: "power2.out",
                            onComplete: () => {
                                el.classList.add("is-revealed");
                            }
                        }
                    );
                } else {
                    el.classList.add("is-revealed");
                }
            });
        },
        { root: null, rootMargin: "0px 0px 10% 0px", threshold: 0.04 }
    );

    const staticObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                staticObserver.unobserve(el);
                if (reduceMotion()) {
                    el.classList.add("is-revealed");
                    return;
                }
                if (gsap) {
                    gsap.fromTo(
                        el,
                        { opacity: 0, y: 24 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power2.out",
                            onComplete: () => el.classList.add("is-revealed")
                        }
                    );
                } else {
                    el.classList.add("is-revealed");
                }
            });
        },
        { root: null, rootMargin: "0px 0px -4% 0px", threshold: 0.08 }
    );

    function observeCards(root) {
        const list = root && root.querySelectorAll ? root.querySelectorAll(".reveal-card") : document.querySelectorAll(".reveal-card");
        list.forEach((el) => {
            if (el.getAttribute("data-reveal-observed")) return;
            if (!isElementInLiveLayout(el)) return;
            el.setAttribute("data-reveal-observed", "1");
            if (reduceMotion()) {
                el.classList.add("is-revealed");
                return;
            }
            if (gsap) gsap.set(el, { opacity: 0, y: 20 });
            cardObserver.observe(el);
        });
    }

    function observeStatics() {
        document.querySelectorAll(".reveal-once").forEach((el) => {
            if (el.classList.contains("is-revealed")) return;
            if (el.getAttribute("data-reveal-observed")) return;
            if (!isElementInLiveLayout(el)) return;
            el.setAttribute("data-reveal-observed", "1");
            if (reduceMotion()) {
                el.classList.add("is-revealed");
                return;
            }
            if (gsap) gsap.set(el, { opacity: 0, y: 28 });
            staticObserver.observe(el);
        });
    }

    function endBootLock() {
        document.body.classList.remove("is-booting");
    }

    function initPreloader() {
        const el = document.getElementById("site-preloader");
        if (!el) {
            return;
        }
        if (!reduceMotion()) {
            document.body.classList.add("is-booting");
        }
        if (reduceMotion()) {
            el.classList.add("site-preloader--hide");
            window.setTimeout(() => {
                if (el.parentNode) el.remove();
                endBootLock();
                document.dispatchEvent(new Event("kegling:preloader-done"));
            }, 0);
            return;
        }
        const line = el.querySelector(".site-preloader__line");
        const name = el.querySelector(".site-preloader__name");
        if (line && gsap) gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        if (name && gsap) gsap.set(name, { opacity: 0, letterSpacing: "0.4em" });

        const done = () => {
            if (gsap && line && name) {
                const tl = gsap.timeline({
                    onComplete: () => {
                        if (el.parentNode) el.remove();
                        endBootLock();
                        document.dispatchEvent(new Event("kegling:preloader-done"));
                    }
                });
                tl.to(line, { scaleX: 1, duration: 0.5, ease: "power2.inOut" })
                    .to(
                        name,
                        {
                            opacity: 1,
                            letterSpacing: "0.14em",
                            duration: 0.45,
                            ease: "power2.out"
                        },
                        "-=0.2"
                    )
                    .to(el, { yPercent: -100, duration: 0.7, ease: "power3.inOut" }, "+=0.1");
            } else {
                el.classList.add("site-preloader--hide");
                window.setTimeout(() => {
                    if (el.parentNode) el.remove();
                    endBootLock();
                    document.dispatchEvent(new Event("kegling:preloader-done"));
                }, 480);
            }
        };
        if (document.readyState === "complete") {
            window.setTimeout(done, 220);
        } else {
            window.addEventListener("load", () => window.setTimeout(done, 220), { once: true });
        }
    }

    function initHero() {
        const logo = document.querySelector(".main-logo");
        if (!logo || reduceMotion()) return;
        if (gsap) {
            gsap.from(logo, {
                opacity: 0,
                y: 32,
                letterSpacing: "0.28em",
                duration: 0.95,
                ease: "power3.out",
                delay: 0.05
            });
        }
        const hint = document.querySelector(".scroll-hint");
        if (hint && gsap) {
            gsap.from(hint, { opacity: 0, y: 10, duration: 0.5, delay: 0.45, ease: "power2.out" });
        }
    }

    function initParallax() {
        const target = document.querySelector(".welcome-hero");
        if (!target || !allowParallax()) return;
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                const y = window.scrollY || 0;
                const shift = Math.min(1, y / 400) * 24;
                target.style.setProperty("--parallax", `${-shift}`);
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    function initNavMicro() {
        if (reduceMotion() || !gsap) return;
        document.querySelectorAll("header nav a").forEach((link) => {
            if (isCoarse()) return;
            const base = "0.12em";
            const wide = "0.18em";
            link.addEventListener(
                "mouseenter",
                function () {
                    gsap.to(this, { letterSpacing: wide, duration: 0.3, ease: "power1.out" });
                },
                { passive: true }
            );
            link.addEventListener(
                "mouseleave",
                function () {
                    gsap.to(this, { letterSpacing: base, duration: 0.32, ease: "power1.out" });
                },
                { passive: true }
            );
        });
    }

    function initTap() {
        if (reduceMotion()) return;
        const sel = "button, .buy-now-btn, .favorite-btn, .quick-view-btn, .sidebar-link, .review-star, .gallery-thumb, .back-link, .active-filter-clear";
        const down = (e) => {
            const t = e.target.closest(sel);
            if (!t || t.disabled) return;
            if (t.classList && t.classList.contains("close")) return;
            if (gsap) gsap.to(t, { scale: 0.98, duration: 0.1, ease: "power2.out" });
        };
        const up = (e) => {
            const t = e.target.closest(sel);
            if (!t) return;
            if (gsap) gsap.to(t, { scale: 1, duration: 0.18, ease: "power2.out" });
        };
        document.addEventListener("pointerdown", down, { passive: true });
        document.addEventListener("pointerup", up, { passive: true });
        document.addEventListener("pointercancel", up, { passive: true });
    }

    function onDomUpdated() {
        observeCards(document.getElementById("products-grid"));
        const rv = document.getElementById("recently-viewed-grid");
        if (rv) observeCards(rv);
    }

    function onSectionChange() {
        window.requestAnimationFrame(() => {
            observeStatics();
        });
    }

    function onDomUpdatedFull() {
        onDomUpdated();
    }

    function boot() {
        let heroLaunched = false;
        const runHero = () => {
            if (heroLaunched) return;
            heroLaunched = true;
            initHero();
            initParallax();
        };

        initPreloader();
        initNavMicro();
        initTap();
        observeStatics();
        onDomUpdated();

        if (reduceMotion()) {
            runHero();
        } else {
            document.addEventListener("kegling:preloader-done", runHero, { once: true });
            window.setTimeout(() => {
                if (!document.getElementById("site-preloader")) {
                    runHero();
                }
            }, 2000);
        }

        document.addEventListener("kegling:dom-updated", onDomUpdatedFull);
        document.addEventListener("kegling:section-changed", onSectionChange);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();

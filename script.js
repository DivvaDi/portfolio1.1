/* =========================================================
   Диана Овчинникова — портфолио
   Реализованный JavaScript:
   1) Переключатель тёмной/светлой темы с localStorage
   2) Кнопка «Наверх» (появление при скролле + плавный возврат)
   3) Плавная навигация по якорям
   Плюс: прогресс-бар чтения, мобильное меню, reveal-анимации,
   фильтр проектов, автоматический год в футере.
   ========================================================= */

   (() => {
    "use strict";
  
    const html = document.documentElement;
    const STORAGE_KEY = "diana-theme";
  
    /* ---------- 1. Тема ---------- */
    const themeToggle = document.getElementById("themeToggle");
  
    const getPreferredTheme = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };
  
    const applyTheme = (theme) => {
      html.setAttribute("data-theme", theme);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", theme === "dark" ? "#1A0F0F" : "#FAF3EC");
    };
  
    applyTheme(getPreferredTheme());
  
    themeToggle?.addEventListener("click", () => {
      const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  
    // Реакция на смену системной темы, если пользователь ещё не выбрал
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? "dark" : "light");
    });
  
    /* ---------- 2. Кнопка «Наверх» ---------- */
    const toTop = document.getElementById("toTop");
  
    const handleToTop = () => {
      if (!toTop) return;
      if (window.scrollY > 400) toTop.classList.add("is-visible");
      else toTop.classList.remove("is-visible");
    };
  
    toTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  
    /* ---------- 3. Плавная навигация по якорям ---------- */
    const smoothScrollTo = (target) => {
      const el = document.querySelector(target);
      if (!el) return;
      const headerH = document.querySelector(".header")?.offsetHeight ?? 0;
      const top = el.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: "smooth" });
    };
  
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        smoothScrollTo(href);
        // закрыть мобильное меню
        navList?.classList.remove("is-open");
        burger?.setAttribute("aria-expanded", "false");
      });
    });
  
    /* ---------- Мобильное меню ---------- */
    const burger = document.getElementById("burger");
    const navList = document.getElementById("navList");
  
    burger?.addEventListener("click", () => {
      const open = navList?.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  
    /* ---------- Прогресс-бар чтения ---------- */
    const progressBar = document.getElementById("progressBar");
    const updateProgress = () => {
      if (!progressBar) return;
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
    };
  
    /* ---------- Reveal-анимации ---------- */
    const revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  
    /* ---------- Фильтр проектов ---------- */
    const filters = document.querySelectorAll(".filter");
    const projects = document.querySelectorAll(".project");
    const emptyMsg = document.getElementById("projectsEmpty");
  
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
  
        const filter = btn.dataset.filter;
        let visibleCount = 0;
  
        projects.forEach((card) => {
          const tags = card.dataset.tags?.split(" ") ?? [];
          const show = filter === "all" || tags.includes(filter);
          card.classList.toggle("is-hidden", !show);
          if (show) visibleCount++;
        });
  
        if (emptyMsg) emptyMsg.hidden = visibleCount !== 0;
      });
    });
  
    /* ---------- Год в футере ---------- */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  
    /* ---------- Единый слушатель scroll ---------- */
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateProgress();
        handleToTop();
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  
    // Инициализация
    updateProgress();
    handleToTop();
  })();
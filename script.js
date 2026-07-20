(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Hero photo rotator */
  document.querySelectorAll("[data-hero-rotator]").forEach(function (rotator) {
    const slides = rotator.querySelectorAll(".hero-rotator-slide");
    const prevBtn = rotator.querySelector(".hero-rotator-btn-prev");
    const nextBtn = rotator.querySelector(".hero-rotator-btn-next");
    const captionEl = rotator.parentElement
      ? rotator.parentElement.querySelector(".hero-rotator-caption")
      : null;
    let index = 0;
    let timer = null;
    const intervalMs = 3000;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });

      if (captionEl && slides[index]) {
        captionEl.textContent =
          slides[index].getAttribute("data-caption") || "";
      }
    }

    function startTimer() {
      if (reduceMotion || slides.length < 2) return;
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, intervalMs);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    rotator.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(index - 1);
        startTimer();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(index + 1);
        startTimer();
      }
    });

    rotator.addEventListener("mouseenter", stopTimer);
    rotator.addEventListener("mouseleave", startTimer);
    rotator.addEventListener("focusin", stopTimer);
    rotator.addEventListener("focusout", startTimer);

    startTimer();
  });

  /* Showcase tabs */
  document.querySelectorAll("[data-showcase-tabs]").forEach(function (root) {
    const tablist = root.querySelector(":scope > .showcase-tablist");
    const tabs = tablist
      ? tablist.querySelectorAll(".showcase-tab")
      : root.querySelectorAll(".showcase-tab");

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const panelId = tab.getAttribute("aria-controls");
        const panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;

        tabs.forEach(function (t) {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", active ? "true" : "false");
        });

        tabs.forEach(function (t) {
          const id = t.getAttribute("aria-controls");
          const p = id ? document.getElementById(id) : null;
          if (!p) return;
          const active = p === panel;
          p.classList.toggle("is-active", active);
          if (active) {
            p.removeAttribute("hidden");
          } else {
            p.setAttribute("hidden", "");
          }
        });
      });
    });
  });

  /* Carousels */
  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dots = carousel.querySelectorAll(".carousel-dot");
    const prevBtn = carousel.querySelector(".carousel-btn-prev");
    const nextBtn = carousel.querySelector(".carousel-btn-next");
    const captionEl = carousel.querySelector(".carousel-caption");
    let index = 0;

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });

      dots.forEach(function (dot, i) {
        const active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
      });

      if (captionEl && slides[index]) {
        captionEl.textContent =
          slides[index].getAttribute("data-caption") || "";
      }
    }

    carousel.showSlide = showSlide;
    carousel.getSlideIndex = function () {
      return index;
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        showSlide(index - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        showSlide(index + 1);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
      });
    });

    carousel.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(index + 1);
      }
    });
  });

  /* Lightbox */
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const lightboxPrev = lightbox.querySelector(".lightbox-prev");
  const lightboxNext = lightbox.querySelector(".lightbox-next");
  let lightboxCarousel = null;
  let lightboxIndex = 0;
  let lastFocus = null;

  function getZoomButtons(container) {
    return container ? container.querySelectorAll(".carousel-zoom") : [];
  }

  function openLightbox(container, index) {
    const buttons = getZoomButtons(container);
    const btn = buttons[index];
    if (!btn) return;

    lightboxCarousel = container;
    lightboxIndex = index;
    lastFocus = document.activeElement;

    lightboxImg.src = btn.getAttribute("data-src") || "";
    lightboxImg.alt = btn.getAttribute("data-alt") || "";
    const slide = btn.closest(".carousel-slide");
    const compareCaption = btn.closest(".compare-card");
    lightboxCaption.textContent =
      (slide && slide.getAttribute("data-caption")) ||
      (compareCaption &&
        compareCaption.querySelector("figcaption") &&
        compareCaption.querySelector("figcaption").textContent) ||
      "";

    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightbox.querySelector(".lightbox-close").focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lightboxImg.src = "";
    lightboxCarousel = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function lightboxStep(delta) {
    if (!lightboxCarousel) return;
    const buttons = getZoomButtons(lightboxCarousel);
    if (!buttons.length) return;
    lightboxIndex = (lightboxIndex + delta + buttons.length) % buttons.length;
    if (lightboxCarousel.showSlide) {
      lightboxCarousel.showSlide(lightboxIndex);
    }
    openLightbox(lightboxCarousel, lightboxIndex);
  }

  document.querySelectorAll(".carousel-zoom").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const container =
        btn.closest("[data-carousel]") || btn.closest(".compare-grid");
      if (!container) return;

      const buttons = container.querySelectorAll(".carousel-zoom");
      let index = 0;
      buttons.forEach(function (zoomBtn, i) {
        if (zoomBtn === btn) index = i;
      });
      openLightbox(container, index);
    });
  });

  lightbox.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
    el.addEventListener("click", closeLightbox);
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function () {
      lightboxStep(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", function () {
      lightboxStep(1);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") lightboxStep(-1);
    if (event.key === "ArrowRight") lightboxStep(1);
  });
})();

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
})();

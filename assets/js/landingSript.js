const swiper = new Swiper(".destinations-swiper", {
  // Optional parameters
  direction: "horizontal",
  slidesPerView: 5,
  spaceBetween: 0,
  loop: true,
  centeredSlides: false,

  // Responsive breakpoints
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 0,
    },
    1024: {
      slidesPerView: 5,
      spaceBetween: 0,
    },
  },

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true,
  },
});

const flightsSwiper = new Swiper(".flights-swiper", {
  slidesPerView: 2,
  spaceBetween: 20,
  loop: true,
  pagination: {
    el: ".flights-swiper .swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".flights-swiper .swiper-button-next",
    prevEl: ".flights-swiper .swiper-button-prev",
  },
});

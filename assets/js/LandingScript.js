

const swiper = new Swiper(".destinations-swiper", {
  // Optional parameters
  direction: "horizontal",
  slidesPerView: 4, // Reduced from 5 to accommodate spacing
  spaceBetween: 30, // Increased from 0 to add space between cards
  loop: true,
  centeredSlides: false,

  // Responsive breakpoints
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20, // Added space for mobile
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 25, // Added space for tablet
    },
    1024: {
      slidesPerView: 4, // Reduced from 5
      spaceBetween: 30, // Added space for desktop
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


function playVideo() {
  const video = document.getElementById("custom-video");
  video.play();
}

function pauseVideo() {
  const video = document.getElementById("custom-video");
  video.pause();
}
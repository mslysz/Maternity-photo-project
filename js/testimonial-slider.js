import initCarousel from './components/carousel.js';

export default function initTestimonialSlider() {
  initCarousel({
    root: document.querySelector('.testimonials'),
    track: document.querySelector('.testimonials__slider'),
    previous: document.querySelector('.testimonials__btn--prev'),
    next: document.querySelector('.testimonials__btn--next'),
    interval: 4000,
  });
}

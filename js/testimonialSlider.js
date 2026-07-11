export default function initTestimonialSlider() {
  const el = (selector) => document.querySelector(selector);
  const allEl = (selector) => [...document.querySelectorAll(selector)];
  const slider = el('.testimonials__slider');
  const initialSlides = allEl('.testimonials__card');
  const nextBtn = el('.testimonials__btn--next');
  const prevBtn = el('.testimonials__btn--prev');

  if (!slider || initialSlides.length === 0 || !nextBtn || !prevBtn) return;

  const firstClone = initialSlides[0].cloneNode(true);
  const lastClone = initialSlides[initialSlides.length - 1].cloneNode(true);

  slider.append(firstClone);
  slider.prepend(lastClone);

  const allSlides = allEl('.testimonials__card');

  let counter = 1;
  let intervalId;

  slider.style.transform = `translateX(-${counter * 100}%)`;

  function updateSlider() {
    slider.style.transform = `translateX(-${counter * 100}%)`;
  }

  function nextSlide() {
    if (counter >= allSlides.length - 1) return;
    counter++;
    slider.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    updateSlider();
  }

  function prevSlide() {
    if (counter <= 0) return;
    counter--;
    slider.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    updateSlider();
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  slider.addEventListener('transitionend', () => {
    if (counter === allSlides.length - 1) {
      slider.style.transition = 'none';
      counter = 1;
      updateSlider();
    }

    if (counter === 0) {
      slider.style.transition = 'none';
      counter = allSlides.length - 2;
      updateSlider();
    }
  });

  function startAutoplay() {
    intervalId = setInterval(() => {
      nextSlide();
    }, 4000);
  }

  function resetAutoplay() {
    clearInterval(intervalId);
    startAutoplay();
  }

  startAutoplay();
}

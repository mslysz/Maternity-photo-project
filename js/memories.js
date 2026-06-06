export default function initMemories() {
  const el = (selector) => document.querySelector(selector);
  const allEl = (selector) => [...document.querySelectorAll(selector)];

  const carousel = el('.memories__carousel');
  const prevBtn = el('.memories__btn--prev');
  const nextBtn = el('.memories__btn--next');

  if (!carousel || !prevBtn || !nextBtn) return;

  let isTransitioning = false;
  let autoPlayTimer = null;
  let interactionTimeout = null;

  const AUTO_PLAY_SPEED = 3000;
  const PAUSE_DURATION = 5000;

  function updateClasses() {
    const currentSlides = allEl('.memories__image');
    currentSlides.forEach((slide) => slide.classList.remove('is-active'));

    if (currentSlides[1]) {
      currentSlides[1].classList.add('is-active');
    }
  }

  function moveNext() {
    if (isTransitioning) return;
    isTransitioning = true;

    const slides = allEl('.memories__image');
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(carousel).gap) || 0;
    const moveDistance = slideWidth + gap;

    carousel.style.transition = 'transform 0.4s ease-in-out';
    carousel.style.transform = `translateX(${-moveDistance}px)`;

    carousel.addEventListener('transitionend', function onNextEnd() {
      carousel.removeEventListener('transitionend', onNextEnd);

      carousel.style.transition = 'none';
      carousel.appendChild(carousel.firstElementChild);
      carousel.style.transform = 'translateX(0)';

      updateClasses();
      isTransitioning = false;
    });
  }

  function movePrev() {
    if (isTransitioning) return;
    isTransitioning = true;

    const slides = allEl('.memories__image');
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(carousel).gap) || 0;
    const moveDistance = slideWidth + gap;

    carousel.style.transition = 'none';
    carousel.insertBefore(
      carousel.lastElementChild,
      carousel.firstElementChild,
    );
    carousel.style.transform = `translateX(${-moveDistance}px)`;

    carousel.offsetHeight;

    carousel.style.transition = 'transform 0.4s ease-in-out';
    carousel.style.transform = 'translateX(0)';

    carousel.addEventListener('transitionend', function onPrevEnd() {
      carousel.removeEventListener('transitionend', onPrevEnd);
      updateClasses();
      isTransitioning = false;
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(moveNext, AUTO_PLAY_SPEED);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  function handleUserInteraction(action) {
    stopAutoPlay();
    if (interactionTimeout) clearTimeout(interactionTimeout);

    action();

    interactionTimeout = setTimeout(startAutoPlay, PAUSE_DURATION);
  }

  nextBtn.addEventListener('click', () => handleUserInteraction(moveNext));
  prevBtn.addEventListener('click', () => handleUserInteraction(movePrev));

  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  updateClasses();
  startAutoPlay();
}

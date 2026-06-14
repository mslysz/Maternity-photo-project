export default function initMaternity() {
  const el = (selector) => document.querySelector(selector);
  const allEl = (selector) => [...document.querySelectorAll(selector)];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const baseClass = entry.target.className.split(' ')[0];
        if (entry.isIntersecting)
          entry.target.classList.add(`${baseClass}--visible`);
        else entry.target.classList.remove(`${baseClass}--visible`);
      });
    },
    { threshold: 0.1 },
  );

  allEl(
    '.maternity__header, .maternity__card, .maternity-page__content, .maternity-page__showcase',
  ).forEach((element) => observer.observe(element));

  const carousel = el('.maternity-slideshow__carousel');
  const btnPrev = el('.maternity-slideshow__btn--prev');
  const btnNext = el('.maternity-slideshow__btn--next');

  if (!carousel || !btnPrev || !btnNext) return;

  const getPaddingOffset = () =>
    parseFloat(window.getComputedStyle(carousel).paddingLeft) || 0;

  let isTransitioning = false;
  let autoPlayTimer = null;
  let interactionTimeout = null;
  const AUTO_PLAY_SPEED = 3000;
  const PAUSE_DURATION = 5000;

  function moveNext() {
    if (isTransitioning) return;
    isTransitioning = true;

    const firstSlide = carousel.firstElementChild;
    const gap = parseFloat(window.getComputedStyle(carousel).gap) || 0;
    const moveDistance = firstSlide.getBoundingClientRect().width + gap;
    const paddingOffset = getPaddingOffset();

    carousel.style.transition = 'transform 0.4s ease-in-out';
    carousel.style.transform = `translateX(${-moveDistance - paddingOffset}px)`;

    carousel.addEventListener('transitionend', function onNextEnd() {
      carousel.removeEventListener('transitionend', onNextEnd);
      carousel.appendChild(firstSlide);
      carousel.style.transition = 'none';
      carousel.style.transform = `translateX(${-paddingOffset}px)`;
      isTransitioning = false;
    });
  }

  function movePrev() {
    if (isTransitioning) return;
    isTransitioning = true;

    const lastSlide = carousel.lastElementChild;
    const gap = parseFloat(window.getComputedStyle(carousel).gap) || 0;
    const moveDistance = lastSlide.getBoundingClientRect().width + gap;
    const paddingOffset = getPaddingOffset();

    carousel.insertBefore(lastSlide, carousel.firstElementChild);

    carousel.style.transition = 'none';
    carousel.style.transform = `translateX(${-moveDistance - paddingOffset}px)`;
    carousel.offsetHeight; // Reflow

    carousel.style.transition = 'transform 0.4s ease-in-out';
    carousel.style.transform = `translateX(${-paddingOffset}px)`;

    carousel.addEventListener('transitionend', function onPrevEnd() {
      carousel.removeEventListener('transitionend', onPrevEnd);
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

  btnNext.addEventListener('click', () => handleUserInteraction(moveNext));
  btnPrev.addEventListener('click', () => handleUserInteraction(movePrev));
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  carousel.style.transform = `translateX(${-getPaddingOffset()}px)`;
  startAutoPlay();

  // ACCORDION FAQ

  const faqContainer = el('.maternity-questions');

  if (faqContainer) {
    faqContainer.addEventListener('click', (e) => {
      const button = e.target.closest('.maternity-questions__header');
      if (!button) return;

      const parent = button.closest('.maternity-questions__question');
      const content = parent.querySelector('.maternity-questions__content');
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      allEl('.maternity-questions__question').forEach((item) => {
        if (item !== parent) {
          item.classList.remove('maternity-questions__question--active');

          const header = item.querySelector('.maternity-questions__header');
          if (header) header.setAttribute('aria-expanded', 'false');

          const itemContent = item.querySelector(
            '.maternity-questions__content',
          );
          if (itemContent) {
            itemContent.style.maxHeight = '0px';
          }
        }
      });

      if (isExpanded) {
        parent.classList.remove('maternity-questions__question--active');
        button.setAttribute('aria-expanded', 'false');

        content.style.maxHeight = '0px';
      } else {
        parent.classList.add('maternity-questions__question--active');
        button.setAttribute('aria-expanded', 'true');

        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  }
}

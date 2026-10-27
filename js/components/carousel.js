export default function initCarousel({
  root,
  track,
  previous,
  next,
  interval = 3000,
  pauseDuration = 5000,
  activeSlide = false,
}) {
  if (!root || !track || !previous || !next) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let transitionTimer;
  let finishTransition;
  let transitioning = false;
  let hovered = false;
  let focused = false;
  let resumeAt = 0;

  function stop() {
    clearTimeout(timer);
  }

  function schedule() {
    stop();
    if (
      hovered ||
      focused ||
      motion.matches ||
      document.hidden ||
      track.children.length < 2
    )
      return;
    timer = setTimeout(
      () => {
        move(1);
        schedule();
      },
      Math.max(interval, resumeAt - Date.now()),
    );
  }

  function resetPosition() {
    track.style.transition = 'none';
    const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    track.style.transform = `translateX(${-padding}px)`;
    if (activeSlide) {
      [...track.children].forEach((slide, index) => {
        const center = matchMedia('(min-width: 768px) and (min-height: 501px)')
          .matches
          ? 1
          : 0;
        slide.classList.toggle('is-active', index === center);
      });
    }
  }

  function move(direction) {
    if (transitioning || track.children.length < 2) return;
    transitioning = true;
    const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    let distance;
    if (direction < 0) {
      track.prepend(track.lastElementChild);
      distance = track.children[1].offsetLeft - track.children[0].offsetLeft;
      track.style.transition = 'none';
      track.style.transform = `translateX(${-padding - distance}px)`;
      void track.offsetHeight;
    } else {
      // Layout offsets exclude scale transforms and include gaps/margins.
      distance = track.children[1].offsetLeft - track.children[0].offsetLeft;
    }

    const finish = () => {
      clearTimeout(transitionTimer);
      track.removeEventListener('transitionend', onEnd);
      track.removeEventListener('transitioncancel', onEnd);
      if (direction > 0) track.append(track.firstElementChild);
      resetPosition();
      transitioning = false;
      finishTransition = null;
    };
    const onEnd = (event) => {
      if (event.target === track && event.propertyName === 'transform')
        finish();
    };
    finishTransition = finish;

    if (motion.matches) {
      finish();
      return;
    }

    track.addEventListener('transitionend', onEnd);
    track.addEventListener('transitioncancel', onEnd);
    track.style.transition = 'transform 0.4s ease-in-out';
    track.style.transform = `translateX(${direction > 0 ? -padding - distance : -padding}px)`;
    // A cancelled/missing transition must not leave the controls locked.
    transitionTimer = setTimeout(finish, 550);
  }

  function interact(direction) {
    stop();
    resumeAt = Date.now() + pauseDuration;
    move(direction);
    schedule();
  }

  next.addEventListener('click', () => interact(1));
  previous.addEventListener('click', () => interact(-1));
  // Hovering the photos pauses reading; the controls must not keep autoplay
  // stopped after a pointer click has left focus on an arrow button.
  track.addEventListener('mouseenter', () => {
    hovered = true;
    stop();
  });
  track.addEventListener('mouseleave', () => {
    hovered = false;
    schedule();
  });
  root.addEventListener('focusin', (event) => {
    focused = event.target.matches(':focus-visible');
    if (focused) stop();
  });
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget)) {
      focused = false;
      schedule();
    }
  });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => {
    finishTransition?.();
    schedule();
  });
  window.addEventListener('resize', () => {
    finishTransition?.();
    resetPosition();
  });
  previous.disabled = next.disabled = track.children.length < 2;
  resetPosition();
  schedule();
}

export function initPhotoCarousel(block, options = {}) {
  initCarousel({
    root: document.querySelector(`.${block}`),
    track: document.querySelector(`.${block}__carousel`),
    previous: document.querySelector(`.${block}__btn--prev`),
    next: document.querySelector(`.${block}__btn--next`),
    ...options,
  });
}

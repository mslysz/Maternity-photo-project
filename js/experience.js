export default function initExperience() {
  const el = (selector) => document.querySelector(selector);
  const allEl = (selector) => [...document.querySelectorAll(selector)];

  const experienceSection = el('.experience');
  const animatableElements = allEl(
    '.experience__image-wrapper, .experience__text-wrapper',
  );

  if (!experienceSection) return;

  const observerOptions = {
    root: null,
    threshold: 0.15,
  };

  const experienceObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentClass = entry.target.classList[0];

        if (currentClass) {
          entry.target.classList.add(`${currentClass}--visible`);
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatableElements.forEach((element) => experienceObserver.observe(element));
}

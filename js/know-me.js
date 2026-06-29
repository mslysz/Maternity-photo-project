export default function initKnowMe() {
  const allEl = (selector) => [...document.querySelectorAll(selector)];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const currentClass =
          entry.target.classList[1] || entry.target.classList[0];

        if (entry.isIntersecting) {
          entry.target.classList.add(`${currentClass}--visible`);
        } else {
          entry.target.classList.remove(`${currentClass}--visible`);
        }
      });
    },
    {
      threshold: 0.2,
    },
  );

  allEl(
    '.presentation__text-wrapper, .presentation__img--first, .presentation__img--second, .navigation-tiles__tile',
  ).forEach((element) => observer.observe(element));

  const faqContainer = document.querySelector('.know-me');

  if (faqContainer) {
    faqContainer.addEventListener('click', (e) => {
      const button = e.target.closest('.know-me__header');
      if (!button) return;

      const parent = button.closest('.know-me__question');
      const content = parent.querySelector('.know-me__content');
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      allEl('.know-me__question').forEach((item) => {
        if (item !== parent) {
          item.classList.remove('know-me__question--active');

          const header = item.querySelector('.know-me__header');
          if (header) header.setAttribute('aria-expanded', 'false');

          const itemContent = item.querySelector('.know-me__content');
          if (itemContent) {
            itemContent.style.maxHeight = '0px';
          }
        }
      });

      if (isExpanded) {
        parent.classList.remove('know-me__question--active');
        button.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
      } else {
        parent.classList.add('know-me__question--active');
        button.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  }
}

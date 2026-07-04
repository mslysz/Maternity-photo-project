export default function initBlog() {
  const el = (selector) => document.querySelector(selector);
  const allEl = (selector) => [...document.querySelectorAll(selector)];

  const elementsToAnimate = allEl('.blog-hero, .post-card');
  const blogContainer = el('.blog-posts');

  if (elementsToAnimate.length === 0 && !blogContainer) return;

  if (elementsToAnimate.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const baseClass = entry.target.className.split(' ')[0];
          if (entry.isIntersecting) {
            entry.target.classList.add(`${baseClass}--visible`);
          } else {
            entry.target.classList.remove(`${baseClass}--visible`);
          }
        });
      },
      { threshold: 0.1 },
    );

    elementsToAnimate.forEach((element) => observer.observe(element));
  }

  if (blogContainer) {
    blogContainer.addEventListener('click', (e) => {
      const button = e.target.closest('.post-card__read-more');
      if (!button) return;

      const card = button.closest('.post-card');
      const content = card.querySelector('.post-card__full-content');
      const btnText = button.querySelector('.btn-text');
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        card.classList.remove('post-card--expanded');
        button.setAttribute('aria-expanded', 'false');
        btnText.textContent = 'Read Article';
        content.style.maxHeight = '0px';
      } else {
        card.classList.add('post-card--expanded');
        button.setAttribute('aria-expanded', 'true');
        btnText.textContent = 'Close Article';
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  }
}

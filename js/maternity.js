export default function initMaternity() {
  const options = {
    root: null,
    threshold: 0.1,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      const baseClass = entry.target.className.split(' ')[0];

      if (entry.isIntersecting) {
        entry.target.classList.add(`${baseClass}--visible`);
      } else {
        entry.target.classList.remove(`${baseClass}--visible`);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, options);

  const elements = document.querySelectorAll(
    '.maternity__header, .maternity__card, .maternity-page__content, .maternity-page__showcase',
  );

  elements.forEach((el) => observer.observe(el));
}

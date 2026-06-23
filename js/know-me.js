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
    '.presentation__text-wrapper, .presentation__img--first, .presentation__img--second',
  ).forEach((element) => observer.observe(element));
}

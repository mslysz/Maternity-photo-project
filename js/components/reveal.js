// Explicit selectors keep animation state independent of HTML class order.
export default function reveal(selectors, { threshold = 0.1 } = {}) {
  const targets = selectors.flatMap((selector) =>
    [...document.querySelectorAll(selector)].map((element) => ({
      element,
      visibleClass: `${selector.slice(1)}--visible`,
    })),
  );

  if (!targets.length) return;

  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    targets.forEach(({ element, visibleClass }) => {
      element.classList.add(visibleClass);
    });
    return;
  }

  const visibleClasses = new Map(
    targets.map(({ element, visibleClass }) => [element, visibleClass]),
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add(visibleClasses.get(target));
        observer.unobserve(target);
      });
    },
    { threshold },
  );

  targets.forEach(({ element }) => {
    element.classList.add('reveal-pending');
    observer.observe(element);
  });
}

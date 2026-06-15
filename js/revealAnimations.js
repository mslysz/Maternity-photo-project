export default function initShowcase() {
  const showcaseItems = document.querySelectorAll('.js-reveal-left');

  if (!showcaseItems.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const delay = Number(entry.target.dataset.delay) || 0;

        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);

        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
    },
  );

  showcaseItems.forEach((item) => observer.observe(item));
}

export default function initPhilosophy() {
  const el = (selector) => document.querySelector(selector);

  const philosophySection = el('.philosophy');
  const header = el('.philosophy__header');
  const grid = el('.philosophy__grid');

  if (!philosophySection || !header || !grid) return;

  window.addEventListener('scroll', () => {
    const vh = window.innerHeight;

    const headerTop = header.getBoundingClientRect().top;
    const sectionTop = philosophySection.getBoundingClientRect().top;

    // Header trigger
    header.classList.toggle(
      'philosophy__header--visible',
      sectionTop < vh * 0.7,
    );

    // Grid trigger
    grid.classList.toggle('philosophy__grid--visible', headerTop < vh * 0.7);
  });
}

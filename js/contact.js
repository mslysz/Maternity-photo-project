export default function initContactPage() {
  const el = (selector) => document.querySelector(selector);
  const allEl = (selector) => [...document.querySelectorAll(selector)];

  const contactSection = el('.contact');
  const animatableFigures = allEl('.contact__figure');

  if (!contactSection) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
  };

  const figureObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('contact__figure--visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatableFigures.forEach((fig) => figureObserver.observe(fig));
}

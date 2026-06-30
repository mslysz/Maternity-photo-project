export default function initCookieBanner() {
  const el = (selector) => document.querySelector(selector);

  const cookieBanner = el('#cookie-banner');
  const cookieAcceptBtn = el('#cookie-accept');

  if (!cookieBanner || !cookieAcceptBtn) return;

  if (!localStorage.getItem('cookieConsent')) {
    cookieBanner.classList.remove('cookie-banner--hidden');
    cookieBanner.removeAttribute('inert');
  }

  cookieAcceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'true');
    cookieAcceptBtn.blur();
    cookieBanner.classList.add('cookie-banner--hidden');
    cookieBanner.setAttribute('inert', '');
  });
}

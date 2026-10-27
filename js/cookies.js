export default function initCookieBanner() {
  const cookieBanner = document.querySelector('#cookie-banner');
  const cookieAcceptBtn = document.querySelector('#cookie-accept');
  if (!cookieBanner || !cookieAcceptBtn) return;
  let consent = false;
  try {
    consent = localStorage.getItem('cookieConsent') === 'true';
  } catch {
    // The banner also works when browser storage is unavailable.
  }
  if (!consent) {
    cookieBanner.classList.remove('cookie-banner--hidden');
    cookieBanner.inert = false;
  }
  cookieAcceptBtn.addEventListener('click', () => {
    try {
      localStorage.setItem('cookieConsent', 'true');
    } catch {
      // Dismiss for this visit even if the preference cannot be saved.
    }
    cookieAcceptBtn.blur();
    cookieBanner.classList.add('cookie-banner--hidden');
    cookieBanner.inert = true;
  });
}

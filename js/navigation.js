export async function initNavigation() {
  const navList = document.querySelector('.nav__list');
  if (!navList) return;
  try {
    const response = await fetch(
      new URL('../data/navigation.json', import.meta.url),
    );
    if (!response.ok)
      throw new Error(`Navigation request failed: ${response.status}`);
    const navigation = await response.json();
    if (!Array.isArray(navigation)) throw new Error('Invalid navigation data');
    const links = navigation.map((item) => {
      const listItem = document.createElement('li');
      listItem.className = 'nav__item';
      const link = document.createElement('a');
      link.className = 'nav__link';
      if (item.class)
        link.classList.add(...item.class.split(/\s+/).filter(Boolean));
      link.href = item.url;
      link.textContent = item.title;
      if (
        new URL(link.href).pathname === window.location.pathname ||
        (window.location.pathname.endsWith('/') && item.url === 'index.html')
      ) {
        link.setAttribute('aria-current', 'page');
      }
      listItem.append(link);
      return listItem;
    });
    navList.replaceChildren(...links);
  } catch (error) {
    // Static links remain usable when the request fails or JavaScript is disabled.
    console.error('Could not load navigation.', error);
  }
}

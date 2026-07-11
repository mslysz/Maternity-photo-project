export async function initNavigation() {
  const el = (selector) => document.querySelector(selector);

  const response = await fetch('./data/navigation.json');
  const navigation = await response.json();

  const navList = el('.nav__list');

  navList.innerHTML = navigation
    .map(
      (item) => `
  <li class ="nav__item">
  <a class=nav__link ${item.class ?? ''}" href="${item.url}">
  ${item.title} </a>
  </li>
  `,
    )
    .join('');
}

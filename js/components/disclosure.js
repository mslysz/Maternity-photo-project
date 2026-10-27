import loadContent from '../content/load-content.js';
import { renderFaq } from '../content/templates.js';

let nextPanelId = 0;

export default function initDisclosure({
  root,
  itemSelector,
  buttonSelector,
  panelSelector,
  activeClass,
  exclusive = true,
  openLabel,
  closeLabel,
}) {
  if (!root) return;

  let items = [];

  function refresh() {
    const expandedIds = new Set(
      items
        .filter(({ button }) => button.getAttribute('aria-expanded') === 'true')
        .map(({ panel }) => panel.id),
    );
    items = [...root.querySelectorAll(itemSelector)].flatMap((item) => {
      const button = item.querySelector(buttonSelector);
      const panel = item.querySelector(panelSelector);
      if (!button || !panel) return [];
      panel.id ||= `disclosure-panel-${++nextPanelId}`;
      button.setAttribute('aria-controls', panel.id);
      button.type = 'button';
      return [{ item, button, panel }];
    });
    items.forEach((item) => setExpanded(item, expandedIds.has(item.panel.id)));
  }

  function setExpanded({ item, button, panel }, expanded) {
    item.classList.toggle(activeClass, expanded);
    button.setAttribute('aria-expanded', String(expanded));
    panel.hidden = !expanded;
    // Natural height keeps text readable after resizing or font loading.
    panel.style.maxHeight = expanded ? 'none' : '0px';
    const label = button.querySelector('.btn-text');
    if (label && openLabel && closeLabel) {
      label.textContent = expanded ? closeLabel : openLabel;
    }
  }

  refresh();
  root.addEventListener('click', (event) => {
    const button = event.target.closest(buttonSelector);
    const current = items.find((item) => item.button === button);
    if (!current) return;
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    if (exclusive && expanded) {
      items
        .filter((item) => item !== current)
        .forEach((item) => setExpanded(item, false));
    }
    setExpanded(current, expanded);
  });
  return refresh;
}

export function initFaq(block) {
  const root = document.querySelector(`.${block}`);
  if (!root) return;
  const refresh = initDisclosure({
    root,
    itemSelector: `.${block}__question`,
    buttonSelector: `.${block}__header`,
    panelSelector: `.${block}__content`,
    activeClass: `${block}__question--active`,
  });
  return loadContent({
    element: root.querySelector('[data-json-faq]'),
    file: 'faqs.json',
    select: (data) => data[block],
    render: (questions) => renderFaq(block, questions),
    onRendered: refresh,
  });
}

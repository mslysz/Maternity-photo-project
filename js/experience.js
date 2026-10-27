import reveal from './components/reveal.js';
import loadContent from './content/load-content.js';
import { renderPackages } from './content/templates.js';

export default function initExperience() {
  loadContent({
    element: document.querySelector('[data-json-packages]'),
    file: 'session-packages.json',
    render: renderPackages,
  });
  reveal(['.experience__image-wrapper', '.experience__text-wrapper'], {
    threshold: 0.15,
  });
}

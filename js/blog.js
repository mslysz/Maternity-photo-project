import reveal from './components/reveal.js';
import initDisclosure from './components/disclosure.js';

export default function initBlog() {
  reveal(['.blog-hero', '.post-card']);
  initDisclosure({
    root: document.querySelector('.blog-posts'),
    itemSelector: '.post-card',
    buttonSelector: '.post-card__read-more',
    panelSelector: '.post-card__full-content',
    activeClass: 'post-card--expanded',
    exclusive: false,
    openLabel: 'Read Article',
    closeLabel: 'Close Article',
  });
}

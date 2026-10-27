import reveal from './components/reveal.js';
import loadContent from './content/load-content.js';
import { renderOptions } from './content/templates.js';

export default function initContactPage() {
  reveal(['.contact__figure']);
  const form = document.querySelector('.contact__form');
  if (!form) return;
  form.querySelectorAll('[data-json-options]').forEach((select) => {
    loadContent({
      element: select,
      file: 'contact-options.json',
      select: (data) => data[select.dataset.jsonOptions],
      render: renderOptions,
    });
  });
  const status = document.querySelector('#contact-form-status');
  const submit = form.querySelector('[type="submit"]');
  if (form.dataset.endpoint?.trim()) {
    submit.disabled = false;
    status.textContent = '';
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const endpoint = form.dataset.endpoint?.trim();
    if (!endpoint) {
      status.textContent =
        'This form is not accepting messages yet. Please contact me at patricenebraska@gmail.com.';
      return;
    }
    if (!form.reportValidity()) return;
    submit.disabled = true;
    status.textContent = 'Sending your message…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok)
        throw new Error(`Form request failed: ${response.status}`);
      form.reset();
      status.textContent = 'Thank you. Your message has been sent.';
    } catch {
      status.textContent =
        'Your message could not be sent. Please try again or email patricenebraska@gmail.com.';
    } finally {
      submit.disabled = false;
    }
  });
}

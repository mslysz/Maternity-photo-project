const requests = new Map();

function loadJson(file) {
  if (!requests.has(file)) {
    requests.set(
      file,
      (async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        try {
          const response = await fetch(
            new URL(`../../data/${file}`, import.meta.url),
            {
              signal: controller.signal,
            },
          );
          if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
          return await response.json();
        } finally {
          clearTimeout(timeout);
        }
      })(),
    );
  }
  return requests.get(file);
}

export default async function loadContent({
  element,
  file,
  select = (data) => data,
  render,
  onRendered,
}) {
  if (!element) return false;
  try {
    const data = select(await loadJson(file));
    // Validate and render everything before touching the fallback DOM.
    const template = document.createElement('template');
    template.innerHTML = render(data);
    const active = document.activeElement;
    const focusedPanel = element.contains(active)
      ? active.getAttribute('aria-controls')
      : null;
    const selectedValue = element.tagName === 'SELECT' ? element.value : null;
    element.replaceChildren(template.content);
    if (
      selectedValue !== null &&
      [...element.options].some((option) => option.value === selectedValue)
    ) {
      element.value = selectedValue;
    }
    onRendered?.();
    if (focusedPanel) {
      [...element.querySelectorAll('[aria-controls]')]
        .find((button) => button.getAttribute('aria-controls') === focusedPanel)
        ?.focus();
    }
    element.dataset.contentSource = 'json';
    return true;
  } catch (error) {
    // Keep the generated HTML readable and interactive if data cannot be loaded.
    element.dataset.contentSource = 'html';
    console.warn(`Could not update content from ${file}; keeping HTML.`, error);
    return false;
  }
}

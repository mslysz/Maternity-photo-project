import { readFile, writeFile } from 'node:fs/promises';
import {
  renderFaq,
  renderPackages,
  renderOptions,
} from '../js/content/templates.js';

const project = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, project), 'utf8');
const [faqs, packages, options] = await Promise.all(
  ['faqs', 'session-packages', 'contact-options'].map(async (name) =>
    JSON.parse(await read(`data/${name}.json`)),
  ),
);
const outputs = new Map();

async function update(file, key, html) {
  const source = outputs.get(file) ?? (await read(file));
  const start = `<!-- content:${key} -->`;
  const end = `<!-- /content:${key} -->`;
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end);
  if (
    startIndex < 0 ||
    endIndex < startIndex ||
    source.indexOf(start, startIndex + start.length) >= 0
  ) {
    throw new Error(`Missing or duplicated content markers: ${file}, ${key}`);
  }
  const indent = source.slice(
    source.lastIndexOf('\n', startIndex) + 1,
    startIndex,
  );
  const content = html
    .split('\n')
    .map((line) => indent + line)
    .join('\n');
  outputs.set(
    file,
    source.slice(0, startIndex + start.length) +
      '\n' +
      content +
      '\n' +
      indent +
      source.slice(endIndex),
  );
}

for (const [page, block] of Object.entries({
  maternity: 'maternity-questions',
  'studio-baby': 'studio-baby-questions',
  'at-home-baby': 'at-home-baby-questions',
  'know-me': 'know-me',
})) {
  await update(`${page}.html`, `faq:${block}`, renderFaq(block, faqs[block]));
}
await update('experience.html', 'packages', renderPackages(packages));
for (const field of ['session-type', 'source']) {
  await update(
    'contact.html',
    `options:${field}`,
    renderOptions(options[field]),
  );
}

// Nothing is written until every JSON document and HTML marker is valid.
await Promise.all(
  [...outputs].map(([file, html]) => writeFile(new URL(file, project), html)),
);
console.log(`Updated JSON fallbacks in ${outputs.size} HTML files.`);

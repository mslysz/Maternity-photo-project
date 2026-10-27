import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const server = http
  .createServer(async (request, response) => {
    try {
      let pathname = decodeURIComponent(
        new URL(request.url, 'http://localhost').pathname,
      );
      // Exercise deployment in a subfolder using the same development server.
      if (pathname.startsWith('/preview/'))
        pathname = pathname.slice('/preview'.length);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const file = path.resolve(root, `.${pathname}`);
      const relative = path.relative(root, file);
      if (
        relative.startsWith('..') ||
        path.isAbsolute(relative) ||
        relative
          .split(path.sep)
          .some((part) => part.startsWith('.') || part === 'node_modules')
      ) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      const content = await readFile(file);
      response.writeHead(200, {
        'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      response.end(content);
    } catch {
      response.writeHead(404).end('Not found');
    }
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Preview: http://127.0.0.1:${port}`);
    process.send?.('ready');
  });

// IPC lets the test runner stop only its own server, also on Windows.
process.on('message', (message) => {
  if (message !== 'shutdown') return;
  server.close(() => process.exit(0));
  server.closeAllConnections();
});

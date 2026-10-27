import { fork } from 'node:child_process';

export default async function startServer() {
  try {
    const response = await fetch('http://127.0.0.1:4173', {
      signal: AbortSignal.timeout(1000),
    });
    if (response.ok) return;
  } catch {
    // Start a preview when one is not already running.
  }

  const server = fork(new URL('../scripts/server.js', import.meta.url), [], {
    stdio: ['ignore', 'ignore', 'inherit', 'ipc'],
    env: { ...process.env, PORT: '4173' },
    execArgv: [],
  });

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      server.kill();
      reject(new Error('Preview server did not start within 10 seconds.'));
    }, 10000);
    server.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    server.once('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Preview server exited before tests (code ${code}).`));
    });
    server.once('message', (message) => {
      if (message !== 'ready') return;
      clearTimeout(timer);
      resolve();
    });
  });

  return async () => {
    if (!server.connected) return;
    await new Promise((resolve) => {
      const timer = setTimeout(() => server.kill(), 5000);
      server.once('exit', () => {
        clearTimeout(timer);
        resolve();
      });
      server.send('shutdown');
    });
  };
}

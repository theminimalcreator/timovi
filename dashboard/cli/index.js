#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const command = process.argv[2];

async function main() {
  if (command === 'wizard') {
    await import('./wizard.js');
    return;
  }

  // Default: start dashboard (backend + frontend)
  console.log('🧠 Timovi Dashboard\n');

  // Start backend
  const backend = spawn('node', [join(ROOT, 'backend', 'server.js')], {
    stdio: 'inherit',
    detached: false,
  });

  backend.on('error', (err) => {
    console.error('❌ Erro ao iniciar backend:', err.message);
    process.exit(1);
  });

  // Start frontend
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: join(ROOT, 'frontend'),
    stdio: 'inherit',
    detached: false,
  });

  frontend.on('error', (err) => {
    console.error('❌ Erro ao iniciar frontend:', err.message);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    backend.kill();
    frontend.kill();
    process.exit(0);
  });
}

main().catch(console.error);

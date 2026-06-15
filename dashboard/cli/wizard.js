#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function wizard() {
  console.log('');
  console.log('  ┌─────────────────────────────────────────┐');
  console.log('  │        🧠 Timovi Dashboard               │');
  console.log('  │        Conectar um projeto               │');
  console.log('  └─────────────────────────────────────────┘');
  console.log('');

  const projectPath = await ask('  📁 Caminho da pasta do projeto: ');

  if (!projectPath) {
    console.log('\n  ❌ Nenhum caminho informado.\n');
    rl.close();
    return;
  }

  // Resolve path (handle ~)
  const resolved = projectPath.startsWith('~')
    ? join(process.env.HOME || '/root', projectPath.slice(2))
    : projectPath;

  const statePath = join(resolved, '.product-team', 'state.json');

  if (!existsSync(statePath)) {
    console.log(`\n  ❌ Nenhum time encontrado em: ${resolved}`);
    console.log(`  Execute o bootstrap via chat primeiro.\n`);
    rl.close();
    return;
  }

  // Read and validate
  try {
    const raw = readFileSync(statePath, 'utf-8');
    const state = JSON.parse(raw);
    const projectName = state.project || resolved.split('/').pop();

    console.log(`\n  ✅ .product-team/state.json detectado`);
    console.log(`  📦 Projeto: ${projectName}`);
    console.log(`  👥 Roles ativas: ${state.active_roles?.length || 0}`);
    console.log(`  📊 Fase atual: ${state.pipeline_phase || 'idle'}`);

    // Add via API
    console.log('\n  🔗 Conectando ao Dashboard...');

    try {
      const response = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: resolved }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`  ✅ Projeto conectado com sucesso!`);
        console.log(`  🌐 Dashboard → http://localhost:5173\n`);
      } else {
        console.log(`  ⚠️  ${data.error}`);
        console.log(`  O projeto já pode estar conectado.\n`);
      }
    } catch {
      console.log('  ⚠️  API não está rodando. Execute "timovi-dashboard" primeiro.');
      console.log(`  Path salvo: ${resolved}\n`);
    }
  } catch (err) {
    console.log(`\n  ❌ Erro ao ler state.json: ${err.message}\n`);
  }

  rl.close();
}

wizard();

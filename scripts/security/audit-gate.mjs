#!/usr/bin/env node
/**
 * Gate de supply chain da Designer Inox.
 *
 * Executa `npm audit --package-lock-only --json` e reprova qualquer advisory
 * de severidade bloqueante que não esteja registrado, justificado e dentro do
 * prazo de reavaliação em `security/audit-exceptions.json`.
 *
 * Diferente de `npm audit --audit-level=high`, este gate:
 *   - não permite silenciar um advisory sem justificativa versionada;
 *   - reprova exceções vencidas;
 *   - reprova exceções obsoletas, obrigando a limpeza quando o upstream corrige.
 */

import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { resolveNpmCli } from '../lib/npm-cli.mjs'
import { evaluateAudit } from './evaluate-audit.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

/**
 * @returns {Promise<object>}
 */
function runNpmAudit() {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [resolveNpmCli(), 'audit', '--package-lock-only', '--json'],
      { cwd: repoRoot, shell: false, stdio: ['ignore', 'pipe', 'pipe'] },
    )

    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('error', reject)
    // `npm audit` sai com código diferente de zero quando encontra
    // vulnerabilidades; o relatório JSON continua válido nesse caso.
    child.on('close', () => {
      try {
        resolve(JSON.parse(stdout))
      } catch {
        reject(new Error(`Não foi possível interpretar a saída de npm audit.\n${stderr}`))
      }
    })
  })
}

const exceptions = JSON.parse(
  readFileSync(path.join(repoRoot, 'security', 'audit-exceptions.json'), 'utf8'),
)

const auditReport = await runNpmAudit()
const result = evaluateAudit({ auditReport, exceptions, now: new Date() })

const totals = auditReport?.metadata?.vulnerabilities ?? {}
console.log(
  `Auditoria: ${totals.critical ?? 0} critical, ${totals.high ?? 0} high, ` +
    `${totals.moderate ?? 0} moderate, ${totals.low ?? 0} low.`,
)
console.log(
  `Advisories bloqueantes distintos: ${result.blockingCount}. ` +
    `Exceções registradas: ${(exceptions.exceptions ?? []).length}.`,
)

for (const advisory of result.unlisted) {
  console.error(
    `REPROVADO: advisory ${advisory.severity} não registrado — ${advisory.id} ` +
      `(${advisory.title}) em ${advisory.packages.join(', ')}.`,
  )
}
for (const item of result.expired) {
  console.error(`REPROVADO: exceção ${item.id} venceu em ${item.reviewBy}; reavaliar.`)
}
for (const item of result.stale) {
  console.error(
    `REPROVADO: exceção ${item.id} não é mais observada na auditoria; remover de ` +
      `security/audit-exceptions.json.`,
  )
}
for (const item of result.incomplete) {
  console.error(`REPROVADO: exceção ${item.id} está sem o campo obrigatório "${item.field}".`)
}

if (!result.ok) {
  console.error('SUPPLY_CHAIN_GATE_FAILED')
  process.exit(1)
}

console.log('SUPPLY_CHAIN_GATE_OK')

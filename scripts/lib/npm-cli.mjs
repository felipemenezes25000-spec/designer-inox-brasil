import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * Resolve o entrypoint JavaScript do npm.
 *
 * Executar `npm.cmd` com `spawn(..., { shell: false })` é rejeitado pelo Node
 * no Windows desde a mitigação da CVE-2024-27980, e habilitar `shell: true`
 * reintroduziria o risco de injeção de argumentos. Chamamos o `npm-cli.js`
 * diretamente com `process.execPath`, o que funciona nos três sistemas e
 * mantém a execução sem shell.
 *
 * @returns {string} caminho absoluto para o CLI do npm
 */
export function resolveNpmCli() {
  const fromEnv = process.env.npm_execpath
  if (fromEnv && fromEnv.endsWith('.js') && existsSync(fromEnv)) return fromEnv

  const nodeDir = path.dirname(process.execPath)
  const candidates = [
    path.join(nodeDir, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    path.join(nodeDir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }

  throw new Error('NPM_CLI_NOT_FOUND')
}

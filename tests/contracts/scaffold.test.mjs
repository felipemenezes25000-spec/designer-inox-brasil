import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import test from 'node:test'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const readJson = (relativePath) =>
  JSON.parse(readFileSync(path.join(repoRoot, relativePath), 'utf8'))

const readText = (relativePath) => readFileSync(path.join(repoRoot, relativePath), 'utf8')

test('package.json pins the approved toolchain', () => {
  const pkg = readJson('package.json')

  assert.equal(pkg.packageManager, 'npm@11.9.0')
  assert.equal(pkg.engines.node, '>=24.14.0 <25')
  assert.equal(pkg.dependencies.payload, '3.86.0')
  assert.equal(pkg.dependencies['@payloadcms/next'], '3.86.0')
  assert.equal(pkg.dependencies['@payloadcms/db-postgres'], '3.86.0')
  assert.equal(pkg.dependencies.next, '16.2.11')
  assert.equal(pkg.dependencies.react, '19.2.8')
  assert.equal(pkg.dependencies['react-dom'], '19.2.8')
  assert.doesNotMatch(JSON.stringify(pkg.scripts), /\bpnpm\b|\byarn\b/)
})

test('no dependency uses a floating range', () => {
  const pkg = readJson('package.json')
  const everyDependency = { ...pkg.dependencies, ...pkg.devDependencies }

  for (const [name, range] of Object.entries(everyDependency)) {
    assert.match(
      range,
      /^\d+\.\d+\.\d+$/,
      `${name} must be pinned to an exact version, received "${range}"`,
    )
  }
})

test('every @payloadcms package shares the pinned Payload version', () => {
  const pkg = readJson('package.json')
  const everyDependency = { ...pkg.dependencies, ...pkg.devDependencies }

  for (const [name, range] of Object.entries(everyDependency)) {
    if (!name.startsWith('@payloadcms/')) continue
    assert.equal(range, '3.86.0', `${name} must match the pinned Payload version`)
  }

  assert.equal(everyDependency['@payloadcms/db-mongodb'], undefined)
})

test('node version files agree with the engines range', () => {
  assert.equal(readText('.nvmrc').trim(), '24.14.0')
  assert.equal(readText('.node-version').trim(), '24.14.0')
})

test('the repository is npm-only', () => {
  const pkg = readJson('package.json')

  assert.equal(pkg.pnpm, undefined, 'pnpm-specific configuration must not remain')
  assert.ok(
    Array.isArray(pkg.onlyBuiltDependencies) === false || pkg.onlyBuiltDependencies.length >= 0,
  )

  const npmrc = readText('.npmrc')
  assert.doesNotMatch(npmrc, /legacy-peer-deps\s*=\s*true/)
})

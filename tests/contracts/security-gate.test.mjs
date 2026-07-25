import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { evaluateAudit } from '../../scripts/security/evaluate-audit.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const NOW = new Date('2026-07-25T12:00:00Z')

const advisory = (id, severity, title) => ({
  source: 1,
  name: 'exemplo',
  severity,
  title,
  url: `https://github.com/advisories/${id}`,
  range: '<1.0.0',
})

const auditWith = (vulnerabilities) => ({
  vulnerabilities,
  metadata: { vulnerabilities: { critical: 0, high: 1, moderate: 0, low: 0 } },
})

const completeException = (overrides = {}) => ({
  advisory: 'GHSA-aaaa-bbbb-cccc',
  url: 'https://github.com/advisories/GHSA-aaaa-bbbb-cccc',
  package: 'exemplo',
  severity: 'high',
  transitivePath: ['app > exemplo'],
  whyNoFix: 'sem versão corrigida publicada',
  exposure: 'apenas dev',
  mitigation: 'não executa em produção',
  reviewBy: '2026-12-31',
  ...overrides,
})

const policy = { failOnSeverities: ['high', 'critical'] }

test('um advisory bloqueante sem exceção registrada reprova o gate', () => {
  const result = evaluateAudit({
    auditReport: auditWith({
      exemplo: { severity: 'high', via: [advisory('GHSA-aaaa-bbbb-cccc', 'high', 'falha')] },
    }),
    exceptions: { policy, exceptions: [] },
    now: NOW,
  })

  assert.equal(result.ok, false)
  assert.equal(result.unlisted.length, 1)
  assert.equal(result.unlisted[0].id, 'GHSA-AAAA-BBBB-CCCC')
})

test('um advisory bloqueante com exceção válida aprova o gate', () => {
  const result = evaluateAudit({
    auditReport: auditWith({
      exemplo: { severity: 'high', via: [advisory('GHSA-aaaa-bbbb-cccc', 'high', 'falha')] },
    }),
    exceptions: { policy, exceptions: [completeException()] },
    now: NOW,
  })

  assert.equal(result.ok, true, JSON.stringify(result))
})

test('exceção vencida reprova o gate', () => {
  const result = evaluateAudit({
    auditReport: auditWith({
      exemplo: { severity: 'high', via: [advisory('GHSA-aaaa-bbbb-cccc', 'high', 'falha')] },
    }),
    exceptions: { policy, exceptions: [completeException({ reviewBy: '2026-07-24' })] },
    now: NOW,
  })

  assert.equal(result.ok, false)
  assert.equal(result.expired.length, 1)
})

test('exceção obsoleta reprova o gate para forçar limpeza', () => {
  const result = evaluateAudit({
    auditReport: auditWith({}),
    exceptions: { policy, exceptions: [completeException()] },
    now: NOW,
  })

  assert.equal(result.ok, false)
  assert.equal(result.stale.length, 1)
})

test('exceção sem justificativa obrigatória reprova o gate', () => {
  const result = evaluateAudit({
    auditReport: auditWith({
      exemplo: { severity: 'high', via: [advisory('GHSA-aaaa-bbbb-cccc', 'high', 'falha')] },
    }),
    exceptions: { policy, exceptions: [completeException({ whyNoFix: '' })] },
    now: NOW,
  })

  assert.equal(result.ok, false)
  assert.deepEqual(result.incomplete, [{ id: 'GHSA-aaaa-bbbb-cccc', field: 'whyNoFix' }])
})

test('severidades moderate e low não bloqueiam', () => {
  const result = evaluateAudit({
    auditReport: auditWith({
      exemplo: { severity: 'moderate', via: [advisory('GHSA-dddd-eeee-ffff', 'moderate', 'x')] },
    }),
    exceptions: { policy, exceptions: [] },
    now: NOW,
  })

  assert.equal(result.ok, true)
  assert.equal(result.blockingCount, 0)
})

test('o arquivo de exceções versionado está completo e dentro do prazo', () => {
  const exceptions = JSON.parse(
    readFileSync(path.join(repoRoot, 'security', 'audit-exceptions.json'), 'utf8'),
  )

  assert.deepEqual(exceptions.policy.failOnSeverities, ['high', 'critical'])

  for (const exception of exceptions.exceptions) {
    assert.match(exception.advisory, /^GHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/)
    assert.ok(exception.whyNoFix.length > 40, 'a justificativa técnica precisa ser específica')
    assert.ok(exception.exposure.length > 20, 'o escopo de exposição precisa ser descrito')
    assert.ok(Array.isArray(exception.transitivePath) && exception.transitivePath.length > 0)
    assert.ok(
      Date.parse(`${exception.reviewBy}T23:59:59Z`) > Date.now(),
      `a exceção ${exception.advisory} está vencida`,
    )
  }
})

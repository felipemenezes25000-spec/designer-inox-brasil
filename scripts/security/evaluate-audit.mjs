/**
 * Núcleo puro do gate de supply chain.
 *
 * Separado do wrapper de CLI para que a política seja testável sem rede,
 * sem `npm audit` e sem relógio real.
 */

const ADVISORY_ID = /(GHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4})/i

/**
 * Extrai o identificador GHSA de uma URL de advisory.
 * @param {string} url
 * @returns {string | null}
 */
export function advisoryIdFromUrl(url) {
  if (typeof url !== 'string') return null
  const match = ADVISORY_ID.exec(url)
  return match ? match[1].toUpperCase() : null
}

/**
 * Reduz um relatório `npm audit --json` ao conjunto de advisories raiz que
 * atingem as severidades bloqueantes. Entradas `via` do tipo string são apenas
 * propagação transitiva e não acrescentam advisory novo.
 *
 * @param {object} auditReport
 * @param {readonly string[]} failOnSeverities
 * @returns {Map<string, {id: string, title: string, severity: string, packages: string[]}>}
 */
export function collectBlockingAdvisories(auditReport, failOnSeverities) {
  const blocking = new Set(failOnSeverities)
  const found = new Map()
  const vulnerabilities = auditReport?.vulnerabilities ?? {}

  for (const [packageName, entry] of Object.entries(vulnerabilities)) {
    for (const via of entry.via ?? []) {
      if (typeof via !== 'object') continue
      if (!blocking.has(via.severity)) continue

      const id = advisoryIdFromUrl(via.url)
      if (!id) continue

      const existing = found.get(id)
      if (existing) {
        if (!existing.packages.includes(packageName)) existing.packages.push(packageName)
        continue
      }

      found.set(id, {
        id,
        title: via.title ?? '',
        severity: via.severity,
        packages: [packageName],
      })
    }
  }

  return found
}

/**
 * @typedef {object} GateResult
 * @property {boolean} ok
 * @property {Array<{id: string, severity: string, title: string, packages: string[]}>} unlisted
 * @property {Array<{id: string, reviewBy: string}>} expired
 * @property {Array<{id: string}>} stale
 * @property {Array<{id: string, field: string}>} incomplete
 * @property {number} blockingCount
 */

const REQUIRED_EXCEPTION_FIELDS = [
  'advisory',
  'url',
  'package',
  'severity',
  'transitivePath',
  'whyNoFix',
  'exposure',
  'mitigation',
  'reviewBy',
]

/**
 * Aplica a política de exceções ao relatório de auditoria.
 *
 * @param {{auditReport: object, exceptions: object, now: Date}} input
 * @returns {GateResult}
 */
export function evaluateAudit({ auditReport, exceptions, now }) {
  const failOnSeverities = exceptions?.policy?.failOnSeverities ?? ['high', 'critical']
  const blocking = collectBlockingAdvisories(auditReport, failOnSeverities)

  /** @type {GateResult['incomplete']} */
  const incomplete = []
  /** @type {GateResult['expired']} */
  const expired = []
  const allowed = new Map()

  for (const exception of exceptions?.exceptions ?? []) {
    for (const field of REQUIRED_EXCEPTION_FIELDS) {
      const value = exception[field]
      const missing =
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      if (missing) incomplete.push({ id: exception.advisory ?? '(sem advisory)', field })
    }

    const id = advisoryIdFromUrl(exception.url) ?? exception.advisory
    if (!id) continue

    allowed.set(String(id).toUpperCase(), exception)

    const reviewBy = Date.parse(`${exception.reviewBy}T23:59:59Z`)
    if (Number.isNaN(reviewBy) || reviewBy < now.getTime()) {
      expired.push({ id, reviewBy: exception.reviewBy })
    }
  }

  const unlisted = []
  for (const [id, advisory] of blocking) {
    if (!allowed.has(id)) unlisted.push(advisory)
  }

  const stale = []
  for (const id of allowed.keys()) {
    if (!blocking.has(id)) stale.push({ id })
  }

  return {
    ok:
      unlisted.length === 0 &&
      expired.length === 0 &&
      stale.length === 0 &&
      incomplete.length === 0,
    unlisted,
    expired,
    stale,
    incomplete,
    blockingCount: blocking.size,
  }
}

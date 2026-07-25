import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

/**
 * O DOM é desmontado e os mocks são restaurados após cada teste para que
 * nenhum caso dependa de resíduo do anterior. `cleanup` é seguro no projeto
 * Node: sem container montado ele não faz nada.
 */
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

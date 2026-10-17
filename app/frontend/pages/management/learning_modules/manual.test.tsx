import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { manager } from '@/test/managementFixtures'
import { page, router } from '@/test/inertiaMock'
import LearningModulesManual from './manual'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('LearningModulesManual', () => {
  beforeEach(() => {
    page.url = '/management/modules/new?mode=manual'
    page.props = {
      journey: { id: 'onboarding-atendimento', name: 'Onboarding Atendimento' },
      generated: { lessons: 8, review_path: '/x' },
      manager,
    }
    router.visit.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds lessons to the module', async () => {
    render(<LearningModulesManual />)

    await userEvent.click(screen.getByRole('button', { name: /Adicionar lição/ }))

    expect(screen.getByLabelText('Título da lição 2')).toBeInTheDocument()
  })

  it('needs a name, then saves (simulated) and goes back to the journey', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<LearningModulesManual />)

    expect(screen.getByRole('button', { name: /Salvar módulo/ })).toBeDisabled()
    await userEvent.type(screen.getByPlaceholderText('Ex.: Trocas e devoluções'), 'Trocas')
    await userEvent.click(screen.getByRole('button', { name: /Salvar módulo/ }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Módulo "Trocas" salvo com 1 lição(ões) (simulação).',
    )
    act(() => vi.runAllTimers())
    expect(router.visit).toHaveBeenCalledWith('/management/journeys/onboarding-atendimento')
  })
})

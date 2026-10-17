import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import LearningModulesNew from './new'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('LearningModulesNew', () => {
  beforeEach(() => {
    page.url = '/management/modules/new'
    page.props = {
      journey: { id: 'onboarding-atendimento', name: 'Onboarding Atendimento' },
      generated: { lessons: 8, review_path: '/management/modules/rotinas-de-atendimento' },
      manager,
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('needs a file before creating the lessons', async () => {
    render(<LearningModulesNew />)

    expect(screen.getByRole('button', { name: /Criar lições com IA/ })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: /Usar o arquivo de exemplo/ }))

    expect(screen.getByText('Manual de SAC.pdf')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Criar lições com IA/ })).toBeEnabled()
  })

  it('shows the AI working and then sends the reviewer to the lessons', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<LearningModulesNew />)

    await userEvent.click(screen.getByRole('button', { name: /Usar o arquivo de exemplo/ }))
    await userEvent.click(screen.getByRole('button', { name: /Criar lições com IA/ }))
    expect(screen.getByRole('status')).toHaveTextContent('A IA está criando 8 lições…')

    act(() => vi.runAllTimers())
    expect(screen.getByRole('link', { name: /Revisar lições/ })).toHaveAttribute(
      'href',
      '/management/modules/rotinas-de-atendimento',
    )
  })
})

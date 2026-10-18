import { act, render, screen, within } from '@testing-library/react'
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
      generated: { lessons: 8, review_path: '/management/lesson_reviews/1' },
      manager,
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts the four-step assistant at sending the material', () => {
    render(<LearningModulesNew />)

    expect(screen.getByRole('heading', { name: 'Novo conteúdo' })).toBeInTheDocument()
    expect(
      screen.getByText('O treinamento que hoje é repassado de pessoa para pessoa — envie uma vez.'),
    ).toBeInTheDocument()
    const steps = within(screen.getByRole('list', { name: 'Etapas' }))
    expect(steps.getAllByRole('listitem')).toHaveLength(4)
    expect(steps.getByText('Enviar o material').closest('li')).toHaveAttribute('aria-current', 'step')
  })

  it('offers the manual editor as a secondary path', () => {
    render(<LearningModulesNew />)

    expect(screen.getByRole('link', { name: 'Prefiro escrever manualmente' })).toHaveAttribute(
      'href',
      '/management/modules/new?mode=manual&journey=onboarding-atendimento',
    )
  })

  it('needs a name and a file before creating the lessons', async () => {
    render(<LearningModulesNew />)

    expect(screen.getByRole('button', { name: /Criar lições com IA/ })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: /Usar o arquivo de exemplo/ }))

    expect(screen.getByText('Manual de SAC.pdf')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do conteúdo')).toHaveValue('Rotinas de atendimento')
    expect(screen.getByRole('button', { name: /Criar lições com IA/ })).toBeEnabled()

    await userEvent.clear(screen.getByLabelText('Nome do conteúdo'))
    expect(screen.getByRole('button', { name: /Criar lições com IA/ })).toBeDisabled()
  })

  it('shows the AI working and then sends the reviewer to the lessons', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<LearningModulesNew />)

    await userEvent.click(screen.getByRole('button', { name: /Usar o arquivo de exemplo/ }))
    await userEvent.click(screen.getByRole('button', { name: /Criar lições com IA/ }))
    expect(screen.getByRole('status')).toHaveTextContent('A IA está criando 8 lições…')
    expect(screen.getByText('A IA cria as lições').closest('li')).toHaveAttribute('aria-current', 'step')

    act(() => vi.runAllTimers())
    expect(screen.getByRole('link', { name: /Revisar lições/ })).toHaveAttribute(
      'href',
      '/management/lesson_reviews/1',
    )
  })
})

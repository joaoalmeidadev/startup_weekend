import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { manager } from '@/test/managementFixtures'
import { page, router } from '@/test/inertiaMock'
import LearningModulesNew from './new'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const journey = { id: 'onboarding-atendimento', name: 'Onboarding Atendimento' }

function renderForm(props: { journey?: typeof journey | null } = {}) {
  page.props = {
    journey: props.journey ?? null,
    generated: { lessons: 8, review_path: '/management/lesson_reviews/1' },
    competencies: ['Comunicação clara', 'Rotinas da Distribuidora'],
    manager,
  }
  render(<LearningModulesNew />)
}

const writeLessons = () => userEvent.click(screen.getByRole('radio', { name: /Escrever as lições/ }))
const typeName = (name: string) => userEvent.type(screen.getByLabelText('Nome do conteúdo'), name)

describe('LearningModulesNew', () => {
  beforeEach(() => {
    page.url = '/management/modules/new'
    router.visit.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is a single form that goes back to the library', () => {
    renderForm()

    expect(screen.getByRole('heading', { name: 'Novo conteúdo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar para Biblioteca' })).toHaveAttribute(
      'href',
      '/management/library',
    )
    expect(screen.queryByRole('list', { name: 'Etapas' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Conteúdo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'De onde vem' })).toBeInTheDocument()
  })

  it('goes back to the journey it was opened from', () => {
    renderForm({ journey })

    expect(screen.getByRole('link', { name: 'Voltar para Onboarding Atendimento' })).toHaveAttribute(
      'href',
      '/management/journeys/onboarding-atendimento',
    )
  })

  it('reminds that Nivela products already come ready in the library', () => {
    renderForm()

    expect(screen.getByText(/Produtos Nivela já vêm prontos na Biblioteca/)).toBeInTheDocument()
  })

  it('offers the library competencies', () => {
    renderForm()

    const select = within(screen.getByLabelText('Competência'))
    expect(select.getByRole('option', { name: 'Rotinas da Distribuidora' })).toBeInTheDocument()
    expect(select.getByRole('option', { name: 'Comunicação clara' })).toBeInTheDocument()
  })

  it('starts by sending a file to the AI, which needs a name and a file', async () => {
    renderForm()

    expect(screen.getByRole('radio', { name: /Enviar arquivo/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: /Gerado por IA/ })).toBeChecked()
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
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: /Usar o arquivo de exemplo/ }))
    await userEvent.click(screen.getByRole('button', { name: /Criar lições com IA/ }))
    expect(screen.getByRole('status')).toHaveTextContent('A IA está criando 8 lições…')

    act(() => vi.runAllTimers())
    expect(screen.getByText('8 lições criadas!')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Revisar lições/ })).toHaveAttribute(
      'href',
      '/management/lesson_reviews/1',
    )
  })

  it('writing the lessons picks the company origin and adds lessons', async () => {
    renderForm()

    await writeLessons()
    expect(screen.getByRole('radio', { name: /Produto da empresa/ })).toBeChecked()
    expect(screen.queryByRole('button', { name: /Usar o arquivo de exemplo/ })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Adicionar lição/ }))
    expect(screen.getByLabelText('Título da lição 2')).toBeInTheDocument()
  })

  it('saves written lessons in the library once there is a name and a lesson title', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    renderForm()
    await writeLessons()

    const save = screen.getByRole('button', { name: /Salvar na Biblioteca/ })
    await typeName('Trocas')
    expect(save).toBeDisabled()
    await userEvent.type(screen.getByLabelText('Título da lição 1'), 'Quando aceitar a troca')
    await userEvent.click(save)

    expect(screen.getByRole('status')).toHaveTextContent('Conteúdo salvo na Biblioteca (simulação).')
    act(() => vi.runAllTimers())
    expect(router.visit).toHaveBeenCalledWith('/management/library')
  })

  it('goes back to the journey after saving when opened from one', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    renderForm({ journey })
    await writeLessons()

    await typeName('Trocas')
    await userEvent.type(screen.getByLabelText('Título da lição 1'), 'Quando aceitar a troca')
    await userEvent.click(screen.getByRole('button', { name: /Salvar na Biblioteca/ }))

    act(() => vi.runAllTimers())
    expect(router.visit).toHaveBeenCalledWith('/management/journeys/onboarding-atendimento')
  })

  it('lets the manager keep a sent file as a company product', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('radio', { name: /Produto da empresa/ }))
    await typeName('Trocas')
    expect(screen.getByRole('button', { name: /Salvar na Biblioteca/ })).toBeDisabled()

    await userEvent.upload(
      screen.getByLabelText('Arquivo do conteúdo'),
      new File(['x'], 'Política.pdf', { type: 'application/pdf' }),
    )
    expect(screen.getByRole('button', { name: /Salvar na Biblioteca/ })).toBeEnabled()
  })

  it('explains that the AI needs a file when the lessons are written', async () => {
    renderForm()
    await writeLessons()

    await userEvent.click(screen.getByRole('radio', { name: /Gerado por IA/ }))
    await typeName('Trocas')
    await userEvent.type(screen.getByLabelText('Título da lição 1'), 'Quando aceitar a troca')

    expect(screen.getByRole('button', { name: /Criar lições com IA/ })).toBeDisabled()
    expect(screen.getByText('A IA precisa de um arquivo para criar as lições.')).toBeInTheDocument()
  })
})

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { learningModule, manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import LearningModulesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('LearningModulesShow', () => {
  beforeEach(() => {
    page.url = '/management/modules/rotinas-de-atendimento'
    page.props = { learning_module: learningModule, manager }
  })

  it('shows the origin of the module and the material it came from', () => {
    render(<LearningModulesShow />)

    expect(screen.getByText('Gerado por IA')).toBeInTheDocument()
    expect(screen.getByText('Manual de SAC.pdf')).toBeInTheDocument()
  })

  it('tells the in-person training it replaces and who would give it', () => {
    render(<LearningModulesShow />)

    expect(screen.getByText('Substitui 6 h de treino com quem ganha R$ 25/h')).toBeInTheDocument()
  })

  it('says when the training uses the default value', () => {
    page.props = {
      ...page.props,
      learning_module: {
        ...learningModule,
        training: { hours: 3, teacher_hourly: 20, default_teacher: true },
      },
    }
    render(<LearningModulesShow />)

    expect(screen.getByText('Substitui 3 h de treino com o valor padrão (R$ 20/h)')).toBeInTheDocument()
  })

  it('sends the reviewer to the first pending lesson', () => {
    render(<LearningModulesShow />)

    expect(screen.getByRole('link', { name: /Revisar lições/ })).toHaveAttribute(
      'href',
      '/management/lesson_reviews/2',
    )
    expect(screen.getByText('1 lições esperando sua revisão')).toBeInTheDocument()
  })

  const lessonItem = (title: RegExp) => screen.getByRole('button', { name: title })

  it('opens each lesson with its text, the answer key and how much of the team gets it right', async () => {
    render(<LearningModulesShow />)

    const first = lessonItem(/Boas-vindas/)
    expect(first).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(first)

    expect(first).toHaveAttribute('aria-expanded', 'true')
    const panel = within(screen.getByRole('region', { name: 'Lição 1: Boas-vindas' }))
    expect(panel.getByText('Rotina do SAC, passo 1.')).toBeInTheDocument()
    expect(panel.getByText('Qual é o primeiro passo ao atender um cliente?')).toBeInTheDocument()
    const right = panel.getByText('Cumprimentar, dizer o nome e ouvir até o fim').closest('li') as HTMLElement
    expect(right).toHaveTextContent('Correta')
    expect(panel.getByText('Ouvir primeiro deixa o cliente mais calmo.')).toBeInTheDocument()
    expect(panel.getByText('92% da equipe acerta de primeira')).toBeInTheDocument()
  })

  it('links the lessons still under review to their review', async () => {
    render(<LearningModulesShow />)

    await userEvent.click(lessonItem(/Como acolher/))

    const panel = within(screen.getByRole('region', { name: 'Lição 2: Como acolher' }))
    expect(panel.getByText('Ainda sem respostas: a lição não foi publicada.')).toBeInTheDocument()
    expect(panel.getByRole('link', { name: 'Revisar lição 2' })).toHaveAttribute(
      'href',
      '/management/lesson_reviews/2',
    )
  })

  it('has no review links once the module is published', async () => {
    page.props = {
      learning_module: { ...learningModule, status: 'published', review_from: null },
      manager,
    }
    render(<LearningModulesShow />)

    expect(screen.queryByRole('link', { name: /Revisar lições/ })).not.toBeInTheDocument()
    await userEvent.click(lessonItem(/Como acolher/))
    expect(screen.queryByRole('link', { name: /Revisar lição/ })).not.toBeInTheDocument()
  })

  it('tells the final assessment draws from the lessons and the team average', () => {
    page.props = {
      learning_module: { ...learningModule, assessment: { questions: 10, team_average: 80 } },
      manager,
    }
    render(<LearningModulesShow />)

    expect(
      screen.getByText('10 perguntas sorteadas das lições ao lado — o gabarito está em cada lição.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Média da equipe: 80% de acerto')).toBeInTheDocument()
  })

  it('presents itself as a library content, with no stretch', () => {
    render(<LearningModulesShow />)

    expect(screen.getByText('Conteúdo da Biblioteca')).toBeInTheDocument()
    expect(screen.queryByText(/Trecho/)).not.toBeInTheDocument()
  })
})

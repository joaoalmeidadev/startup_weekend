import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { learner, viewer } from '@/test/collaboratorFixtures'
import { page } from '@/test/inertiaMock'
import JourneysIndex from './index'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const section = (name: string) => screen.getByRole('region', { name })

describe('JourneysIndex', () => {
  beforeEach(() => {
    page.url = '/collaborator/journeys'
    page.props = { learner, viewer }
  })

  it('explains once that there is one journey at a time', () => {
    render(<JourneysIndex />)

    expect(screen.getByText('Faça uma jornada por vez. Você escolhe a ordem.')).toBeInTheDocument()
  })

  it('shows the active journey as a path of steps with their points and the badge at the end', () => {
    render(<JourneysIndex />)

    const active = section('Em andamento')
    expect(within(active).getByRole('heading', { name: 'Jeito Distribuidora Sul' })).toBeInTheDocument()
    const steps = within(active).getAllByRole('listitem')
    expect(steps.map((step) => step.dataset.status)).toEqual(['done', 'current'])
    expect(within(steps[0]).getByText('+8 pts')).toBeInTheDocument()
    expect(within(steps[1]).getByText('+23 pts')).toBeInTheDocument()
    expect(within(steps[1]).getByRole('link', { name: /Continuar/ })).toHaveAttribute(
      'href',
      '/collaborator/lessons/rotinas-da-distribuidora',
    )
    expect(within(active).getByText('Selo: Jeito Distribuidora Sul')).toBeInTheDocument()
  })

  it('lists the queued journeys with their steps and how many points they are worth', () => {
    render(<JourneysIndex />)

    const queue = section('Na fila')
    expect(within(queue).getByText('Atendimento na prática')).toBeInTheDocument()
    expect(within(queue).getByText('2 etapas')).toBeInTheDocument()
    expect(within(queue).getByText('até +34 pts')).toBeInTheDocument()
  })

  it('lists the finished journeys with the points earned', () => {
    render(<JourneysIndex />)

    const finished = section('Concluídas')
    expect(within(finished).getByText('Base Nivela')).toBeInTheDocument()
    expect(within(finished).getByText('+22 pts ganhos')).toBeInTheDocument()
  })

  it('starts a queued journey and sends the active one back to the queue', async () => {
    render(<JourneysIndex />)

    await userEvent.click(within(section('Na fila')).getByRole('button', { name: 'Começar esta' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Agora você está em Atendimento na prática (simulação).',
    )
    expect(
      within(section('Em andamento')).getByRole('heading', { name: 'Atendimento na prática' }),
    ).toBeInTheDocument()
    const queue = section('Na fila')
    expect(within(queue).getByText('Jeito Distribuidora Sul')).toBeInTheDocument()
    expect(within(queue).getByText('até +23 pts')).toBeInTheDocument()
  })

  it('only opens a lesson where there is one ready, and warns on the others', async () => {
    render(<JourneysIndex />)
    await userEvent.click(within(section('Na fila')).getByRole('button', { name: 'Começar esta' }))

    const active = section('Em andamento')
    expect(within(active).queryByRole('link', { name: /Continuar/ })).not.toBeInTheDocument()
    await userEvent.click(within(active).getByRole('button', { name: /Continuar/ }))
    expect(screen.getByRole('status')).toHaveTextContent('Esta etapa abre em breve (simulação).')
  })

  it('tells her when no journey has reached her yet', () => {
    page.props = { learner: { ...learner, journeys: [], next_step: null }, viewer }
    render(<JourneysIndex />)

    expect(screen.getByText('Sua empresa ainda vai liberar sua primeira jornada.')).toBeInTheDocument()
  })
})

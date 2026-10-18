import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { learner, viewer } from '@/test/collaboratorFixtures'
import { page } from '@/test/inertiaMock'
import HomesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('HomesShow', () => {
  beforeEach(() => {
    page.url = '/collaborator/home'
    page.props = { learner, viewer }
  })

  it('greets the collaborator by her first name', () => {
    render(<HomesShow />)

    expect(screen.getByRole('heading', { level: 1, name: 'Olá, Maria!' })).toBeInTheDocument()
  })

  it('shows her points, what she can spend and the way to the rewards', () => {
    render(<HomesShow />)

    const points = screen.getByRole('region', { name: 'Seus pontos' })
    expect(within(points).getByText('38 pts')).toBeInTheDocument()
    expect(within(points).getByText('13 pts para usar em prêmios')).toBeInTheDocument()
    expect(within(points).getByRole('link', { name: /Ver prêmios/ })).toHaveAttribute(
      'href',
      '/collaborator/rewards',
    )
  })

  it('shows the streak of days in a row', () => {
    render(<HomesShow />)

    const points = screen.getByRole('region', { name: 'Seus pontos' })
    expect(within(points).getByText('3 dias seguidos')).toBeInTheDocument()
  })

  it('points to the next step, what it is worth and how to continue', () => {
    render(<HomesShow />)

    const next = screen.getByRole('region', { name: 'Sua próxima etapa' })
    expect(within(next).getByText('Jeito Distribuidora Sul')).toBeInTheDocument()
    expect(within(next).getByText('Rotinas de atendimento')).toBeInTheDocument()
    expect(within(next).getByText('+23 pts')).toBeInTheDocument()
    expect(within(next).getByRole('link', { name: /Continuar/ })).toHaveAttribute(
      'href',
      '/collaborator/lessons/rotinas-da-distribuidora',
    )
  })

  it('lists each journey with its status, steps done and points', () => {
    render(<HomesShow />)

    const list = screen.getByRole('region', { name: 'Minhas jornadas' })
    const rows = within(list).getAllByRole('listitem')
    expect(rows).toHaveLength(3)
    expect(within(rows[0]).getByText('Concluída')).toBeInTheDocument()
    expect(within(rows[0]).getByText('22 de 22 pts')).toBeInTheDocument()
    expect(within(rows[1]).getByText('Em andamento')).toBeInTheDocument()
    expect(within(rows[1]).getByText('8 de 31 pts')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Na fila')).toBeInTheDocument()

    const bar = within(rows[1]).getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '1')
    expect(bar).toHaveAttribute('aria-valuemax', '2')
  })

  it('shows the badges, earned and still locked', () => {
    render(<HomesShow />)

    const badges = screen.getByRole('region', { name: 'Meus selos' })
    expect(within(badges).getByText('3 de 4')).toBeInTheDocument()
    expect(within(badges).getByText('Nivelado em Atendimento').closest('li')).toHaveAttribute(
      'data-earned',
      'false',
    )
  })

  it('hides the next step when there is nothing left to do', () => {
    page.props = { learner: { ...learner, next_step: null }, viewer }
    render(<HomesShow />)

    expect(screen.queryByRole('region', { name: 'Sua próxima etapa' })).not.toBeInTheDocument()
  })
  it('tells her when no journey has reached her yet', () => {
    page.props = { learner: { ...learner, journeys: [], next_step: null }, viewer }
    render(<HomesShow />)

    expect(screen.getByText('Sua empresa ainda vai liberar sua primeira jornada.')).toBeInTheDocument()
  })
})

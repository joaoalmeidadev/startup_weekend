import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, teamDashboard } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import TeamsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('TeamsShow', () => {
  beforeEach(() => {
    page.url = '/management/team'
    page.props = { dashboard: teamDashboard, manager }
  })

  it('leads with the share of the team that is leveled', () => {
    render(<TeamsShow />)

    expect(screen.getByText('57%', { selector: 'span' })).toBeInTheDocument()
    expect(screen.getByText('8 de 14 pessoas com o selo')).toBeInTheDocument()
    expect(screen.getByText('38 dias')).toBeInTheDocument()
  })

  it('filters by period from a single row above the metrics', () => {
    render(<TeamsShow />)

    const periods = within(screen.getByRole('navigation', { name: 'Período' }))
    expect(periods.getByRole('link', { name: 'Últimos 6 meses' })).toHaveAttribute('aria-current', 'page')
    expect(periods.getByRole('link', { name: 'Últimos 30 dias' })).toHaveAttribute(
      'href',
      '/management/team?period=30d',
    )
    expect(screen.getByText(/\+43 p\.p\. em 6 meses/)).toBeInTheDocument()
  })

  it('shows the value of a month on hover or focus', () => {
    render(<TeamsShow />)

    fireEvent.focus(screen.getByLabelText('set: 45%'))

    expect(screen.getByRole('tooltip')).toHaveTextContent('45%set')
  })

  it('tells how far each competency is from the goal', () => {
    render(<TeamsShow />)

    fireEvent.focus(screen.getByText('Reclamações de Entrega').closest('li') as HTMLElement)

    expect(screen.getByRole('tooltip')).toHaveTextContent('-14 pts abaixo da meta')
  })

  it('offers every chart as a table', async () => {
    render(<TeamsShow />)

    const card = screen.getByRole('heading', { name: 'Funil da jornada' }).closest('section') as HTMLElement
    await userEvent.click(within(card).getByRole('button', { name: /Ver tabela/ }))

    expect(within(card).getByRole('table')).toHaveTextContent('Nivelados (selo)857%')
  })

  it('switches the header to the manager view', () => {
    render(<TeamsShow />)

    const views = within(screen.getByRole('navigation', { name: 'Visão' }))
    expect(views.getByRole('link', { name: 'Gestor' })).toHaveAttribute('aria-current', 'page')
    expect(
      within(screen.getByRole('navigation', { name: 'Gestão' })).getByRole('link', { name: /Minha equipe/ }),
    ).toHaveAttribute('href', '/management/people?team=1')
  })
})

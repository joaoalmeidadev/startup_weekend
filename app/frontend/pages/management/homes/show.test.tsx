import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { dashboard, manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import HomesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('HomesShow', () => {
  beforeEach(() => {
    page.url = '/management'
    page.props = { dashboard, manager }
  })

  it('leads with the share of the team that is leveled', () => {
    render(<HomesShow />)

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('57%', { selector: 'span' })).toBeInTheDocument()
    expect(screen.getByText('8 de 14 pessoas com o selo')).toBeInTheDocument()
    expect(screen.getByText('38 dias')).toBeInTheDocument()
  })

  it('filters by period from a single row above the metrics', () => {
    render(<HomesShow />)

    const periods = within(screen.getByRole('navigation', { name: 'Período' }))
    expect(periods.getByRole('link', { name: 'Últimos 6 meses' })).toHaveAttribute('aria-current', 'page')
    expect(periods.getByRole('link', { name: 'Últimos 30 dias' })).toHaveAttribute(
      'href',
      '/management?period=30d',
    )
    expect(screen.getByText(/\+43 p\.p\. em 6 meses/)).toBeInTheDocument()
  })

  it('shows the value of a month on hover or focus', () => {
    render(<HomesShow />)

    fireEvent.focus(screen.getByLabelText('set: 45%'))

    expect(screen.getByRole('tooltip')).toHaveTextContent('45%set')
  })

  it('tells how far each competency is from the goal', () => {
    render(<HomesShow />)

    fireEvent.focus(screen.getByText('Reclamações de Entrega').closest('li') as HTMLElement)

    expect(screen.getByRole('tooltip')).toHaveTextContent('-14 pts abaixo da meta')
  })

  it('offers every chart as a table', async () => {
    render(<HomesShow />)

    const card = screen.getByRole('heading', { name: 'Funil da jornada' }).closest('section') as HTMLElement
    await userEvent.click(within(card).getByRole('button', { name: /Ver tabela/ }))

    expect(within(card).getByRole('table')).toHaveTextContent('Nivelados (selo)857%')
  })

  it('turns each attention item into a shortcut', () => {
    render(<HomesShow />)

    expect(screen.getByRole('heading', { name: 'Precisa da sua atenção' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Revisar/ })).toHaveAttribute(
      'href',
      '/management/lesson_reviews',
    )
  })

  it('downloads the people report', () => {
    render(<HomesShow />)

    expect(screen.getByRole('link', { name: /Exportar relatório/ })).toHaveAttribute(
      'href',
      '/management/people.csv',
    )
  })

  it('no longer asks to configure the company', () => {
    render(<HomesShow />)

    expect(screen.queryByText(/Configure sua empresa/)).not.toBeInTheDocument()
  })

  it('shows a single admin navigation with Dashboard current, even with a period', () => {
    page.url = '/management?period=30d'
    render(<HomesShow />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'dashboardDashboard',
      'groupPessoas',
      'library_booksBiblioteca',
      'routeJornadas',
      'tuneMeta do setor',
      'redeemRecompensas',
    ])
    expect(nav.getByRole('link', { name: /Dashboard/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('navigation', { name: 'Visão' })).not.toBeInTheDocument()
    expect(screen.getByText('Ana Lima')).toBeInTheDocument()
    expect(screen.getByText('Administradora')).toBeInTheDocument()
  })
})

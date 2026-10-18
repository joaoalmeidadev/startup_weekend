import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { teamDashboard as dashboard, manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import HomesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('HomesShow', () => {
  beforeEach(() => {
    page.url = '/management'
    page.props = { dashboard, manager }
  })

  it('leads with three numbers that prove the team is learning', () => {
    render(<HomesShow />)

    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument()
    const learned = within(screen.getByRole('region', { name: 'Aprenderam' }))
    expect(learned.getByText('48 → 79')).toBeInTheDocument()
    expect(learned.getByText('+31 pts desde o diagnóstico')).toBeInTheDocument()
    const faster = within(screen.getByRole('region', { name: 'Mais rápido' }))
    expect(faster.getByText('46 dias')).toBeInTheDocument()
    expect(faster.getByText(/antes: ~90 dias no repasse · 2× mais rápido/)).toBeInTheDocument()
    const saved = within(screen.getByRole('region', { name: 'Repasse economizado' }))
    expect(saved.getByText('207 h')).toBeInTheDocument()
    expect(saved.getByText(/R\$ 8,3 mil/)).toBeInTheDocument()
    expect(saved.getByText(/9 novatos sem repasse do veterano · estimativa/)).toBeInTheDocument()
  })

  it('shows that what is learned sticks and how the team keeps studying', () => {
    render(<HomesShow />)

    const sticks = within(screen.getByRole('region', { name: 'O que aprendem fica' }))
    expect(sticks.getByText('86%')).toBeInTheDocument()
    expect(sticks.getByText('9 de 14')).toBeInTheDocument()
    expect(sticks.getByText('5 min')).toBeInTheDocument()
  })

  it('shows the on-the-job change as the manager reported it', () => {
    render(<HomesShow />)

    const practice = within(screen.getByRole('region', { name: 'Na prática' }))
    expect(practice.getByText('Avaliação do gestor aos 30 dias')).toBeInTheDocument()
    const rework = practice.getByText('Retrabalho por novato').closest('li') as HTMLElement
    expect(rework).toHaveTextContent('2,6 → 1,6 por mês')
    expect(rework).toHaveTextContent('−38%')
  })

  it('has no to-do list nor funnel', () => {
    render(<HomesShow />)

    expect(screen.queryByText('Precisa da sua atenção')).not.toBeInTheDocument()
    expect(screen.queryByText('Funil da jornada')).not.toBeInTheDocument()
  })

  it('filters by period from a single row above the metrics', () => {
    render(<HomesShow />)

    const periods = within(screen.getByRole('navigation', { name: 'Período' }))
    expect(periods.getByRole('link', { name: 'Últimos 6 meses' })).toHaveAttribute('aria-current', 'page')
    expect(periods.getByRole('link', { name: 'Últimos 30 dias' })).toHaveAttribute(
      'href',
      '/management?period=30d',
    )
    expect(screen.getByText(/57% da equipe nivelada · \+43 p\.p\. em 6 meses/)).toBeInTheDocument()
  })

  it('shows the value of a month on hover or focus', () => {
    render(<HomesShow />)

    fireEvent.focus(screen.getByLabelText('set: 45%'))

    expect(screen.getByRole('tooltip')).toHaveTextContent('45%set')
  })

  it('tells how much each competency grew since the diagnostic', () => {
    render(<HomesShow />)

    const row = screen.getByText('Reclamações').closest('li') as HTMLElement
    expect(row).toHaveTextContent('42 → 71')
    fireEvent.focus(row)

    expect(screen.getByRole('tooltip')).toHaveTextContent('+29 pts desde o diagnóstico')
  })

  it('offers the before and after as a table', async () => {
    render(<HomesShow />)

    const card = screen
      .getByRole('heading', { name: 'Antes × depois por competência' })
      .closest('section') as HTMLElement
    await userEvent.click(within(card).getByRole('button', { name: /Ver tabela/ }))

    expect(within(card).getByRole('table')).toHaveTextContent('Reclamações427175')
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
      'routeJornadas',
      'groupsSetores',
      'library_booksBiblioteca',
      'redeemRecompensas',
    ])
    expect(nav.getByRole('link', { name: /Dashboard/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('navigation', { name: 'Visão' })).not.toBeInTheDocument()
    expect(screen.getByText('Ana Lima')).toBeInTheDocument()
    expect(screen.getByText('Administradora')).toBeInTheDocument()
  })
})

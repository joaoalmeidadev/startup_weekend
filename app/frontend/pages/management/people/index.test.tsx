import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, peopleProps } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import PeopleIndex from './index'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const row = (name: string) => screen.getByRole('link', { name: new RegExp(name) })
const names = () =>
  screen.queryAllByRole('link', { name: /Atendimento|Logística/ }).map((link) => link.textContent)

describe('PeopleIndex', () => {
  beforeEach(() => {
    page.url = '/management/people'
    page.props = { ...peopleProps, manager }
  })

  it('shows the three big numbers', () => {
    render(<PeopleIndex />)

    const summary = screen.getByRole('region', { name: 'Resumo' })
    expect(within(summary).getByText('Nivelados').previousSibling).toHaveTextContent('1')
    expect(within(summary).getByText('No ritmo')).toBeInTheDocument()
    expect(within(summary).getByText('Atrasados')).toBeInTheDocument()
  })

  it('shows one row per person with progress, score against goal, activity and forecast', () => {
    render(<PeopleIndex />)

    const maria = row('Maria Souza')
    expect(maria).toHaveAttribute('href', '/management/people/maria-souza')
    expect(within(maria).getByText('Módulo atual: Rotinas de atendimento')).toBeInTheDocument()
    expect(within(maria).getByText('68 / meta 75')).toBeInTheDocument()
    expect(within(maria).getByText('abaixo da meta')).toBeInTheDocument()
    expect(within(maria).getByText('há 2 dias · 35 min nesta semana')).toBeInTheDocument()
    expect(within(maria).getByText('Nivela em ~12 dias')).toBeInTheDocument()
  })

  it('tells when the score reaches the goal and when the sector has no goal', () => {
    render(<PeopleIndex />)

    expect(within(row('Diego Fernandes')).getByText('na meta')).toBeInTheDocument()
    expect(within(row('Diego Fernandes')).getByText('Jornada concluída')).toBeInTheDocument()
    expect(within(row('Marcos Oliveira')).getByText('41 pts')).toBeInTheDocument()
    expect(within(row('Marcos Oliveira')).getByText('setor sem meta')).toBeInTheDocument()
  })

  it('shows initials when there is no photo', () => {
    render(<PeopleIndex />)

    expect(within(row('Diego Fernandes')).getByText('DF')).toBeInTheDocument()
  })

  it('filters by sector', async () => {
    render(<PeopleIndex />)

    await userEvent.click(screen.getByRole('button', { name: 'Logística (1)' }))

    expect(names()).toHaveLength(1)
    expect(row('Marcos Oliveira')).toBeInTheDocument()
  })

  it('filters by status', async () => {
    render(<PeopleIndex />)

    await userEvent.click(screen.getByRole('button', { name: 'Atrasados' }))

    expect(names()).toHaveLength(1)
    expect(row('Marcos Oliveira')).toBeInTheDocument()
  })

  it('searches by name and shows the empty state when nobody matches', async () => {
    render(<PeopleIndex />)

    await userEvent.type(screen.getByLabelText('Buscar por nome'), 'maria')
    expect(names()).toHaveLength(1)

    await userEvent.type(screen.getByLabelText('Buscar por nome'), 'xyz')
    expect(screen.getByText('Ninguém encontrado')).toBeInTheDocument()
  })

  it('exports the list as CSV', () => {
    render(<PeopleIndex />)

    expect(screen.getByRole('link', { name: /Exportar CSV/ })).toHaveAttribute(
      'href',
      '/management/people.csv',
    )
  })

  it('invites people by e-mail (simulated)', async () => {
    render(<PeopleIndex />)

    await userEvent.click(screen.getByRole('button', { name: /Convidar pessoas/ }))
    await userEvent.click(screen.getByRole('button', { name: /Por e-mail/ }))
    await userEvent.type(screen.getByLabelText('E-mails (um por linha)'), 'joana@sul.com')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar convites' }))

    expect(screen.getByRole('status')).toHaveTextContent('Convites enviados (simulação).')
  })

  it('highlights Pessoas in the navigation', () => {
    render(<PeopleIndex />)

    expect(screen.getByRole('link', { name: /^Pessoas/ })).toHaveAttribute('aria-current', 'page')
  })
})

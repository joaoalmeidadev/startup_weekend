import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, peopleProps } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import PeopleIndex from './index'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('PeopleIndex', () => {
  beforeEach(() => {
    page.url = '/management/people'
    page.props = { ...peopleProps, manager }
  })

  it('filters people by sector', async () => {
    render(<PeopleIndex />)

    await userEvent.click(screen.getByRole('button', { name: 'Logística (12)' }))

    expect(screen.getByRole('heading', { name: 'Marcos Oliveira' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Maria Souza' })).not.toBeInTheDocument()
  })

  it('searches by name and shows the empty state when nobody matches', async () => {
    render(<PeopleIndex />)

    await userEvent.type(screen.getByLabelText('Buscar por nome ou setor'), 'maria')
    expect(screen.getByRole('heading', { name: 'Maria Souza' })).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Buscar por nome ou setor'), 'xyz')
    expect(screen.getByText('Nenhum colaborador encontrado')).toBeInTheDocument()
  })

  it('opens the detail of each person', () => {
    render(<PeopleIndex />)

    expect(screen.getAllByRole('link', { name: /Ver detalhes/ })[0]).toHaveAttribute(
      'href',
      '/management/people/marcos-oliveira',
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

    expect(screen.getByRole('link', { name: /Pessoas/ })).toHaveAttribute('aria-current', 'page')
  })
})

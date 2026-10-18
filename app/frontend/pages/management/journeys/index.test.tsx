import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { journeySummaries, manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import JourneysIndex from './index'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('JourneysIndex', () => {
  beforeEach(() => {
    page.url = '/management/journeys'
    page.props = { journeys: journeySummaries, manager }
  })

  it('links each journey card to its detail', () => {
    render(<JourneysIndex />)

    expect(screen.getByRole('link', { name: /Onboarding Atendimento/ })).toHaveAttribute(
      'href',
      '/management/journeys/onboarding-atendimento',
    )
    expect(screen.getByText('Ninguém começou ainda')).toBeInTheDocument()
  })

  it('is only about journeys, pointing to the Biblioteca for the modules', () => {
    render(<JourneysIndex />)

    const main = within(screen.getByRole('main'))
    expect(main.getByRole('heading', { level: 1, name: 'Jornadas' })).toBeInTheDocument()
    expect(main.queryByRole('link', { name: /Novo conteúdo/ })).not.toBeInTheDocument()
    expect(main.queryByRole('region', { name: 'Módulos' })).not.toBeInTheDocument()
    expect(main.getByRole('link', { name: /Ver a Biblioteca/ })).toHaveAttribute(
      'href',
      '/management/library',
    )
  })

  it('is the second step of the content path', () => {
    render(<JourneysIndex />)

    const pipeline = within(screen.getByRole('navigation', { name: 'Caminho do conteúdo' }))
    expect(pipeline.getByRole('link', { name: 'Jornadas' })).toHaveAttribute('aria-current', 'step')
    expect(pipeline.getByRole('link', { name: 'Biblioteca' })).toHaveAttribute('href', '/management/library')
    expect(pipeline.getByText('Colaborador')).toBeInTheDocument()
  })

  it('explains the three stretches as plain text, not as buttons', () => {
    render(<JourneysIndex />)

    const guide = screen.getByText(/Toda jornada segue 3 trechos/)
    expect(guide.tagName).toBe('P')
    expect(guide).toHaveTextContent(/Base.*→.*Empresa.*→.*Setor/)
    expect(screen.queryByRole('button', { name: /Base/ })).not.toBeInTheDocument()
  })

  it('keeps the journeys in their own section', () => {
    render(<JourneysIndex />)

    expect(
      within(screen.getByRole('region', { name: 'Jornadas' })).getAllByRole('link', {
        name: /Abrir jornada/,
      }),
    ).toHaveLength(2)
  })

  it('leaves the sector goal to its own tab', () => {
    render(<JourneysIndex />)

    expect(
      within(screen.getByRole('main')).queryByRole('link', { name: /Meta do setor/ }),
    ).not.toBeInTheDocument()
  })

  it('keeps Jornadas active in the navigation', () => {
    render(<JourneysIndex />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Jornadas/ })).toHaveAttribute('aria-current', 'page')
  })
})

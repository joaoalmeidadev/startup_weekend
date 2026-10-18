import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { audienceOptions, journeySummaries, manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import JourneysIndex from './index'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('JourneysIndex', () => {
  beforeEach(() => {
    page.url = '/management/journeys'
    page.props = { journeys: journeySummaries, audience_options: audienceOptions, manager }
  })

  it('links each journey card to its detail', () => {
    render(<JourneysIndex />)

    expect(screen.getByRole('link', { name: /Atendimento na prática/ })).toHaveAttribute(
      'href',
      '/management/journeys/atendimento-na-pratica',
    )
    expect(screen.getByText('Ninguém começou ainda')).toBeInTheDocument()
  })

  it('starts a new journey', () => {
    render(<JourneysIndex />)

    expect(screen.getByRole('link', { name: /Nova jornada/ })).toHaveAttribute(
      'href',
      '/management/journeys/new',
    )
  })

  it('shows the kind, who receives and how many contents each journey has', () => {
    render(<JourneysIndex />)

    const sector = within(screen.getByRole('link', { name: /Atendimento na prática/ }))
    expect(sector.getByText('Jornada Setor')).toBeInTheDocument()
    expect(sector.getByText('Atendimento')).toBeInTheDocument()
    expect(sector.getByText('2 conteúdos')).toBeInTheDocument()
    const leader = within(screen.getByRole('link', { name: /Promoção para líder/ }))
    expect(leader.getByText('Staff · Grupo')).toBeInTheDocument()
    expect(leader.getByText('Jornada Empresa')).toBeInTheDocument()
    expect(within(screen.getByRole('link', { name: /Mentoria/ })).getByText('3 pessoas')).toBeInTheDocument()
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

  it('has no content path strip above the title', () => {
    render(<JourneysIndex />)

    expect(screen.queryByRole('navigation', { name: 'Caminho do conteúdo' })).not.toBeInTheDocument()
  })

  it('explains the three kinds of journey as a plain legend, not as buttons', () => {
    render(<JourneysIndex />)

    const legend = within(screen.getByRole('list', { name: 'Tipos de jornada' }))
    expect(legend.getByText('Habilidades gerais que todo mundo precisa')).toBeInTheDocument()
    expect(legend.getByText('Cultura, processos e o jeito da empresa')).toBeInTheDocument()
    expect(legend.getByText('O dia a dia de um setor')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Base/ })).not.toBeInTheDocument()
  })

  it('keeps the journeys in their own section', () => {
    render(<JourneysIndex />)

    expect(
      within(screen.getByRole('region', { name: 'Jornadas' })).getAllByRole('link', {
        name: /Abrir jornada/,
      }),
    ).toHaveLength(3)
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

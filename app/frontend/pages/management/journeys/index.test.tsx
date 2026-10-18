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

  it('is the Conteúdos screen, starting a new content from the main button', () => {
    render(<JourneysIndex />)

    expect(screen.getByRole('heading', { level: 1, name: 'Conteúdos' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Novo conteúdo/ })).toHaveAttribute(
      'href',
      '/management/modules/new',
    )
    expect(screen.queryByRole('button', { name: /Nova jornada/ })).not.toBeInTheDocument()
  })

  it('keeps the guide to the three stretches', () => {
    render(<JourneysIndex />)

    expect(screen.getByText('1. Base')).toBeInTheDocument()
  })

  it('points to the sector goal set by the most experienced people', () => {
    render(<JourneysIndex />)

    const card = screen.getByRole('link', { name: /Meta do setor/ })
    expect(card).toHaveAttribute('href', '/management/sector_goal')
    expect(card).toHaveTextContent('A régua vem dos seus colaboradores mais experientes')
  })

  it('keeps Conteúdos active in the navigation', () => {
    render(<JourneysIndex />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Conteúdos/ })).toHaveAttribute('aria-current', 'page')
  })
})

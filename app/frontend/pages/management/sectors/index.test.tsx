import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, sectorSummaries } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import SectorsIndex from './index'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const card = (name: string) => within(screen.getByRole('link', { name: new RegExp(`^${name}`) }))

describe('SectorsIndex', () => {
  beforeEach(() => {
    page.url = '/management/sectors'
    page.props = { sectors: sectorSummaries, manager }
  })

  it('is the Setores tab of the navigation', () => {
    render(<SectorsIndex />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Setores/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { name: 'Setores', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Quem trabalha em cada setor e a meta de cada um.')).toBeInTheDocument()
  })

  it('creates a new sector', () => {
    render(<SectorsIndex />)

    expect(screen.getByRole('link', { name: /Novo setor/ })).toHaveAttribute(
      'href',
      '/management/sectors/new',
    )
  })

  it('links each sector to its page with people count and goal', () => {
    render(<SectorsIndex />)

    expect(screen.getByRole('link', { name: /^Atendimento/ })).toHaveAttribute(
      'href',
      '/management/sectors/atendimento',
    )
    expect(card('Atendimento').getByText('5 pessoas')).toBeInTheDocument()
    expect(card('Atendimento').getByText('Meta Médio · 75 pts')).toBeInTheDocument()
    expect(card('Logística').getByText('1 pessoa')).toBeInTheDocument()
    expect(card('Logística').getByText('Sem meta ainda')).toBeInTheDocument()
  })

  it('tags groups and shows a few faces', () => {
    render(<SectorsIndex />)

    expect(card('Staff').getByText('Grupo')).toBeInTheDocument()
    expect(card('Atendimento').queryByText('Grupo')).not.toBeInTheDocument()
    expect(card('Atendimento').getByText('DF')).toBeInTheDocument()
  })
})

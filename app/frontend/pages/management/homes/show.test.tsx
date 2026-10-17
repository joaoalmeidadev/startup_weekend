import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { home, manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import HomesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('HomesShow', () => {
  beforeEach(() => {
    page.url = '/management'
    page.props = { home, manager }
  })

  it('greets the manager with the team numbers', () => {
    render(<HomesShow />)

    expect(screen.getByRole('heading', { name: 'Olá, Ana!' })).toBeInTheDocument()
    expect(screen.getByText('62%')).toBeInTheDocument()
  })

  it('turns each attention item into a shortcut', () => {
    render(<HomesShow />)

    expect(screen.getByRole('link', { name: /Revisar/ })).toHaveAttribute(
      'href',
      '/management/modules/rotinas-de-atendimento',
    )
  })

  it('points to the unfinished company setup', () => {
    render(<HomesShow />)

    expect(screen.getByRole('link', { name: /Configure sua empresa/ })).toHaveAttribute(
      'href',
      '/management/setup',
    )
  })

  it('downloads the people report', () => {
    render(<HomesShow />)

    expect(screen.getByRole('link', { name: /Exportar relatório/ })).toHaveAttribute(
      'href',
      '/management/people.csv',
    )
  })

  it('marks Início as the current page', () => {
    render(<HomesShow />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Início/ })).toHaveAttribute('aria-current', 'page')
    expect(nav.getByRole('link', { name: /Pessoas/ })).not.toHaveAttribute('aria-current')
  })
})

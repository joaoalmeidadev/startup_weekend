import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { contentLibrary, journeySummaries, manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import JourneysIndex from './index'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('JourneysIndex', () => {
  beforeEach(() => {
    page.url = '/management/journeys'
    page.props = { journeys: journeySummaries, library: contentLibrary, manager }
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

  it('explains the three stretches as plain text, not as buttons', () => {
    render(<JourneysIndex />)

    const guide = screen.getByText(/Toda jornada segue 3 trechos/)
    expect(guide.tagName).toBe('P')
    expect(guide).toHaveTextContent(/Base.*→.*Empresa.*→.*Setor/)
    expect(screen.queryByRole('button', { name: /Base/ })).not.toBeInTheDocument()
  })

  it('shows how each origin reaches the collaborator', () => {
    render(<JourneysIndex />)

    const flows = within(screen.getByRole('region', { name: 'Como o conteúdo chega ao colaborador' }))
    const ai = within(flows.getByRole('list', { name: 'Caminho: Gerado por IA' }))
    expect(ai.getAllByRole('listitem').map((step) => step.textContent)).toEqual([
      'Material',
      'IA cria',
      'Você revisa',
      'Jornada',
      'Colaborador',
    ])
    expect(flows.getByRole('list', { name: 'Caminho: Produtos Nivela' })).toHaveTextContent(
      'Biblioteca Nivela',
    )
    expect(flows.getByRole('list', { name: 'Caminho: Produtos da empresa' })).toHaveTextContent(
      'Você escreve',
    )
  })

  it('lists the content library with origin, lessons and journeys using each module', () => {
    render(<JourneysIndex />)

    const library = within(screen.getByRole('region', { name: 'Biblioteca de conteúdos' }))
    const rotinas = library.getByRole('link', { name: /Rotinas/ })
    expect(rotinas).toHaveAttribute('href', '/management/modules/rotinas-de-atendimento')
    expect(rotinas).toHaveTextContent('Gerado por IA')
    expect(rotinas).toHaveTextContent('8 lições')
    expect(rotinas).toHaveTextContent('Em 1 jornada')
    expect(library.getByRole('link', { name: /Conversa Clara/ })).toHaveTextContent('Em 2 jornadas')
    expect(library.getByRole('link', { name: /Uso do Sistema/ })).toHaveTextContent('Em nenhuma jornada')
  })

  it('presents the Nivela products as a ready-made library for any sector', async () => {
    render(<JourneysIndex />)

    const ready = within(screen.getByRole('region', { name: 'Produtos Nivela' }))
    expect(
      ready.getByText(
        'Prontos para usar, mesmo que sua empresa ainda não tenha material. Feitos para qualquer setor.',
      ),
    ).toBeInTheDocument()
    expect(ready.getByText('2 módulos · 9 lições disponíveis')).toBeInTheDocument()

    await userEvent.click(ready.getByRole('button', { name: /Ver os produtos Nivela/ }))
    expect(screen.getByRole('button', { name: 'Produtos Nivela' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('highlights the skills the companies struggle with the most', () => {
    render(<JourneysIndex />)

    expect(screen.getByRole('link', { name: /Raciocínio Lógico/ })).toHaveTextContent(
      'Citado por 56% das empresas',
    )
  })

  it('filters the library by origin', async () => {
    render(<JourneysIndex />)

    const library = within(screen.getByRole('region', { name: 'Biblioteca de conteúdos' }))
    await userEvent.click(screen.getByRole('button', { name: 'Produtos da empresa' }))

    expect(screen.getByRole('button', { name: 'Produtos da empresa' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(library.getAllByRole('link').map((link) => link.textContent)).toEqual([
      expect.stringContaining('Uso do Sistema'),
    ])

    await userEvent.click(screen.getByRole('button', { name: 'Todos' }))
    expect(library.getAllByRole('link')).toHaveLength(4)
  })

  it('keeps the journeys in their own section', () => {
    render(<JourneysIndex />)

    expect(
      within(screen.getByRole('region', { name: 'Jornadas' })).getAllByRole('link', {
        name: /Abrir jornada/,
      }),
    ).toHaveLength(2)
  })

  it('points to the sector goal as a market level', () => {
    render(<JourneysIndex />)

    const card = screen.getByRole('link', { name: /Meta do setor/ })
    expect(card).toHaveAttribute('href', '/management/sector_goal')
    expect(card).toHaveTextContent('Nível de mercado (Fácil, Médio ou Difícil), ajustável por competência')
  })

  it('keeps Conteúdos active in the navigation', () => {
    render(<JourneysIndex />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Conteúdos/ })).toHaveAttribute('aria-current', 'page')
  })
})

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { contentLibrary, manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import LibrariesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('LibrariesShow', () => {
  beforeEach(() => {
    page.url = '/management/library'
    page.props = { library: contentLibrary, manager }
  })

  it('is the Biblioteca, active in the navigation and first step of the content path', () => {
    render(<LibrariesShow />)

    expect(screen.getByRole('heading', { level: 1, name: 'Biblioteca' })).toBeInTheDocument()
    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Biblioteca/ })).toHaveAttribute('aria-current', 'page')
    const pipeline = within(screen.getByRole('navigation', { name: 'Caminho do conteúdo' }))
    expect(pipeline.getByRole('link', { name: 'Biblioteca' })).toHaveAttribute('aria-current', 'step')
    expect(pipeline.getByRole('link', { name: 'Jornadas' })).toHaveAttribute('href', '/management/journeys')
  })

  it('starts a new content from the main button', () => {
    render(<LibrariesShow />)

    expect(screen.getByRole('link', { name: /Novo conteúdo/ })).toHaveAttribute(
      'href',
      '/management/modules/new',
    )
  })

  it('shows how each origin reaches the collaborator', () => {
    render(<LibrariesShow />)

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
    render(<LibrariesShow />)

    const library = within(screen.getByRole('region', { name: 'Módulos' }))
    const rotinas = library.getByRole('link', { name: /Rotinas/ })
    expect(rotinas).toHaveAttribute('href', '/management/modules/rotinas-de-atendimento')
    expect(rotinas).toHaveTextContent('Gerado por IA')
    expect(rotinas).toHaveTextContent('8 lições')
    expect(rotinas).toHaveTextContent('Em 1 jornada')
    expect(library.getByRole('link', { name: /Conversa Clara/ })).toHaveTextContent('Em 2 jornadas')
    expect(library.getByRole('link', { name: /Uso do Sistema/ })).toHaveTextContent('Em nenhuma jornada')
  })

  it('presents the Nivela products as a ready-made library for any sector', async () => {
    render(<LibrariesShow />)

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
    render(<LibrariesShow />)

    expect(screen.getByRole('link', { name: /Raciocínio Lógico/ })).toHaveTextContent(
      'Citado por 56% das empresas',
    )
  })

  it('filters the library by origin', async () => {
    render(<LibrariesShow />)

    const library = within(screen.getByRole('region', { name: 'Módulos' }))
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
})

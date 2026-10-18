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

  it('is the Biblioteca, active in the navigation, with no content path strip on top', () => {
    render(<LibrariesShow />)

    expect(screen.getByRole('heading', { level: 1, name: 'Biblioteca' })).toBeInTheDocument()
    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Biblioteca/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('navigation', { name: 'Caminho do conteúdo' })).not.toBeInTheDocument()
  })

  it('starts a new content from the main button', () => {
    render(<LibrariesShow />)

    expect(screen.getByRole('link', { name: /Novo conteúdo/ })).toHaveAttribute(
      'href',
      '/management/modules/new',
    )
  })

  it('shows only the name and the origin of each module', () => {
    render(<LibrariesShow />)

    const library = within(screen.getByRole('region', { name: 'Módulos' }))
    const rotinas = library.getByRole('link', { name: /Rotinas/ })
    expect(rotinas).toHaveAttribute('href', '/management/modules/rotinas-de-atendimento')
    expect(rotinas).toHaveTextContent('Gerado por IA')
    expect(library.getByRole('link', { name: /Raciocínio Lógico/ })).toHaveTextContent('Produtos Nivela')
    for (const noise of [/lições/, /jornada/, /Citado por/]) {
      expect(library.queryByText(noise)).not.toBeInTheDocument()
    }
  })

  it('puts the list right after the header, with no explanation blocks on top', () => {
    render(<LibrariesShow />)

    expect(
      screen.queryByRole('region', { name: 'Como o conteúdo chega ao colaborador' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Produtos Nivela' })).not.toBeInTheDocument()
  })

  it('explains each origin on demand', async () => {
    render(<LibrariesShow />)

    await userEvent.click(screen.getByRole('button', { name: /Entenda as origens/ }))

    const guide = within(screen.getByRole('dialog', { name: 'De onde vem cada conteúdo' }))
    const ai = within(guide.getByRole('list', { name: 'Caminho: Gerado por IA' }))
    expect(ai.getAllByRole('listitem').map((step) => step.textContent)).toEqual([
      'Material',
      'IA cria',
      'Você revisa',
      'Jornada',
      'Colaborador',
    ])
    expect(guide.getByRole('list', { name: 'Caminho: Produtos Nivela' })).toHaveTextContent(
      'Biblioteca Nivela',
    )
    expect(guide.getByRole('list', { name: 'Caminho: Produtos da empresa' })).toHaveTextContent(
      'Você escreve',
    )

    await userEvent.click(guide.getByRole('button', { name: 'Entendi' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
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

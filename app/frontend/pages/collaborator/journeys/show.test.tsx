import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { journey, viewer } from '@/test/collaboratorFixtures'
import { page } from '@/test/inertiaMock'
import JourneysShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('JourneysShow', () => {
  beforeEach(() => {
    page.url = '/collaborator/journey'
    page.props = { journey, viewer }
  })

  it('greets the collaborator and points to where they stopped', () => {
    render(<JourneysShow />)

    expect(screen.getByRole('heading', { name: 'Olá, Maria! Pronta para continuar?' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Continuar de onde parei/ })).toHaveAttribute(
      'href',
      '#aula-atual',
    )
    expect(screen.getByText('Passo 2 de 3')).toBeInTheDocument()
  })

  it('shows done, current and locked lessons along the path', () => {
    render(<JourneysShow />)

    expect(screen.getByText('Aula Concluída ✓')).toBeInTheDocument()
    expect(screen.getByText('Bloqueado')).toBeInTheDocument()
    const current = screen.getByText('Você está aqui').closest('li') as HTMLElement
    expect(within(current).getByText('Rotinas')).toBeInTheDocument()
  })

  it('tells the collaborator the journey is being prepared when it is empty', () => {
    page.props = { journey: { ...journey, sections: [] }, viewer }
    render(<JourneysShow />)

    expect(screen.getByRole('heading', { name: 'Sua jornada está sendo preparada' })).toBeInTheDocument()
  })

  it('opens finished modules from the path', () => {
    render(<JourneysShow />)

    expect(screen.getByRole('link', { name: /Conversa Clara/ })).toHaveAttribute(
      'href',
      '/collaborator/modules/conversa-clara',
    )
  })

  it('opens the current lesson', () => {
    render(<JourneysShow />)

    expect(screen.getByRole('link', { name: /Continuar aula \(5 min\)/ })).toHaveAttribute(
      'href',
      '/collaborator/lessons/rotinas',
    )
  })

  it('highlights the journey in the navigation', () => {
    render(<JourneysShow />)

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: /Jornadas/ })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: /Perfil/ })).not.toHaveAttribute('aria-current')
  })
})

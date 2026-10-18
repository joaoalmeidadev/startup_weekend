import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { contributionsPage, viewer } from '@/test/collaboratorFixtures'
import { page } from '@/test/inertiaMock'
import ContributionsIndex from './index'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const proposal = (title: string) => screen.getByRole('article', { name: title })

describe('ContributionsIndex', () => {
  beforeEach(() => {
    page.url = '/collaborator/contributions'
    page.props = { ...contributionsPage, viewer }
  })

  it('explains what sharing knowledge is and what she earned with it', () => {
    render(<ContributionsIndex />)

    expect(screen.getByRole('heading', { name: 'Compartilhar conhecimento' })).toBeInTheDocument()
    expect(screen.getByText(/vira uma jornada para os colegas e você ganha pontos/)).toBeInTheDocument()
    expect(screen.getByText('Você já ganhou 8 pts compartilhando')).toBeInTheDocument()
  })

  it('lists her proposals with sector, hours and sent date', () => {
    render(<ContributionsIndex />)

    expect(
      within(proposal('Planilha de rotas')).getByText('Logística · 1,5 h · enviada em 16/10'),
    ).toBeInTheDocument()
  })

  it('tells the status of each proposal', () => {
    render(<ContributionsIndex />)

    expect(
      within(proposal('Clientes difíceis: o que funciona')).getByText('Aprovada · +8 pts'),
    ).toBeInTheDocument()
    expect(within(proposal('Planilha de rotas')).getByText('Em análise')).toBeInTheDocument()
    expect(within(proposal('Etiquetas de envio')).getByText('Ajuste pedido')).toBeInTheDocument()
  })

  it('leads to proposing a new journey', () => {
    render(<ContributionsIndex />)

    expect(screen.getByRole('link', { name: 'Propor uma jornada' })).toHaveAttribute(
      'href',
      '/collaborator/contributions/new',
    )
  })

  it('invites her to share when she has not proposed anything yet', () => {
    page.props = { contributions: [], earned: 0, viewer }
    render(<ContributionsIndex />)

    expect(screen.getByText('Você ainda não propôs nenhuma jornada.')).toBeInTheDocument()
  })
})

import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { approvalsProps, manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import ApprovalsIndex from './index'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const proposals = () => within(screen.getByRole('region', { name: 'Jornadas enviadas pela equipe' }))
const aiLessons = () => within(screen.getByRole('region', { name: 'Lições da IA para revisar' }))

describe('ApprovalsIndex', () => {
  beforeEach(() => {
    page.url = '/management/approvals'
    page.props = { ...approvalsProps, manager, pending_approvals: 4 }
  })

  it('tells the manager what waits for a decision', () => {
    render(<ApprovalsIndex />)

    expect(screen.getByRole('heading', { level: 1, name: 'Aprovações' })).toBeInTheDocument()
    expect(screen.getByText('O que a equipe enviou e espera a sua decisão.')).toBeInTheDocument()
  })

  it('lists each proposal with its author, hours, date and status, linking to the detail', () => {
    render(<ApprovalsIndex />)

    const rows = proposals().getAllByRole('link')
    expect(rows).toHaveLength(3)
    const first = within(rows[0])
    expect(rows[0]).toHaveAttribute('href', '/management/approvals/conferir-devolucao')
    expect(first.getByText('Como conferir uma devolução')).toBeInTheDocument()
    expect(first.getByText('Carla Silveira')).toBeInTheDocument()
    expect(first.getByText('Atendimento')).toBeInTheDocument()
    expect(first.getByText('3 h de treino')).toBeInTheDocument()
    expect(first.getByText('Enviada em 15/10')).toBeInTheDocument()
    expect(first.getByText('Aguardando')).toBeInTheDocument()
    expect(within(rows[1]).getByText('1,5 h de treino')).toBeInTheDocument()
    expect(within(rows[1]).getByText('Ajuste pedido')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Aprovada · +8 pts')).toBeInTheDocument()
  })

  it('lists the AI lessons to review with a link to the review', () => {
    render(<ApprovalsIndex />)

    expect(aiLessons().getByText('Rotinas de atendimento')).toBeInTheDocument()
    expect(aiLessons().getByText('8 lições')).toBeInTheDocument()
    expect(aiLessons().getByRole('link', { name: /Revisar/ })).toHaveAttribute(
      'href',
      '/management/lesson_reviews/2',
    )
  })

  it('marks Aprovações current in the sidebar with the pending count', () => {
    render(<ApprovalsIndex />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    const link = nav.getByRole('link', { name: 'Aprovações, 4 pendentes' })
    expect(link).toHaveAttribute('href', '/management/approvals')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(within(link).getByText('4')).toBeInTheDocument()
  })

  it('hides the sidebar count when nothing is pending', () => {
    page.props = { ...page.props, pending_approvals: 0 }
    render(<ApprovalsIndex />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    const link = nav.getByRole('link', { name: /Aprovações/ })
    expect(link).toHaveAccessibleName('Aprovações')
    expect(within(link).queryByText('0')).not.toBeInTheDocument()
  })
})

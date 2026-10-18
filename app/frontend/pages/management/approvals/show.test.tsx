import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { approvedSubmission, manager, returnCheckSubmission } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import ApprovalsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const pointsCard = () => within(screen.getByRole('region', { name: 'Pontos para Carla' }))
const approve = () => userEvent.click(screen.getByRole('button', { name: 'Aprovar e criar a jornada' }))

describe('ApprovalsShow', () => {
  beforeEach(() => {
    page.url = '/management/approvals/conferir-devolucao'
    page.props = { submission: returnCheckSubmission, reward_share: 0.4, manager, pending_approvals: 4 }
  })

  it('shows who sent the proposal, when and how many hours it replaces', () => {
    render(<ApprovalsShow />)

    expect(screen.getByRole('link', { name: 'Voltar para Aprovações' })).toHaveAttribute(
      'href',
      '/management/approvals',
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Como conferir uma devolução' })).toBeInTheDocument()
    expect(screen.getByText('Carla Silveira')).toBeInTheDocument()
    expect(screen.getByText('Enviada em 15/10')).toBeInTheDocument()
    expect(screen.getByText('3 h de treino')).toBeInTheDocument()
    expect(screen.getByText('Aguardando')).toBeInTheDocument()
  })

  it('shows the proposed lessons with the right answer marked', () => {
    render(<ApprovalsShow />)

    const lesson = within(screen.getByRole('article', { name: 'Antes de aceitar a devolução' }))
    expect(lesson.getByText('O que conferir primeiro quando o produto volta?')).toBeInTheDocument()
    const right = within(lesson.getByText('A nota e o estado da embalagem').closest('li')!)
    expect(right.getByText('Correta')).toBeInTheDocument()
    const wrong = within(lesson.getByText('Só o nome do cliente').closest('li')!)
    expect(wrong.queryByText('Correta')).not.toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('explains the suggested points with the same rule as studying', () => {
    render(<ApprovalsShow />)

    expect(pointsCard().getByText('3 h × R$ 12/h × 40% = 14 pts')).toBeInTheDocument()
    expect(pointsCard().getByLabelText('Pontos')).toHaveValue(14)
    expect(
      pointsCard().getByText('É a mesma conta do estudo: as horas que ela informou, pelo salário dela.'),
    ).toBeInTheDocument()
  })

  it('approves with the suggested points and marks the proposal approved', async () => {
    render(<ApprovalsShow />)
    await approve()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Aprovada: Carla Silveira ganhou 14 pts e a jornada foi criada como rascunho (simulação).',
    )
    expect(screen.getByText('Aprovada · +14 pts')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Aprovar e criar a jornada' })).not.toBeInTheDocument()
  })

  it('lets the admin decide another amount of points', async () => {
    render(<ApprovalsShow />)
    const input = pointsCard().getByLabelText('Pontos')
    await userEvent.clear(input)
    await userEvent.type(input, '20')
    await approve()

    expect(screen.getByRole('status')).toHaveTextContent('Carla Silveira ganhou 20 pts')
    expect(screen.getByText('Aprovada · +20 pts')).toBeInTheDocument()
  })

  it('asks for changes with a note', async () => {
    render(<ApprovalsShow />)
    await userEvent.click(screen.getByRole('button', { name: 'Pedir ajuste' }))
    await userEvent.type(screen.getByLabelText('O que precisa mudar?'), 'Faltou falar da troca.')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar pedido' }))

    expect(screen.getByRole('status')).toHaveTextContent('Pedido de ajuste enviado para Carla (simulação).')
    expect(screen.getByText('Ajuste pedido')).toBeInTheDocument()
    expect(screen.queryByLabelText('O que precisa mudar?')).not.toBeInTheDocument()
  })

  it('shows an approved proposal without the actions', () => {
    page.props = { ...page.props, submission: approvedSubmission }
    render(<ApprovalsShow />)

    expect(screen.getByText('Aprovada · +8 pts')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Aprovar e criar a jornada' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Pedir ajuste' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Pontos')).not.toBeInTheDocument()
  })
})

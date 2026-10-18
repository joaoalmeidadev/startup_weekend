import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { rewardsPage, viewer } from '@/test/collaboratorFixtures'
import { page } from '@/test/inertiaMock'
import RewardsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const card = (name: string) => screen.getByRole('article', { name })

describe('RewardsShow', () => {
  beforeEach(() => {
    page.url = '/collaborator/rewards'
    page.props = { ...rewardsPage, viewer }
  })

  it('shows her balance and how points are earned', () => {
    render(<RewardsShow />)

    expect(screen.getByText('Seu saldo: 30 pts')).toBeInTheDocument()
    expect(screen.getByText('Você ganha pontos estudando e compartilhando o que sabe.')).toBeInTheDocument()
  })

  it('lets her redeem what the balance covers', () => {
    render(<RewardsShow />)

    expect(within(card('Caneca Nivela')).getByRole('button', { name: 'Resgatar' })).toBeEnabled()
  })

  it('tells how much is missing for what the balance does not cover', () => {
    render(<RewardsShow />)

    const cinema = card('Ingresso de cinema')
    expect(within(cinema).getByText('Faltam 10 pts')).toBeInTheDocument()
    expect(within(cinema).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75')
    expect(within(cinema).queryByRole('button', { name: 'Resgatar' })).not.toBeInTheDocument()
  })

  it('marks a reward without stock as sold out', () => {
    render(<RewardsShow />)

    const snack = card('Vale-lanche')
    expect(within(snack).getByText('Esgotado')).toBeInTheDocument()
    expect(within(snack).queryByRole('button', { name: 'Resgatar' })).not.toBeInTheDocument()
  })

  it('lists what she already redeemed', () => {
    render(<RewardsShow />)

    const list = screen.getByRole('list', { name: 'Meus resgates' })
    expect(within(list).getByText('Caneca Nivela')).toBeInTheDocument()
    expect(within(list).getByText('02/10 · 25 pts')).toBeInTheDocument()
  })

  it('redeems after confirming, lowering the balance and adding it to her list', async () => {
    render(<RewardsShow />)

    await userEvent.click(within(card('Caneca Nivela')).getByRole('button', { name: 'Resgatar' }))
    const dialog = screen.getByRole('dialog', { name: 'Trocar 25 pts por Caneca Nivela?' })
    expect(within(dialog).getByText('Seu saldo fica em 5 pts.')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Confirmar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Pedido enviado ao RH (simulação).')
    expect(screen.getByText('Seu saldo: 5 pts')).toBeInTheDocument()
    expect(within(card('Caneca Nivela')).getByText('Faltam 20 pts')).toBeInTheDocument()
    expect(
      within(screen.getByRole('list', { name: 'Meus resgates' })).getByText('hoje · 25 pts'),
    ).toBeInTheDocument()
  })

  it('keeps the balance when she gives up', async () => {
    render(<RewardsShow />)

    await userEvent.click(within(card('Caneca Nivela')).getByRole('button', { name: 'Resgatar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Agora não' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Seu saldo: 30 pts')).toBeInTheDocument()
  })
})

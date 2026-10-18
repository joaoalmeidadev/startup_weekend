import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, rewardsProps } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import RewardsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const catalog = () => within(screen.getByRole('region', { name: 'Catálogo' }))
const openForm = () => userEvent.click(screen.getByRole('button', { name: /Cadastrar recompensa/ }))
const field = (label: string) => within(screen.getByRole('dialog')).getByLabelText(label)

describe('RewardsShow', () => {
  beforeEach(() => {
    page.url = '/management/rewards'
    page.props = { ...rewardsProps, manager }
  })

  it('keeps Recompensas active in the navigation', () => {
    render(<RewardsShow />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Recompensas/ })).toHaveAttribute('aria-current', 'page')
  })

  it('explains the rule to the manager only', () => {
    render(<RewardsShow />)

    const rule = within(screen.getByRole('region', { name: 'Como funciona' }))
    expect(rule.getByText(/Cada hora estudada evita uma hora de alguém treinando/)).toBeInTheDocument()
    expect(rule.getByText(/até 40%/)).toBeInTheDocument()
    expect(rule.getByText(/a pessoa vê só os pontos/)).toBeInTheDocument()
  })

  it('shows each reward with points, cost and the training it saved', () => {
    render(<RewardsShow />)

    const mug = within(catalog().getByRole('article', { name: 'Caneca Nivela' }))
    expect(mug.getByText('53 pts')).toBeInTheDocument()
    expect(mug.getByText('Custa R$ 25')).toBeInTheDocument()
    expect(mug.getByText('Economia de treino ~R$ 64 · fica R$ 39 (61%)')).toBeInTheDocument()
    expect(mug.getByText('20 em estoque')).toBeInTheDocument()
  })

  it('suggests the points from the cost while registering a reward', async () => {
    render(<RewardsShow />)
    await openForm()

    await userEvent.type(field('Nome'), 'Vale-pizza')
    await userEvent.type(field('Custo (R$)'), '40')

    expect(field('Pontos')).toHaveValue(84)
    expect(within(screen.getByRole('dialog')).getByText(/a empresa fica com/)).toBeInTheDocument()
  })

  it('blocks points below the rule', async () => {
    render(<RewardsShow />)
    await openForm()

    await userEvent.type(field('Nome'), 'Vale-pizza')
    await userEvent.type(field('Custo (R$)'), '40')
    await userEvent.clear(field('Pontos'))
    await userEvent.type(field('Pontos'), '50')

    const dialog = within(screen.getByRole('dialog'))
    expect(dialog.getByText('Abaixo da regra: a empresa gastaria mais do que economiza.')).toBeInTheDocument()
    expect(dialog.getByRole('button', { name: 'Cadastrar' })).toBeDisabled()
  })

  it('registers the reward in the catalog as a simulation', async () => {
    render(<RewardsShow />)
    await openForm()

    await userEvent.type(field('Nome'), 'Vale-pizza')
    await userEvent.type(field('Custo (R$)'), '40')
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cadastrar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(catalog().getByRole('article', { name: 'Vale-pizza' })).toHaveTextContent('84 pts')
    expect(screen.getByRole('status')).toHaveTextContent('Recompensa "Vale-pizza" cadastrada (simulação).')
  })

  it('fills the form from a ready-made idea', async () => {
    render(<RewardsShow />)

    const ideas = within(screen.getByRole('region', { name: 'Ideias para cadastrar' }))
    await userEvent.click(ideas.getByRole('button', { name: /Almoço com o gestor/ }))

    expect(field('Nome')).toHaveValue('Almoço com o gestor')
    expect(field('Custo (R$)')).toHaveValue(60)
    expect(field('Pontos')).toHaveValue(125)
  })

  it('lists the recent redemptions and the month spent against the training saved', () => {
    render(<RewardsShow />)

    const recent = within(screen.getByRole('region', { name: 'Resgates recentes' }))
    const maria = recent.getByText('Maria Souza').closest('li') as HTMLElement
    expect(maria).toHaveTextContent('Vale-lanche')
    expect(maria).toHaveTextContent('02/10')
    expect(maria).toHaveTextContent('63 pts')
    expect(recent.getByText('No mês: R$ 120 em prêmios · R$ 1.200 de treino economizado')).toBeInTheDocument()
  })
})

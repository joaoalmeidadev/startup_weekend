import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, rewardsProps } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import RewardsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const catalog = () => within(screen.getByRole('region', { name: 'Catálogo' }))
const calculator = () => within(screen.getByRole('region', { name: 'Calculadora de pontos' }))
const openForm = () => userEvent.click(screen.getByRole('button', { name: /Cadastrar recompensa/ }))
const field = (label: string) => within(screen.getByRole('dialog')).getByLabelText(label)

const changeShare = async (percent: string) => {
  const share = calculator().getByLabelText('Quanto da economia vira prêmio (%)')
  await userEvent.clear(share)
  await userEvent.type(share, percent)
}

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

  it('starts the calculator from the admin rule', () => {
    render(<RewardsShow />)

    expect(calculator().getByLabelText('Valor/hora do gestor (R$)')).toHaveValue(60)
    expect(calculator().getByLabelText('Valor/hora da pessoa (R$)')).toHaveValue(25)
    expect(calculator().getByLabelText('Quanto da economia vira prêmio (%)')).toHaveValue(40)
    expect(calculator().getByText('1 h de treino presencial custa R$ 85')).toBeInTheDocument()
    expect(calculator().getByText('vira 34 pts para quem estuda')).toBeInTheDocument()
    expect(calculator().getByText('1 pt = R$ 1 em prêmios')).toBeInTheDocument()
    expect(calculator().getByText('Uma etapa de 6 h → R$ 510 economizados → 204 pts')).toBeInTheDocument()
    expect(calculator().getByText(/a pessoa só vê os pontos/)).toBeInTheDocument()
  })

  it('recalculates live as the admin edits the rule', async () => {
    render(<RewardsShow />)

    const managerHourly = calculator().getByLabelText('Valor/hora do gestor (R$)')
    await userEvent.clear(managerHourly)
    await userEvent.type(managerHourly, '75')
    await changeShare('20')

    expect(calculator().getByText('1 h de treino presencial custa R$ 100')).toBeInTheDocument()
    expect(calculator().getByText('vira 20 pts para quem estuda')).toBeInTheDocument()
    expect(calculator().getByText('Uma etapa de 6 h → R$ 600 economizados → 120 pts')).toBeInTheDocument()
  })

  it('saves the rule as a simulation', async () => {
    render(<RewardsShow />)

    await userEvent.click(calculator().getByRole('button', { name: 'Salvar regra' }))

    expect(screen.getByRole('status')).toHaveTextContent('Regra salva (simulação).')
  })

  it('shows each reward with points, cost and the training it stands for', () => {
    render(<RewardsShow />)

    const mug = within(catalog().getByRole('article', { name: 'Caneca Nivela' }))
    expect(mug.getByText('25 pts')).toBeInTheDocument()
    expect(mug.getByText('Custa R$ 25')).toBeInTheDocument()
    expect(mug.getByText('Equivale a ~0,7 h de treino substituído')).toBeInTheDocument()
    expect(mug.getByText('20 em estoque')).toBeInTheDocument()
    const shift = within(catalog().getByRole('article', { name: 'Escolher a escala da semana' }))
    expect(shift.getByText('40 pts')).toBeInTheDocument()
    expect(shift.getByText('Custa R$ 0')).toBeInTheDocument()
  })

  it('updates the cards when the share changes', async () => {
    render(<RewardsShow />)
    await changeShare('20')

    const mug = within(catalog().getByRole('article', { name: 'Caneca Nivela' }))
    expect(mug.getByText('Equivale a ~1,5 h de treino substituído')).toBeInTheDocument()
  })

  it('suggests one point per real while registering a reward', async () => {
    render(<RewardsShow />)
    await openForm()

    await userEvent.type(field('Nome'), 'Vale-pizza')
    await userEvent.type(field('Custo (R$)'), '68')

    const dialog = within(screen.getByRole('dialog'))
    expect(field('Pontos')).toHaveValue(68)
    expect(dialog.getByText('Equivale a ~2 h de treino substituído')).toBeInTheDocument()
    expect(dialog.queryByText(/40%/)).not.toBeInTheDocument()
  })

  it('blocks points below the cost', async () => {
    render(<RewardsShow />)
    await openForm()

    await userEvent.type(field('Nome'), 'Vale-pizza')
    await userEvent.type(field('Custo (R$)'), '40')
    await userEvent.clear(field('Pontos'))
    await userEvent.type(field('Pontos'), '35')

    const dialog = within(screen.getByRole('dialog'))
    expect(
      dialog.getByText('Abaixo do custo: a empresa pagaria mais do que a regra prevê.'),
    ).toBeInTheDocument()
    expect(dialog.getByRole('button', { name: 'Cadastrar' })).toBeDisabled()
  })

  it('registers the reward in the catalog as a simulation', async () => {
    render(<RewardsShow />)
    await openForm()

    await userEvent.type(field('Nome'), 'Vale-pizza')
    await userEvent.type(field('Custo (R$)'), '40')
    await userEvent.clear(field('Pontos'))
    await userEvent.type(field('Pontos'), '50')
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cadastrar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(catalog().getByRole('article', { name: 'Vale-pizza' })).toHaveTextContent('50 pts')
    expect(screen.getByRole('status')).toHaveTextContent('Recompensa "Vale-pizza" cadastrada (simulação).')
  })

  it('fills the form from a ready-made idea', async () => {
    render(<RewardsShow />)

    const ideas = within(screen.getByRole('region', { name: 'Ideias para cadastrar' }))
    await userEvent.click(ideas.getByRole('button', { name: /Almoço com o gestor/ }))

    expect(field('Nome')).toHaveValue('Almoço com o gestor')
    expect(field('Custo (R$)')).toHaveValue(60)
    expect(field('Pontos')).toHaveValue(60)
    expect(
      within(screen.getByRole('dialog')).getByText('Equivale a ~1,8 h de treino substituído'),
    ).toBeInTheDocument()
  })

  it('lists the recent redemptions and the month spent against the training saved', () => {
    render(<RewardsShow />)

    const recent = within(screen.getByRole('region', { name: 'Resgates recentes' }))
    const maria = recent.getByText('Maria Souza').closest('li') as HTMLElement
    expect(maria).toHaveTextContent('Vale-lanche')
    expect(maria).toHaveTextContent('02/10')
    expect(maria).toHaveTextContent('30 pts')
    expect(recent.getByText('No mês: R$ 120 em prêmios · R$ 2.890 de treino economizado')).toBeInTheDocument()
  })
})

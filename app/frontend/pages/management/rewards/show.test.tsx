import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, rewardsProps } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import RewardsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const catalog = () => within(screen.getByRole('region', { name: 'Catálogo' }))
const calculator = () => within(screen.getByRole('dialog', { name: 'Calcular pontuação' }))
const openCalculator = () => userEvent.click(screen.getByRole('button', { name: /Calcular pontuação/ }))
const openForm = () => userEvent.click(screen.getByRole('button', { name: /Cadastrar recompensa/ }))
const field = (label: string) => within(screen.getByRole('dialog')).getByLabelText(label)

const retype = async (label: string, value: string) => {
  const input = calculator().getByLabelText(label)
  await userEvent.clear(input)
  await userEvent.type(input, value)
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

  it('opens a calculator from a button, with nothing to save', async () => {
    render(<RewardsShow />)
    expect(screen.queryByRole('region', { name: 'Calculadora de pontos' })).not.toBeInTheDocument()

    await openCalculator()

    expect(calculator().getByLabelText('Salário mensal de quem ensina (R$)')).toHaveValue(4400)
    expect(calculator().getByLabelText('Salário mensal de quem aprende (R$)')).toHaveValue(2200)
    expect(calculator().getByRole('radio', { name: 'Equilibrado · 40%' })).toBeChecked()
    expect(calculator().getByLabelText('Horas de estudo')).toHaveValue(6)
    expect(calculator().getByText('1 h de treino presencial custa R$ 30')).toBeInTheDocument()
    expect(calculator().getByText('4 pts por hora para quem estuda (1 pt = R$ 1)')).toBeInTheDocument()
    expect(calculator().getByText('6 h de estudo → R$ 180 economizados → 24 pts')).toBeInTheDocument()
    expect(calculator().queryByRole('button', { name: /Salvar/ })).not.toBeInTheDocument()
  })

  it('recalculates live as the numbers change', async () => {
    render(<RewardsShow />)
    await openCalculator()

    await retype('Salário mensal de quem ensina (R$)', '6600')
    await userEvent.click(calculator().getByRole('radio', { name: 'Econômico · 20%' }))
    await retype('Horas de estudo', '3')

    expect(calculator().getByText('1 h de treino presencial custa R$ 40')).toBeInTheDocument()
    expect(calculator().getByText('2 pts por hora para quem estuda (1 pt = R$ 1)')).toBeInTheDocument()
    expect(calculator().getByText('3 h de estudo → R$ 120 economizados → 6 pts')).toBeInTheDocument()
  })

  it('takes a custom share of the saving', async () => {
    render(<RewardsShow />)
    await openCalculator()

    await userEvent.click(calculator().getByRole('radio', { name: 'Personalizar' }))
    await retype('Porcentagem que vira prêmio (%)', '50')

    expect(calculator().getByText('5 pts por hora para quem estuda (1 pt = R$ 1)')).toBeInTheDocument()
    expect(calculator().getByText('6 h de estudo → R$ 180 economizados → 30 pts')).toBeInTheDocument()
  })

  it('tells how much training a reward stands for', async () => {
    render(<RewardsShow />)
    await openCalculator()

    await retype('Custo do prêmio (R$)', '50')

    expect(calculator().getByText('Um prêmio de R$ 50 vale 50 pts ≈ 12,5 h de estudo')).toBeInTheDocument()
  })

  it('leaves the catalog untouched and closes', async () => {
    render(<RewardsShow />)
    await openCalculator()
    await userEvent.click(calculator().getByRole('radio', { name: 'Econômico · 20%' }))

    await userEvent.click(calculator().getByRole('button', { name: 'Fechar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const mug = within(catalog().getByRole('article', { name: 'Caneca Nivela' }))
    expect(mug.getByText('Equivale a ~6,3 h de estudo')).toBeInTheDocument()
  })

  it('shows each reward with points, cost and the training it stands for', () => {
    render(<RewardsShow />)

    const mug = within(catalog().getByRole('article', { name: 'Caneca Nivela' }))
    expect(mug.getByText('25 pts')).toBeInTheDocument()
    expect(mug.getByText('Custa R$ 25')).toBeInTheDocument()
    expect(mug.getByText('Equivale a ~6,3 h de estudo')).toBeInTheDocument()
    expect(mug.getByText('17 em estoque · 3 resgatados')).toBeInTheDocument()
    const shift = within(catalog().getByRole('article', { name: 'Escolher a escala da semana' }))
    expect(shift.getByText('40 pts')).toBeInTheDocument()
    expect(shift.getByText('Custa R$ 0')).toBeInTheDocument()
  })

  it('suggests one point per real while registering a reward', async () => {
    render(<RewardsShow />)
    await openForm()

    await userEvent.type(field('Nome'), 'Vale-pizza')
    await userEvent.type(field('Custo (R$)'), '68')

    const dialog = within(screen.getByRole('dialog'))
    expect(field('Pontos')).toHaveValue(68)
    expect(dialog.getByText('Equivale a ~17 h de estudo')).toBeInTheDocument()
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
    expect(within(screen.getByRole('dialog')).getByText('Equivale a ~15 h de estudo')).toBeInTheDocument()
  })

  it('lists the recent redemptions and the month spent against the training saved', () => {
    render(<RewardsShow />)

    const recent = within(screen.getByRole('region', { name: 'Resgates recentes' }))
    const maria = recent.getByText('Maria Souza').closest('li') as HTMLElement
    expect(maria).toHaveTextContent('Vale-lanche')
    expect(maria).toHaveTextContent('02/10')
    expect(maria).toHaveTextContent('30 pts')
    expect(recent.getByText('No mês: R$ 120 em prêmios · R$ 1.020 de treino economizado')).toBeInTheDocument()
  })

  it('marks a reward as sold out when its stock is over', () => {
    render(<RewardsShow />)

    const cinema = within(catalog().getByRole('article', { name: 'Ingresso de cinema' }))
    expect(cinema.getByText('Esgotado · 10 resgatados')).toBeInTheDocument()
  })

  it('says when a reward has no stock limit', () => {
    render(<RewardsShow />)

    const dayOff = within(catalog().getByRole('article', { name: 'Dia de folga' }))
    expect(dayOff.getByText('Sem limite de estoque')).toBeInTheDocument()
  })
})

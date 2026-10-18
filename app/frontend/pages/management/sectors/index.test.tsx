import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, sectorsIndexProps } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import SectorsIndex from './index'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const companyCard = () => within(screen.getByRole('region', { name: 'Custo do treino da empresa' }))
const card = (name: string) => within(screen.getByRole('link', { name: new RegExp(`^${name}`) }))

describe('SectorsIndex', () => {
  beforeEach(() => {
    page.url = '/management/sectors'
    page.props = { ...sectorsIndexProps, manager }
  })

  it('is the Setores tab of the navigation', () => {
    render(<SectorsIndex />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Setores/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { name: 'Setores', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Quem trabalha em cada setor e a meta de cada um.')).toBeInTheDocument()
  })

  it('creates a new sector', () => {
    render(<SectorsIndex />)

    expect(screen.getByRole('link', { name: /Novo setor/ })).toHaveAttribute(
      'href',
      '/management/sectors/new',
    )
  })

  it('links each sector to its page with people count and goal', () => {
    render(<SectorsIndex />)

    expect(screen.getByRole('link', { name: /^Atendimento/ })).toHaveAttribute(
      'href',
      '/management/sectors/atendimento',
    )
    expect(card('Atendimento').getByText('5 pessoas')).toBeInTheDocument()
    expect(card('Atendimento').getByText('Meta Médio · 75 pts')).toBeInTheDocument()
    expect(card('Logística').getByText('1 pessoa')).toBeInTheDocument()
    expect(card('Logística').getByText('Sem meta ainda')).toBeInTheDocument()
  })

  it('tags groups and shows a few faces', () => {
    render(<SectorsIndex />)

    expect(card('Staff').getByText('Grupo')).toBeInTheDocument()
    expect(card('Atendimento').queryByText('Grupo')).not.toBeInTheDocument()
    expect(card('Atendimento').getByText('DF')).toBeInTheDocument()
  })

  it('tells each work sector where its training cost comes from', () => {
    render(<SectorsIndex />)

    expect(card('Atendimento').getByText('Treino: padrão da empresa')).toBeInTheDocument()
    expect(card('Logística').getByText('Treino: R$ 27/h (valor próprio)')).toBeInTheDocument()
    expect(card('Staff').queryByText(/^Treino:/)).not.toBeInTheDocument()
  })

  it('sums up the company training cost', () => {
    render(<SectorsIndex />)

    expect(
      companyCard().getByText(
        '1 h de treino custa R$ 30 · quem estuda ganha 4 pts por hora · Equilibrado (40%)',
      ),
    ).toBeInTheDocument()
    expect(
      companyCard().getByText('Vale para todos os setores, menos os que têm valor próprio.'),
    ).toBeInTheDocument()
  })

  it('edits the company training cost as a simulation', async () => {
    render(<SectorsIndex />)

    await userEvent.click(companyCard().getByRole('button', { name: 'Editar' }))
    const dialog = within(screen.getByRole('dialog', { name: 'Custo do treino da empresa' }))
    expect(dialog.getByText('Cada hora de estudo vira 4 pts para quem ganha R$ 2.200')).toBeInTheDocument()

    fireEvent.change(dialog.getByLabelText('Salário mensal de quem ensina (R$)'), {
      target: { value: '6600' },
    })
    await userEvent.click(dialog.getByRole('radio', { name: 'Generoso · 60%' }))
    expect(dialog.getByText('Cada hora de estudo vira 6 pts para quem ganha R$ 2.200')).toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Salvar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Custo do treino salvo (simulação).')
    expect(
      companyCard().getByText(
        '1 h de treino custa R$ 40 · quem estuda ganha 6 pts por hora · Generoso (60%)',
      ),
    ).toBeInTheDocument()
  })

  it('drops the changes when the edit is cancelled', async () => {
    render(<SectorsIndex />)

    await userEvent.click(companyCard().getByRole('button', { name: 'Editar' }))
    await userEvent.click(screen.getByRole('radio', { name: 'Generoso · 60%' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(companyCard().getByText(/Equilibrado \(40%\)/)).toBeInTheDocument()
  })
})

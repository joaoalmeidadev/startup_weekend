import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { groupDetail, manager, peopleProps, sectorDetail, sectorWithoutGoal } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import SectorsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const ruler = (name: string) => screen.getByLabelText(`Meta de ${name}`) as HTMLInputElement
const peopleBlock = () => within(screen.getByRole('region', { name: 'Pessoas' }))

describe('SectorsShow', () => {
  beforeEach(() => {
    page.url = '/management/sectors/atendimento'
    page.props = { sector: sectorDetail, invite_sectors: peopleProps.sectors, manager }
  })

  it('keeps the Setores tab current and links back to the list', () => {
    render(<SectorsShow />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Setores/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /Voltar para Setores/ })).toHaveAttribute(
      'href',
      '/management/sectors',
    )
    expect(screen.getByRole('heading', { name: 'Atendimento', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Setor de trabalho')).toBeInTheDocument()
    expect(screen.getByText('3 pessoas')).toBeInTheDocument()
  })

  it('invites people straight into this sector', async () => {
    render(<SectorsShow />)

    await userEvent.click(screen.getByRole('button', { name: /Convidar para este setor/ }))
    await userEvent.click(screen.getByRole('button', { name: /Por e-mail/ }))

    expect(screen.getByRole('combobox')).toHaveValue('Atendimento')
  })

  it('lists each person with progress, score against the goal, activity and forecast', () => {
    render(<SectorsShow />)

    const maria = peopleBlock().getByRole('link', { name: /Maria Souza/ })
    expect(maria).toHaveAttribute('href', '/management/people/maria-souza')
    expect(maria).toHaveTextContent('Atendente')
    expect(maria).toHaveTextContent('50%')
    expect(maria).toHaveTextContent('68 / meta 75')
    expect(maria).toHaveTextContent('há 2 dias · 35 min nesta semana')
    expect(maria).toHaveTextContent('Nivela em ~12 dias')
    expect(peopleBlock().queryByRole('button', { name: /Adicionar pessoas/ })).not.toBeInTheDocument()
  })

  it('filters the people by status, with how many are in each one', async () => {
    render(<SectorsShow />)

    const statuses = within(peopleBlock().getByRole('group', { name: 'Status' }))
    await userEvent.click(statuses.getByRole('button', { name: 'Atrasados (1)' }))

    expect(
      peopleBlock()
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual([expect.stringContaining('Bruna Costa')])
    await userEvent.click(statuses.getByRole('button', { name: 'Todos (3)' }))
    expect(peopleBlock().getAllByRole('link')).toHaveLength(3)
  })

  it('finds people by name and says when nobody matches', async () => {
    render(<SectorsShow />)

    await userEvent.type(peopleBlock().getByLabelText('Buscar por nome'), 'diego')
    expect(peopleBlock().getAllByRole('link')).toHaveLength(1)

    await userEvent.clear(peopleBlock().getByLabelText('Buscar por nome'))
    await userEvent.type(peopleBlock().getByLabelText('Buscar por nome'), 'zé')
    expect(peopleBlock().getByText('Ninguém encontrado')).toBeInTheDocument()
  })

  it('moves every ruler to the target of the chosen level', async () => {
    render(<SectorsShow />)

    expect(screen.getByRole('radio', { name: /Médio/ })).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(screen.getByRole('radio', { name: /Difícil/ }))

    expect(ruler('Comunicação').value).toBe('90')
    expect(ruler('Sistema de Pedidos').value).toBe('90')
  })

  it('marks the level as Personalizado when a ruler is moved by hand', async () => {
    render(<SectorsShow />)

    fireEvent.change(ruler('Comunicação'), { target: { value: '82' } })

    expect(screen.getByText('Meta: 82 pts')).toBeInTheDocument()
    expect(screen.getByText('Personalizado')).toBeInTheDocument()
    expect(within(screen.getByRole('radio', { name: /Médio/ })).getByText('ajustado')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('radio', { name: /Médio/ }))

    expect(ruler('Comunicação').value).toBe('75')
    expect(screen.queryByText('ajustado')).not.toBeInTheDocument()
  })

  it('shows the veterans average as a reference and who reaches the goal today', () => {
    render(<SectorsShow />)

    expect(screen.getAllByText('Referência dos seus veteranos:')[0]).toBeInTheDocument()
    expect(screen.getByText('88 pts')).toBeInTheDocument()
    expect(screen.getByText('1 de 2 pessoas')).toBeInTheDocument()
  })

  it('saves the goal as a simulation', async () => {
    render(<SectorsShow />)

    await userEvent.click(screen.getByRole('button', { name: /Salvar meta/ }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Meta de Atendimento salva no nível Médio (simulação).',
    )
  })

  describe('when it has no goal yet', () => {
    beforeEach(() => {
      page.props = { sector: sectorWithoutGoal, invite_sectors: peopleProps.sectors, manager }
    })

    it('asks to pick a level first', () => {
      render(<SectorsShow />)

      expect(screen.getByRole('heading', { name: 'Logística ainda não tem meta' })).toBeInTheDocument()
      expect(
        screen.getAllByRole('radio').every((radio) => radio.getAttribute('aria-checked') === 'false'),
      ).toBe(true)
      expect(screen.queryByLabelText('Meta de Conferência')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Convidar veteranos/ })).toBeInTheDocument()
    })

    it('shows the rulers once a level is picked', async () => {
      render(<SectorsShow />)

      await userEvent.click(screen.getByRole('radio', { name: /Fácil/ }))

      expect(ruler('Conferência').value).toBe('60')
      expect(screen.queryByRole('heading', { name: 'Logística ainda não tem meta' })).not.toBeInTheDocument()
    })
  })

  describe('for a group', () => {
    beforeEach(() => {
      page.url = '/management/sectors/staff'
      page.props = { sector: groupDetail, invite_sectors: peopleProps.sectors, manager }
    })

    it('shows the Grupo tag and the work sector of each person', () => {
      render(<SectorsShow />)

      expect(screen.getByText('Grupo')).toBeInTheDocument()
      const lucas = peopleBlock().getByRole('link', { name: /Lucas Pereira/ })
      expect(within(lucas).getByText(/Comercial/)).toBeInTheDocument()
    })

    it('adds people to the group as a simulation', async () => {
      render(<SectorsShow />)

      await userEvent.click(peopleBlock().getByRole('button', { name: /Adicionar pessoas/ }))

      expect(screen.getByRole('status')).toHaveTextContent('Pessoas adicionadas ao grupo Staff (simulação).')
    })
  })
})

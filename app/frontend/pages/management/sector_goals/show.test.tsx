import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, sectorGoal, sectorWithoutGoal } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import SectorGoalsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const ruler = (name: string) => screen.getByLabelText(`Meta de ${name}`) as HTMLInputElement

describe('SectorGoalsShow', () => {
  beforeEach(() => {
    page.url = '/management/sector_goal'
    page.props = { sector_goal: sectorGoal, manager }
  })

  it('offers the three market levels with Médio selected', () => {
    render(<SectorGoalsShow />)

    const levels = screen.getByRole('radiogroup', { name: 'Nível da meta' })
    expect(within(levels).getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByRole('radio', { name: /Médio/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('O padrão do mercado.')).toBeInTheDocument()
    expect(
      screen.getByText('Comece por um nível de mercado e ajuste com a referência dos seus veteranos.'),
    ).toBeInTheDocument()
  })

  it('moves every ruler to the target of the chosen level', async () => {
    render(<SectorGoalsShow />)

    await userEvent.click(screen.getByRole('radio', { name: /Difícil/ }))

    expect(screen.getByRole('radio', { name: /Difícil/ })).toHaveAttribute('aria-checked', 'true')
    expect(ruler('Comunicação').value).toBe('90')
    expect(ruler('Sistema de Pedidos').value).toBe('90')
  })

  it('marks the level as Personalizado when a ruler is moved by hand', async () => {
    render(<SectorGoalsShow />)

    fireEvent.change(ruler('Comunicação'), { target: { value: '82' } })

    expect(screen.getByText('Meta: 82 pts')).toBeInTheDocument()
    expect(screen.getByText('Personalizado')).toBeInTheDocument()
    expect(within(screen.getByRole('radio', { name: /Médio/ })).getByText('ajustado')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('radio', { name: /Médio/ }))

    expect(ruler('Comunicação').value).toBe('75')
    expect(screen.queryByText('ajustado')).not.toBeInTheDocument()
  })

  it('shows the veterans average as a reference, not as the goal', () => {
    render(<SectorGoalsShow />)

    expect(screen.getAllByText('Referência dos seus veteranos:')[0]).toBeInTheDocument()
    expect(screen.getByText('88 pts')).toBeInTheDocument()
    expect(screen.queryByText(/calculada/)).not.toBeInTheDocument()
  })

  it('links each sector tab to its goal', () => {
    render(<SectorGoalsShow />)

    expect(screen.getByRole('link', { name: 'Comercial' })).toHaveAttribute(
      'href',
      '/management/sector_goal?sector=Comercial',
    )
    expect(screen.getByRole('link', { name: 'Atendimento' })).toHaveAttribute('aria-current', 'page')
  })

  it('saves the goal as a simulation', async () => {
    render(<SectorGoalsShow />)

    await userEvent.click(screen.getByRole('button', { name: /Salvar meta/ }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Meta de Atendimento salva no nível Médio (simulação).',
    )
  })

  describe('when the sector has no goal yet', () => {
    beforeEach(() => {
      page.props = { sector_goal: sectorWithoutGoal, manager }
    })

    it('asks to pick a level first and keeps inviting veterans as a secondary step', () => {
      render(<SectorGoalsShow />)

      expect(screen.getByRole('heading', { name: 'Logística ainda não tem meta' })).toBeInTheDocument()
      expect(
        screen.getAllByRole('radio').every((radio) => radio.getAttribute('aria-checked') === 'false'),
      ).toBe(true)
      expect(screen.queryByLabelText('Meta de Conferência')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Convidar veteranos/ })).toBeInTheDocument()
    })

    it('shows the rulers once a level is picked', async () => {
      render(<SectorGoalsShow />)

      await userEvent.click(screen.getByRole('radio', { name: /Fácil/ }))

      expect(ruler('Conferência').value).toBe('60')
      expect(screen.queryByRole('heading', { name: 'Logística ainda não tem meta' })).not.toBeInTheDocument()
    })
  })
})

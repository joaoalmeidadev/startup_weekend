import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, sectorGoal } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import SectorGoalsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('SectorGoalsShow', () => {
  beforeEach(() => {
    page.url = '/management/sector_goal'
    page.props = { sector_goal: sectorGoal, manager }
  })

  it('shows the experts average next to the current goal', () => {
    render(<SectorGoalsShow />)

    expect(screen.getByText('Média dos experientes (88 pts)')).toBeInTheDocument()
    expect(screen.getByText('80 pts')).toBeInTheDocument()
  })

  it('links each sector tab to its goal', () => {
    render(<SectorGoalsShow />)

    expect(screen.getByRole('link', { name: 'Comercial' })).toHaveAttribute(
      'href',
      '/management/sector_goal?sector=Comercial',
    )
    expect(screen.getByRole('link', { name: 'Atendimento' })).toHaveAttribute('aria-current', 'page')
  })

  it('asks to invite experts when the sector has no goal yet', () => {
    page.props = {
      sector_goal: { ...sectorGoal, sector: 'Logística', experts_count: 0, competencies: [] },
      manager,
    }
    render(<SectorGoalsShow />)

    expect(screen.getByRole('heading', { name: 'Logística ainda não tem meta' })).toBeInTheDocument()
  })

  it('moves the goal with the ruler', () => {
    render(<SectorGoalsShow />)

    fireEvent.change(screen.getByLabelText('Meta de Comunicação'), { target: { value: '92' } })

    expect(screen.getByText('92 pts')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { progress, viewer } from '@/test/collaboratorFixtures'
import { page } from '@/test/inertiaMock'
import ProgressesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('ProgressesShow', () => {
  beforeEach(() => {
    page.url = '/collaborator/progress'
    page.props = { progress, viewer }
  })

  it('counts the earned badges and marks the locked one', () => {
    render(<ProgressesShow />)

    expect(screen.getByText('1 de 2')).toBeInTheDocument()
    expect(screen.getByText('Em breve')).toBeInTheDocument()
  })

  it('shows how many modules are done in the whole journey', () => {
    render(<ProgressesShow />)

    expect(screen.getByText('1 de 3 módulos concluídos')).toBeInTheDocument()
  })

  it('shows the evolution of each stretch: Base, Empresa and Setor', () => {
    render(<ProgressesShow />)

    const bars = screen.getAllByRole('progressbar')
    expect(bars.map((bar) => bar.getAttribute('aria-label'))).toEqual(['Base', 'Empresa', 'Setor'])
    expect(bars[0]).toHaveAttribute('aria-valuenow', '1')
    expect(bars[0]).toHaveAttribute('aria-valuemax', '1')
    expect(bars[1]).toHaveAttribute('aria-valuenow', '0')
  })
})

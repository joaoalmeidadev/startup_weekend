import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DonutChart, sliceColor } from './DonutChart'
import { CHART } from './colors'

const slices = [
  { label: 'Atendimento', value: 74 },
  { label: 'Comercial', value: 23 },
  { label: 'Logística', value: 6 },
]

describe('DonutChart', () => {
  it('draws one labelled slice per row, with its share of the total', () => {
    render(<DonutChart label="Estudo por setor" slices={slices} unit="h" />)

    const chart = within(screen.getByRole('group', { name: 'Estudo por setor' }))
    expect(chart.getByLabelText('Atendimento: 74 h (72%)')).toBeInTheDocument()
    expect(chart.getByLabelText('Comercial: 23 h (22%)')).toBeInTheDocument()
    expect(chart.getByLabelText('Logística: 6 h (6%)')).toBeInTheDocument()
  })

  it('puts the total in the center', () => {
    render(<DonutChart label="Estudo por setor" slices={slices} unit="h" />)

    expect(screen.getByText('103 h')).toBeInTheDocument()
  })

  it('labels each slice directly with its share', () => {
    render(<DonutChart label="Estudo por setor" slices={slices} unit="h" />)

    expect(screen.getByText('Atendimento 72%')).toBeInTheDocument()
    expect(screen.getByText('Logística 6%')).toBeInTheDocument()
  })

  it('tells the value of a slice on hover or focus', () => {
    render(<DonutChart label="Estudo por setor" slices={slices} unit="h" />)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    fireEvent.focus(screen.getByLabelText('Comercial: 23 h (22%)'))
    expect(screen.getByRole('tooltip')).toHaveTextContent('Comercial: 23 h (22%)')

    fireEvent.blur(screen.getByLabelText('Comercial: 23 h (22%)'))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('skips empty slices', () => {
    render(<DonutChart label="Estudo" slices={[...slices, { label: 'Staff', value: 0 }]} unit="h" />)

    expect(screen.queryByLabelText(/Staff/)).not.toBeInTheDocument()
  })

  it('colors slices in the fixed categorical order and Outros in neutral gray', () => {
    expect(sliceColor('Carla', 0)).toBe(CHART.slices[0])
    expect(sliceColor('Lucas', 3)).toBe(CHART.slices[3])
    expect(sliceColor('Outros', 4)).toBe(CHART.others)
  })
})

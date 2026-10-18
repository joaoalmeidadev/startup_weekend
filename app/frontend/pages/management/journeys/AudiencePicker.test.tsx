import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { audienceOptions } from '@/test/managementFixtures'
import type { JourneyAudience } from '@/types/management'
import { AudiencePicker } from './AudiencePicker'
import { audienceChips } from './audience'

const PEOPLE = ['Maria Souza', 'Marcos Oliveira', 'Paula Santos']

function Picker({ initial }: { initial: JourneyAudience }) {
  const [audience, setAudience] = useState(initial)
  return (
    <>
      <AudiencePicker options={audienceOptions} people={PEOPLE} value={audience} onChange={setAudience} />
      <output>{audienceChips(audience, audienceOptions).join(' | ')}</output>
    </>
  )
}

describe('AudiencePicker', () => {
  it('picks sectors and groups, telling groups apart and how many people each has', async () => {
    render(<Picker initial={{ type: 'sectors', names: ['Atendimento'] }} />)

    expect(screen.getByRole('radio', { name: 'Setores e grupos' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /Atendimento/ })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /Staff/ })).toHaveAccessibleName(/Grupo.*4 pessoas/)

    await userEvent.click(screen.getByRole('checkbox', { name: /Staff/ }))
    await userEvent.click(screen.getByRole('checkbox', { name: /Atendimento/ }))

    expect(screen.getByRole('status')).toHaveTextContent('Staff · Grupo')
  })

  it('picks specific people, searching by name', async () => {
    render(<Picker initial={{ type: 'sectors', names: ['Atendimento'] }} />)

    await userEvent.click(screen.getByRole('radio', { name: 'Pessoas específicas' }))
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)

    await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar pessoa' }), 'mar')
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
    expect(screen.queryByRole('checkbox', { name: 'Paula Santos' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('checkbox', { name: 'Maria Souza' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Marcos Oliveira' }))

    expect(screen.getByRole('status')).toHaveTextContent('2 pessoas')
  })

  it('says when the search finds nobody', async () => {
    render(<Picker initial={{ type: 'people', names: [] }} />)

    await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar pessoa' }), 'zé')

    expect(screen.getByText('Ninguém com esse nome.')).toBeInTheDocument()
  })
})

describe('audienceChips', () => {
  it('names one person in the singular', () => {
    expect(audienceChips({ type: 'people', names: ['Maria Souza'] }, audienceOptions)).toEqual(['1 pessoa'])
  })
})

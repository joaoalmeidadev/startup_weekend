import { describe, expect, it } from 'vitest'
import { catalog, journey } from '@/test/managementFixtures'
import { addModule, moduleIds, moveModule, removeModule } from './journeyEditing'

const baseIds = (stretches: typeof journey.stretches) => stretches[0].modules.map((m) => m.id)
const postura = catalog[0].modules[2]

describe('journeyEditing', () => {
  it('swaps a module with its neighbour inside the stretch', () => {
    expect(baseIds(moveModule(journey.stretches, 'base', 1, -1))).toEqual(['matematica', 'conversa-clara'])
  })

  it('ignores moves past the edges', () => {
    expect(moveModule(journey.stretches, 'base', 0, -1)).toEqual(journey.stretches)
  })

  it('appends a module to the end of the stretch', () => {
    expect(baseIds(addModule(journey.stretches, 'base', postura))).toEqual([
      'conversa-clara',
      'matematica',
      'postura-e-empatia',
    ])
  })

  it('removes a module from its stretch', () => {
    expect(baseIds(removeModule(journey.stretches, 'base', 'conversa-clara'))).toEqual(['matematica'])
  })

  it('lists the ids of every module in the journey', () => {
    expect(moduleIds(journey.stretches)).toEqual(
      new Set(['conversa-clara', 'matematica', 'rotinas-de-atendimento']),
    )
  })
})

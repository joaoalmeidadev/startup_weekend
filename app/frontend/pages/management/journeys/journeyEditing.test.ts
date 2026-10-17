import { describe, expect, it } from 'vitest'
import { journey, library } from '@/test/managementFixtures'
import { addModule, moveModule } from './journeyEditing'

const baseIds = (stretches: typeof journey.stretches) => stretches[0].modules.map((m) => m.id)

describe('journeyEditing', () => {
  it('swaps a module with its neighbour inside the stretch', () => {
    expect(baseIds(moveModule(journey.stretches, 'base', 1, -1))).toEqual(['matematica', 'conversa-clara'])
  })

  it('ignores moves past the edges', () => {
    expect(moveModule(journey.stretches, 'base', 0, -1)).toEqual(journey.stretches)
  })

  it('appends a module to the end of the stretch', () => {
    expect(baseIds(addModule(journey.stretches, 'base', library[0]))).toEqual([
      'conversa-clara',
      'matematica',
      'escrita-no-trabalho',
    ])
  })
})

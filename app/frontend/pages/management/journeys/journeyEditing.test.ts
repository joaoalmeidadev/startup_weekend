import { describe, expect, it } from 'vitest'
import { catalog, journey } from '@/test/managementFixtures'
import { addModule, moduleIds, moveModule, removeModule } from './journeyEditing'

const ids = (modules: typeof journey.modules) => modules.map((m) => m.id)
const postura = catalog[0].modules[2]

describe('journeyEditing', () => {
  it('swaps a module with its neighbour', () => {
    expect(ids(moveModule(journey.modules, 1, -1))).toEqual([
      'matematica',
      'conversa-clara',
      'rotinas-de-atendimento',
    ])
  })

  it('ignores moves past the edges', () => {
    expect(moveModule(journey.modules, 0, -1)).toEqual(journey.modules)
    expect(moveModule(journey.modules, 2, 1)).toEqual(journey.modules)
  })

  it('appends a module to the end of the journey', () => {
    expect(ids(addModule(journey.modules, postura))).toEqual([
      'conversa-clara',
      'matematica',
      'rotinas-de-atendimento',
      'postura-e-empatia',
    ])
  })

  it('removes a module', () => {
    expect(ids(removeModule(journey.modules, 'conversa-clara'))).toEqual([
      'matematica',
      'rotinas-de-atendimento',
    ])
  })

  it('lists the ids of every module in the journey', () => {
    expect(moduleIds(journey.modules)).toEqual(
      new Set(['conversa-clara', 'matematica', 'rotinas-de-atendimento']),
    )
  })
})

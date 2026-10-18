import { describe, expect, it } from 'vitest'
import { normalize, slugify } from './text'

describe('text helpers', () => {
  it('compares names ignoring accents and case', () => {
    expect(normalize('Zé Lógica')).toBe('ze logica')
  })

  it('turns a sector name into its address, like Rails parameterize', () => {
    expect(slugify('Logística')).toBe('logistica')
    expect(slugify('Atendimento ao Cliente')).toBe('atendimento-ao-cliente')
  })
})

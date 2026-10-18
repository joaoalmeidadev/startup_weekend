import { describe, expect, it } from 'vitest'
import { canSubmit, emptyDraft, withMaterial, type ContentDraft } from './contentDraft'

const draft = (overrides: Partial<ContentDraft>): ContentDraft => ({
  ...emptyDraft(),
  name: 'Trocas',
  ...overrides,
})

describe('contentDraft', () => {
  it('starts with a file sent to the AI', () => {
    expect(emptyDraft()).toMatchObject({ material: 'file', origin: 'ai', fileName: null })
  })

  it('preselects the origin that matches the material', () => {
    expect(withMaterial(emptyDraft(), 'lessons').origin).toBe('company')
    expect(withMaterial(draft({ material: 'lessons', origin: 'company' }), 'file').origin).toBe('ai')
  })

  it('always needs a name', () => {
    expect(canSubmit(draft({ name: '  ', fileName: 'a.pdf' }))).toBe(false)
  })

  it('needs a file for the AI, even when the lessons are written', () => {
    expect(canSubmit(draft({ fileName: 'a.pdf' }))).toBe(true)
    expect(canSubmit(draft({ material: 'lessons', lessons: [{ title: 'Um', text: '' }] }))).toBe(false)
  })

  it('needs a file or one titled lesson for a company product', () => {
    expect(canSubmit(draft({ origin: 'company' }))).toBe(false)
    expect(canSubmit(draft({ origin: 'company', fileName: 'a.pdf' }))).toBe(true)
    const lessons = (title: string) =>
      draft({ origin: 'company', material: 'lessons', lessons: [{ title, text: '' }] })
    expect(canSubmit(lessons(' '))).toBe(false)
    expect(canSubmit(lessons('Um'))).toBe(true)
  })
})

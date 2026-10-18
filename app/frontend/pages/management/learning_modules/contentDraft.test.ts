import { describe, expect, it } from 'vitest'
import {
  canSubmit,
  chosenCompetency,
  emptyDraft,
  NEW_COMPETENCY,
  withMaterial,
  type ContentDraft,
} from './contentDraft'

const draft = (overrides: Partial<ContentDraft>): ContentDraft => ({
  ...emptyDraft(),
  name: 'Trocas',
  competency: 'Comunicação',
  hours: '4',
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

  it('needs the competency the content trains', () => {
    expect(canSubmit(draft({ fileName: 'a.pdf', competency: '' }))).toBe(false)
  })

  it('accepts a new competency written as a single word', () => {
    const fresh = (newCompetency: string) =>
      draft({ fileName: 'a.pdf', competency: NEW_COMPETENCY, newCompetency })

    expect(chosenCompetency(fresh(' Pontualidade '))).toBe('Pontualidade')
    expect(canSubmit(fresh('Pontualidade'))).toBe(true)
    expect(canSubmit(fresh('Boa vontade'))).toBe(false)
    expect(canSubmit(fresh(''))).toBe(false)
  })

  it('needs the hours of in-person training the content replaces', () => {
    expect(canSubmit(draft({ fileName: 'a.pdf', hours: '' }))).toBe(false)
    expect(canSubmit(draft({ fileName: 'a.pdf', hours: '0' }))).toBe(false)
    expect(canSubmit(draft({ fileName: 'a.pdf', hours: '1.5' }))).toBe(true)
  })

  it('starts who would give the training at the company default', () => {
    expect(emptyDraft(4400)).toMatchObject({ hours: '', teacherSalary: 4400 })
  })
})

import { describe, expect, it } from 'vitest'
import {
  canSubmit,
  chosenCompetency,
  emptyDraft,
  emptyLesson,
  lessonGap,
  NEW_COMPETENCY,
  withMaterial,
  type ContentDraft,
  type LessonQuestion,
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
    expect(canSubmit(draft({ material: 'lessons', lessons: [{ ...emptyLesson(), title: 'Um' }] }))).toBe(
      false,
    )
  })

  it('needs a file or one titled lesson for a company product', () => {
    expect(canSubmit(draft({ origin: 'company' }))).toBe(false)
    expect(canSubmit(draft({ origin: 'company', fileName: 'a.pdf' }))).toBe(true)
    const answeredQuestion = {
      prompt: 'P?',
      options: ['a', 'b', 'c'] as [string, string, string],
      correct: 1 as const,
      explanation: '',
    }
    const lessons = (title: string) =>
      draft({
        origin: 'company',
        material: 'lessons',
        lessons: [{ title, text: '', question: answeredQuestion }],
      })
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

  describe('answer key of written lessons', () => {
    const answered = {
      title: 'Quando aceitar a troca',
      text: 'Até 30 dias, com nota.',
      question: {
        prompt: 'O cliente quer trocar após 10 dias. O que fazer?',
        options: ['Aceitar se tiver nota', 'Recusar sempre', 'Trocar sem olhar'] as [string, string, string],
        correct: 0 as LessonQuestion['correct'],
        explanation: '',
      },
    }
    const written = (lesson: Partial<typeof answered>) =>
      draft({ material: 'lessons', origin: 'company', lessons: [{ ...answered, ...lesson }] })

    it('saves a written lesson only with its question, three options and the right one', () => {
      expect(canSubmit(written({}))).toBe(true)
      expect(canSubmit(written({ question: { ...answered.question, prompt: ' ' } }))).toBe(false)
      expect(canSubmit(written({ question: { ...answered.question, options: ['a', '', 'c'] } }))).toBe(false)
      expect(canSubmit(written({ question: { ...answered.question, correct: null } }))).toBe(false)
    })

    it('tells what is missing in which lesson', () => {
      expect(lessonGap(written({}))).toBeNull()
      expect(lessonGap(written({ question: { ...answered.question, prompt: '' } }))).toBe(
        'Escreva a pergunta da lição 1.',
      )
      expect(lessonGap(written({ question: { ...answered.question, options: ['a', '', 'c'] } }))).toBe(
        'Preencha as 3 alternativas da lição 1.',
      )
      expect(lessonGap(written({ question: { ...answered.question, correct: null } }))).toBe(
        'Marque a resposta correta da lição 1.',
      )
    })

    it('starts each lesson with three empty options and no right answer', () => {
      expect(emptyLesson().question).toEqual({
        prompt: '',
        options: ['', '', ''],
        correct: null,
        explanation: '',
      })
    })
  })
})

import { isSingleWord } from '@/lib/text'

export type Material = 'file' | 'lessons'
export type Origin = 'ai' | 'company'
// The answer key of a lesson: one question, three options and the right one, to know the person understood
export type LessonQuestion = {
  prompt: string
  options: [string, string, string]
  correct: 0 | 1 | 2 | null
  explanation: string
}
export type DraftLesson = { title: string; text: string; question: LessonQuestion }

export type ContentDraft = {
  name: string
  material: Material
  fileName: string | null
  lessons: DraftLesson[]
  origin: Origin
  competency: string
  newCompetency: string
  // In-person training this content replaces: how long it takes and the salary of who would give it
  hours: string
  teacherSalary: number
}

// The option that lets the manager type a competency that is not in any goal yet
export const NEW_COMPETENCY = 'new'

const ORIGIN_FOR: Record<Material, Origin> = { file: 'ai', lessons: 'company' }

export const emptyLesson = (): DraftLesson => ({
  title: '',
  text: '',
  question: { prompt: '', options: ['', '', ''], correct: null, explanation: '' },
})

export function emptyDraft(teacherSalary = 0): ContentDraft {
  return {
    name: '',
    material: 'file',
    fileName: null,
    lessons: [emptyLesson()],
    origin: 'ai',
    competency: '',
    newCompetency: '',
    hours: '',
    teacherSalary,
  }
}

// Switching the material suggests its usual origin; the manager may still change it
export function withMaterial(draft: ContentDraft, material: Material): ContentDraft {
  return { ...draft, material, origin: ORIGIN_FOR[material] }
}

export function needsFileForAi(draft: ContentDraft) {
  return draft.origin === 'ai' && draft.material === 'lessons'
}

const written = (draft: ContentDraft) => draft.lessons.filter((lesson) => lesson.title.trim() !== '')

function gapOf({ question }: DraftLesson, number: number) {
  if (question.prompt.trim() === '') return `Escreva a pergunta da lição ${number}.`
  if (question.options.some((option) => option.trim() === ''))
    return `Preencha as 3 alternativas da lição ${number}.`
  if (question.correct === null) return `Marque a resposta correta da lição ${number}.`
  return null
}

// The first lesson (with a title) still missing its answer key, said in plain words; null when all are complete
export function lessonGap(draft: ContentDraft) {
  if (draft.material !== 'lessons') return null
  for (const [index, lesson] of draft.lessons.entries()) {
    if (lesson.title.trim() === '') continue
    const gap = gapOf(lesson, index + 1)
    if (gap) return gap
  }
  return null
}

function hasMaterial(draft: ContentDraft) {
  if (draft.material === 'file') return draft.fileName !== null
  return draft.origin === 'company' && written(draft).length > 0 && lessonGap(draft) === null
}

export function chosenCompetency(draft: ContentDraft) {
  return draft.competency === NEW_COMPETENCY ? draft.newCompetency.trim() : draft.competency
}

export function canSubmit(draft: ContentDraft) {
  return (
    draft.name.trim() !== '' &&
    hasMaterial(draft) &&
    isSingleWord(chosenCompetency(draft)) &&
    Number(draft.hours) > 0
  )
}

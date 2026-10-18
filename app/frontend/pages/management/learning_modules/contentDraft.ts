export type Material = 'file' | 'lessons'
export type Origin = 'ai' | 'company'
export type DraftLesson = { title: string; text: string }

export type ContentDraft = {
  name: string
  material: Material
  fileName: string | null
  lessons: DraftLesson[]
  origin: Origin
  competency: string
  newCompetency: string
}

// The option that lets the manager type a competency that is not in any goal yet
export const NEW_COMPETENCY = 'new'

const ORIGIN_FOR: Record<Material, Origin> = { file: 'ai', lessons: 'company' }

export const emptyLesson = (): DraftLesson => ({ title: '', text: '' })

export function emptyDraft(): ContentDraft {
  return {
    name: '',
    material: 'file',
    fileName: null,
    lessons: [emptyLesson()],
    origin: 'ai',
    competency: '',
    newCompetency: '',
  }
}

// Switching the material suggests its usual origin; the manager may still change it
export function withMaterial(draft: ContentDraft, material: Material): ContentDraft {
  return { ...draft, material, origin: ORIGIN_FOR[material] }
}

export function needsFileForAi(draft: ContentDraft) {
  return draft.origin === 'ai' && draft.material === 'lessons'
}

function hasMaterial(draft: ContentDraft) {
  if (draft.material === 'file') return draft.fileName !== null
  return draft.origin === 'company' && draft.lessons.some((lesson) => lesson.title.trim() !== '')
}

export const isSingleWord = (text: string) => /^\p{L}+$/u.test(text)

export function chosenCompetency(draft: ContentDraft) {
  return draft.competency === NEW_COMPETENCY ? draft.newCompetency.trim() : draft.competency
}

export function canSubmit(draft: ContentDraft) {
  return draft.name.trim() !== '' && hasMaterial(draft) && isSingleWord(chosenCompetency(draft))
}

import type { LessonReview, LessonStep } from '@/types/management'

export type Lesson = LessonReview['lesson']
export type LessonDraft = { title: string; intro: string; steps: string[] }

// One editable line per step: "Title: body 'quote'"
export function stepToText(step: LessonStep) {
  const quote = step.quote ? ` '${step.quote}'` : ''
  return `${step.title} ${step.body}${quote}`
}

export function textToStep(text: string): LessonStep {
  const colon = text.indexOf(':')
  if (colon === -1) return { title: '', body: text.trim() }
  return { title: text.slice(0, colon + 1).trim(), body: text.slice(colon + 1).trim() }
}

export function toDraft(lesson: Lesson): LessonDraft {
  return { title: lesson.title, intro: lesson.intro, steps: lesson.steps.map(stepToText) }
}

export function applyDraft(lesson: Lesson, draft: LessonDraft): Lesson {
  return {
    ...lesson,
    title: draft.title.trim(),
    intro: draft.intro.trim(),
    steps: draft.steps.map(textToStep),
  }
}

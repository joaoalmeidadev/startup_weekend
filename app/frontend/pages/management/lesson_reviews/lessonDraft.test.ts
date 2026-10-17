import { describe, expect, it } from 'vitest'
import { applyDraft, stepToText, textToStep, toDraft } from './lessonDraft'

describe('lessonDraft', () => {
  it('turns a step into one editable line and back', () => {
    const text = stepToText({ title: 'Acolha com calma:', body: 'diga', quote: 'Compreendo.' })

    expect(text).toBe("Acolha com calma: diga 'Compreendo.'")
    expect(textToStep(text)).toEqual({ title: 'Acolha com calma:', body: "diga 'Compreendo.'" })
  })

  it('keeps a line without a colon as plain body', () => {
    expect(textToStep('  Só o texto ')).toEqual({ title: '', body: 'Só o texto' })
  })

  it('applies an edited draft to the lesson, keeping the reading time', () => {
    const lesson = { minutes: 5, title: 'Antigo', intro: 'Intro', steps: [{ title: 'A:', body: 'b' }] }
    const draft = { ...toDraft(lesson), title: '  Novo título ' }

    expect(applyDraft(lesson, draft)).toEqual({ ...lesson, title: 'Novo título' })
  })
})

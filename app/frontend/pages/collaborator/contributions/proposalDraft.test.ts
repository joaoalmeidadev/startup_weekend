import { describe, expect, it } from 'vitest'
import {
  emptyProposal,
  estimatedPoints,
  missingItems,
  type ProposalDraft,
  type ProposalLesson,
} from './proposalDraft'

const completeLesson = (overrides: Partial<ProposalLesson> = {}): ProposalLesson => ({
  title: 'Ouvir sem interromper',
  text: 'Deixe o cliente terminar.',
  format: 'text',
  mediaName: null,
  question: { prompt: 'Primeiro passo?', options: ['Ouvir', 'Falar', 'Sair'], correct: 0 },
  ...overrides,
})

const completeDraft = (overrides: Partial<ProposalDraft> = {}): ProposalDraft => ({
  name: 'Clientes difíceis',
  sector: 'Atendimento',
  hours: '2',
  lessons: [completeLesson()],
  ...overrides,
})

describe('estimatedPoints', () => {
  it('multiplies the hours by what her hour is worth, rounded', () => {
    expect(estimatedPoints('2', 3.8)).toBe(8)
    expect(estimatedPoints('1,5', 3.8)).toBe(6)
  })

  it('is zero without valid hours', () => {
    expect(estimatedPoints('', 3.8)).toBe(0)
    expect(estimatedPoints('-1', 3.8)).toBe(0)
  })
})

describe('missingItems', () => {
  it('is empty for a complete proposal', () => {
    expect(missingItems(completeDraft())).toEqual([])
  })

  it('says everything a blank proposal still needs', () => {
    expect(missingItems(emptyProposal())).toEqual([
      'Dê um nome para a jornada.',
      'Escolha para quem é.',
      'Diga quanto tempo levaria para ensinar.',
      'Dê um título para a lição 1.',
    ])
  })

  it('asks for the file of a media lesson', () => {
    expect(missingItems(completeDraft({ lessons: [completeLesson({ format: 'video' })] }))).toEqual([
      'Envie o vídeo da lição 1.',
    ])
  })

  it('asks for the text, the question, the 3 options and the right answer, one lesson at a time', () => {
    const lesson = completeLesson({
      text: ' ',
      question: { prompt: 'Primeiro?', options: ['A', '', 'C'], correct: null },
    })
    expect(missingItems(completeDraft({ lessons: [completeLesson(), lesson] }))).toEqual([
      'Escreva o texto da lição 2.',
    ])
    expect(missingItems(completeDraft({ lessons: [{ ...lesson, text: 'Ok' }] }))).toEqual([
      'Preencha as 3 alternativas da lição 1.',
    ])
    const unmarked = {
      ...lesson,
      text: 'Ok',
      question: { ...lesson.question, options: ['A', 'B', 'C'] as [string, string, string] },
    }
    expect(missingItems(completeDraft({ lessons: [unmarked] }))).toEqual([
      'Marque a resposta certa da lição 1.',
    ])
  })
})

// A journey the collaborator proposes. Mirrors the admin lesson rules (management contentDraft): each lesson teaches
// in a text or a file and ends with one question, three options and the right one
export type ProposalFormat = 'text' | 'video' | 'audio' | 'image'
export type ProposalQuestion = {
  prompt: string
  options: [string, string, string]
  correct: 0 | 1 | 2 | null
}
export type ProposalLesson = {
  title: string
  text: string
  format: ProposalFormat
  mediaName: string | null
  question: ProposalQuestion
}
export type ProposalDraft = { name: string; sector: string; hours: string; lessons: ProposalLesson[] }

// The file each media format asks for, as said in "Envie o vídeo"
export const MEDIA_FILE: Record<Exclude<ProposalFormat, 'text'>, string> = {
  video: 'o vídeo',
  audio: 'o áudio',
  image: 'a imagem',
}

export const emptyProposalLesson = (): ProposalLesson => ({
  title: '',
  text: '',
  format: 'text',
  mediaName: null,
  question: { prompt: '', options: ['', '', ''], correct: null },
})

export const emptyProposal = (): ProposalDraft => ({
  name: '',
  sector: '',
  hours: '',
  lessons: [emptyProposalLesson()],
})

// Accepts "1,5" as typed on a Brazilian keyboard; anything invalid counts as zero hours
export const parseHours = (hours: string) => {
  const value = Number(hours.replace(',', '.'))
  return Number.isFinite(value) && value > 0 ? value : 0
}

// What she may earn if approved; the admin decides the final points
export const estimatedPoints = (hours: string, pointsPerHour: number) =>
  Math.round(parseHours(hours) * pointsPerHour)

const blank = (text: string) => text.trim() === ''

function lessonGap({ title, text, format, mediaName, question }: ProposalLesson, number: number) {
  if (blank(title)) return `Dê um título para a lição ${number}.`
  if (format !== 'text' && mediaName === null) return `Envie ${MEDIA_FILE[format]} da lição ${number}.`
  if (blank(text)) return `Escreva o texto da lição ${number}.`
  if (blank(question.prompt)) return `Escreva a pergunta da lição ${number}.`
  if (question.options.some(blank)) return `Preencha as 3 alternativas da lição ${number}.`
  if (question.correct === null) return `Marque a resposta certa da lição ${number}.`
  return null
}

// What still keeps the proposal from being sent, in plain words (one item per lesson); empty when it is ready
export function missingItems(draft: ProposalDraft) {
  const fields = [
    blank(draft.name) && 'Dê um nome para a jornada.',
    blank(draft.sector) && 'Escolha para quem é.',
    parseHours(draft.hours) === 0 && 'Diga quanto tempo levaria para ensinar.',
  ]
  const lessons = draft.lessons.map((lesson, index) => lessonGap(lesson, index + 1))
  return [...fields, ...lessons].filter((item): item is string => typeof item === 'string')
}

import type { LessonFormat } from '@/types/management'

type FormatInfo = { label: string; one: string; many: string; icon: string }

export const LESSON_FORMATS: Record<LessonFormat, FormatInfo> = {
  video: { label: 'Vídeo', one: 'vídeo', many: 'vídeos', icon: 'play_circle' },
  audio: { label: 'Áudio', one: 'áudio', many: 'áudios', icon: 'headphones' },
  image: { label: 'Imagem', one: 'imagem', many: 'imagens', icon: 'image' },
  text: { label: 'Texto', one: 'texto', many: 'textos', icon: 'article' },
  quiz: { label: 'Quiz', one: 'quiz', many: 'quizzes', icon: 'quiz' },
}

const ORDER = Object.keys(LESSON_FORMATS) as LessonFormat[]

// e.g. "1 vídeo · 1 áudio · 2 textos"
export function formatSummary(formats: Partial<Record<LessonFormat, number>>) {
  return ORDER.filter((format) => (formats[format] ?? 0) > 0)
    .map((format) => {
      const count = formats[format] as number
      const { one, many } = LESSON_FORMATS[format]
      return `${count} ${count === 1 ? one : many}`
    })
    .join(' · ')
}

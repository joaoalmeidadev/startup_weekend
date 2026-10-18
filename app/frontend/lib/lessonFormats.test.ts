import { describe, expect, it } from 'vitest'
import { formatSummary } from './lessonFormats'

describe('formatSummary', () => {
  it('lists the formats in a fixed order, pluralized, without zeros', () => {
    expect(formatSummary({ text: 2, audio: 1, video: 1, image: 0 })).toBe('1 vídeo · 1 áudio · 2 textos')
  })

  it('pluralizes every format', () => {
    expect(formatSummary({ video: 2, audio: 3, image: 2, quiz: 2 })).toBe(
      '2 vídeos · 3 áudios · 2 imagens · 2 quizzes',
    )
  })

  it('says nothing when there are no lessons', () => {
    expect(formatSummary({})).toBe('')
  })
})

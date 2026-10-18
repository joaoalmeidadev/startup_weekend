import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import type { LearningModule } from '@/types/management'

type Lesson = LearningModule['lessons'][number]

function VideoPreview({ lesson }: { lesson: Lesson }) {
  const notify = useMockNotice()
  return (
    <figure
      aria-label={`Vídeo da lição ${lesson.position}`}
      className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-primary to-primary-container"
    >
      <button
        type="button"
        aria-label={`Ver prévia do vídeo da lição ${lesson.position}`}
        onClick={() => notify('Prévia do vídeo (simulação).')}
        className="flex size-16 items-center justify-center rounded-full bg-surface-container-lowest/90 text-primary shadow-lg transition-transform hover:scale-105"
      >
        <Icon name="play_arrow" className="text-[2.5rem]" />
      </button>
      <span className="absolute right-space-sm bottom-space-sm rounded-md bg-on-surface/70 px-space-xs py-0.5 text-label-sm text-inverse-on-surface">
        {lesson.duration}
      </span>
    </figure>
  )
}

function AudioPreview({ lesson }: { lesson: Lesson }) {
  const notify = useMockNotice()
  return (
    <figure
      aria-label={`Áudio da lição ${lesson.position}`}
      className="flex items-center gap-space-sm rounded-xl bg-surface-container p-space-sm"
    >
      <button
        type="button"
        aria-label={`Ouvir prévia do áudio da lição ${lesson.position}`}
        onClick={() => notify('Prévia do áudio (simulação).')}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary"
      >
        <Icon name="play_arrow" className="text-[1.5rem]" />
      </button>
      <span className="h-1 flex-1 rounded-full bg-surface-container-highest">
        <span className="block h-full w-1/3 rounded-full bg-primary" />
      </span>
      <span className="text-label-sm text-on-surface-variant">{lesson.duration}</span>
    </figure>
  )
}

const BARS = [40, 70, 55, 90]

// A simple chart drawn on the page, standing in for the lesson's infographic
function ImagePreview({ lesson }: { lesson: Lesson }) {
  return (
    <figure
      aria-label={`Infográfico da lição ${lesson.position}`}
      className="flex flex-col gap-space-xs rounded-xl bg-surface-container p-space-md"
    >
      <svg viewBox="0 0 200 100" aria-hidden="true" className="h-32 w-full text-primary">
        <circle cx="30" cy="50" r="22" className="fill-current opacity-20" />
        <circle cx="30" cy="50" r="12" className="fill-current" />
        {BARS.map((height, index) => (
          <rect
            key={index}
            x={80 + index * 28}
            y={95 - height}
            width="18"
            height={height}
            rx="3"
            className="fill-current"
            opacity={0.4 + index * 0.2}
          />
        ))}
      </svg>
      <figcaption className="text-label-sm text-on-surface-variant">Infográfico</figcaption>
    </figure>
  )
}

const PREVIEWS = { video: VideoPreview, audio: AudioPreview, image: ImagePreview }

// What the lesson looks like for the person: the media cover (when it has one), the credit and the text
export function LessonPreview({ lesson }: { lesson: Lesson }) {
  const Preview = lesson.format in PREVIEWS ? PREVIEWS[lesson.format as keyof typeof PREVIEWS] : null
  return (
    <>
      {Preview && <Preview lesson={lesson} />}
      {lesson.credit && <p className="text-body-sm text-on-surface-variant">{lesson.credit}</p>}
      {lesson.format !== 'quiz' && <p className="text-body-md text-on-surface">{lesson.text}</p>}
    </>
  )
}

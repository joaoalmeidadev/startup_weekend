import { Head, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { PrimaryButton } from '@/components/PrimaryButton'
import { FocusLayout } from '@/layouts/FocusLayout'
import type { MicroLesson } from '@/types/collaborator'
import { LessonComplete } from './LessonComplete'
import { QuestionStep } from './QuestionStep'

const STEPS = ['video', 'explanation', 'question', 'done'] as const
type Step = (typeof STEPS)[number]

function VideoStep({ lesson, onNext }: { lesson: MicroLesson; onNext: () => void }) {
  const notify = useMockNotice()
  return (
    <>
      <span className="text-label-lg text-on-surface-variant">
        {lesson.minutes} min · {lesson.module_name}
      </span>
      <h1 className="text-headline-lg text-on-surface">{lesson.video.title}</h1>
      <button
        type="button"
        aria-label="Assistir ao vídeo"
        onClick={() => notify('Aqui toca o vídeo de até 2 minutos.')}
        className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-primary"
      >
        <span className="flex size-20 items-center justify-center rounded-full bg-on-primary/90 text-primary">
          <Icon name="play_arrow" filled className="text-[3rem]" />
        </span>
        <span className="absolute right-3 bottom-3 rounded-lg bg-black/60 px-2 py-0.5 text-label-md text-white">
          {lesson.video.duration}
        </span>
      </button>
      <PrimaryButton onClick={onNext}>Continuar</PrimaryButton>
    </>
  )
}

function ExplanationStep({ lesson, onNext }: { lesson: MicroLesson; onNext: () => void }) {
  return (
    <>
      <h1 className="text-headline-lg text-on-surface">{lesson.title}</h1>
      <div className="flex flex-col gap-space-md rounded-2xl border-[1.5px] border-slate-200 bg-surface-container-lowest p-space-lg">
        {lesson.explanation.map((sentence, index) => (
          <p
            key={sentence}
            className={
              index === 0 ? 'text-body-xl font-semibold text-on-surface' : 'text-body-lg text-on-surface'
            }
          >
            {sentence}
          </p>
        ))}
      </div>
      <PrimaryButton onClick={onNext}>Entendi, vamos praticar</PrimaryButton>
    </>
  )
}

export default function LessonsShow() {
  const { lesson } = usePage<{ lesson: MicroLesson }>().props
  const [step, setStep] = useState<Step>('video')
  const next = () => setStep(STEPS[STEPS.indexOf(step) + 1])

  return (
    <FocusLayout progress={STEPS.indexOf(step) / (STEPS.length - 1)}>
      <Head title={lesson.title} />
      {step === 'video' && <VideoStep lesson={lesson} onNext={next} />}
      {step === 'explanation' && <ExplanationStep lesson={lesson} onNext={next} />}
      {step === 'question' && <QuestionStep question={lesson.question} onDone={next} />}
      {step === 'done' && <LessonComplete lesson={lesson} />}
    </FocusLayout>
  )
}

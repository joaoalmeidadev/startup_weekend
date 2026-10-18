import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { PrimaryButton } from '@/components/PrimaryButton'
import type { MicroLesson } from '@/types/collaborator'

type QuestionStepProps = { question: MicroLesson['question']; onDone: () => void }

// Immediate feedback; a wrong answer shows a gentle hint and lets the person try again
export function QuestionStep({ question, onDone }: QuestionStepProps) {
  const [picked, setPicked] = useState<number | null>(null)
  const answer = picked === null ? null : question.options[picked]

  return (
    <>
      <h1 className="text-headline-lg text-on-surface">{question.prompt}</h1>
      <div className="flex flex-col gap-space-sm">
        {question.options.map((option, index) => {
          const chosen = picked === index
          const tone = chosen
            ? option.correct
              ? 'border-tertiary-container bg-[#E8F5EC]'
              : 'border-secondary-container bg-secondary-fixed'
            : 'border-slate-200 bg-surface-container-lowest'
          return (
            <button
              key={option.text}
              type="button"
              aria-pressed={chosen}
              onClick={() => setPicked(index)}
              className={`min-h-[3rem] w-full rounded-xl border-[1.5px] p-space-md text-left text-body-md transition-all ${tone}`}
            >
              {option.text}
            </button>
          )
        })}
      </div>
      {answer && (
        <p
          role="status"
          className={`flex items-start gap-space-sm rounded-xl p-space-md text-body-md ${answer.correct ? 'bg-[#E8F5EC] text-tertiary-container' : 'bg-secondary-fixed text-on-secondary-container'}`}
        >
          <Icon name={answer.correct ? 'check_circle' : 'lightbulb'} className="text-[1.5rem]" />
          {answer.feedback}
        </p>
      )}
      <PrimaryButton disabled={!answer?.correct} onClick={onDone}>
        Concluir lição
      </PrimaryButton>
    </>
  )
}

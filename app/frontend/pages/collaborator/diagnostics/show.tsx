import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { PrimaryButton } from '@/components/PrimaryButton'
import { FocusLayout } from '@/layouts/FocusLayout'
import type { DiagnosticQuestion } from '@/types/collaborator'

type DiagnosticProps = { diagnostic: { questions: DiagnosticQuestion[] } }

function OptionButton({
  text,
  selected,
  onSelect,
}: {
  text: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex min-h-[3rem] w-full items-center gap-space-md rounded-xl p-space-md text-left text-body-md transition-all ${selected ? 'border-[3px] border-primary-container bg-[#E6F0F1]' : 'bg-surface-container-lowest shadow-sm hover:bg-surface-container-low'}`}
    >
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${selected ? 'border-tertiary-container bg-tertiary-container text-on-primary' : 'border-outline-variant'}`}
      >
        {selected && <Icon name="check" className="text-[1.25rem]" />}
      </span>
      {text}
    </button>
  )
}

// One question per screen; answers stay local until the diagnostic is scored for real
export default function DiagnosticsShow() {
  const { questions } = usePage<DiagnosticProps>().props.diagnostic
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const question = questions[index]
  const last = index === questions.length - 1

  const next = () => {
    if (last) return router.visit('/collaborator/diagnostic/result')
    setIndex(index + 1)
    setSelected(null)
  }

  return (
    <FocusLayout progress={index / questions.length}>
      <Head title="Conhecer você" />
      <div className="flex items-center justify-between">
        <span className="text-label-lg text-on-surface-variant">
          Pergunta {index + 1} de {questions.length}
        </span>
        <span className="rounded-full bg-surface-container px-space-sm py-1 text-label-md text-primary">
          {question.stretch}
        </span>
      </div>
      <h1 className="text-headline-lg text-on-surface">{question.prompt}</h1>
      <div role="radiogroup" aria-label="Respostas" className="flex flex-col gap-space-sm">
        {question.options.map((option, optionIndex) => (
          <OptionButton
            key={option}
            text={option}
            selected={selected === optionIndex}
            onSelect={() => setSelected(optionIndex)}
          />
        ))}
      </div>
      <PrimaryButton disabled={selected === null} onClick={next}>
        {last ? 'Ver meu resultado' : 'Continuar'}
      </PrimaryButton>
      <div className="flex flex-col items-center gap-space-xs text-center">
        <span className="text-label-md text-on-surface-variant">Isto não é prova: é para conhecer você.</span>
        <Link href="/collaborator/home" className="text-label-md text-primary underline">
          Continuar depois
        </Link>
      </div>
    </FocusLayout>
  )
}

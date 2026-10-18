import type { ProposalQuestion } from './proposalDraft'

export const INPUT =
  'h-11 w-full rounded-xl border-0 bg-surface-container-lowest px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container'

const LETTERS = ['A', 'B', 'C'] as const

type ProposalQuestionFieldsProps = {
  question: ProposalQuestion
  number: number
  onChange: (question: ProposalQuestion) => void
}

// One question, three options and the right one, so colleagues can check they understood
export function ProposalQuestionFields({ question, number, onChange }: ProposalQuestionFieldsProps) {
  const setOption = (index: number, text: string) =>
    onChange({
      ...question,
      options: question.options.map((option, i) =>
        i === index ? text : option,
      ) as ProposalQuestion['options'],
    })

  return (
    <fieldset className="flex flex-col gap-space-xs rounded-xl border border-surface-container-high p-space-sm">
      <legend className="px-1 text-label-md text-on-surface">
        Pergunta para o colega conferir se entendeu
      </legend>
      <input
        aria-label={`Pergunta da lição ${number}`}
        placeholder="Ex.: O cliente está bravo. Qual o primeiro passo?"
        value={question.prompt}
        onChange={(e) => onChange({ ...question, prompt: e.target.value })}
        className={INPUT}
      />
      {LETTERS.map((letter, index) => (
        <div key={letter} className="flex items-center gap-space-sm">
          <input
            type="radio"
            name={`correct-${number}`}
            aria-label={`Correta: alternativa ${letter} da lição ${number}`}
            checked={question.correct === index}
            onChange={() => onChange({ ...question, correct: index as ProposalQuestion['correct'] })}
            className="size-5 shrink-0 text-primary-container"
          />
          <input
            aria-label={`Alternativa ${letter} da lição ${number}`}
            placeholder={`Alternativa ${letter}`}
            value={question.options[index]}
            onChange={(e) => setOption(index, e.target.value)}
            className={INPUT}
          />
        </div>
      ))}
      <span className="text-body-sm text-on-surface-variant">Marque a bolinha da resposta certa.</span>
    </fieldset>
  )
}

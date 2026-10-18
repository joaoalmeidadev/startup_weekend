import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { isSingleWord } from '@/lib/text'

const NEW = 'new'
const FIELD =
  'h-11 w-full rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container'

type AddCompetencyProps = { available: string[]; onAdd: (name: string) => void }

// Brings a library competency (or a new one-word one) into the goal, so contents that train it count
export function AddCompetency({ available, onAdd }: AddCompetencyProps) {
  const [choice, setChoice] = useState('')
  const [typed, setTyped] = useState('')
  const name = choice === NEW ? typed.trim() : choice
  const add = () => {
    onAdd(name)
    setChoice('')
    setTyped('')
  }

  return (
    <div
      role="group"
      aria-label="Adicionar competência"
      className="flex flex-col gap-space-xs rounded-xl border-2 border-dashed border-surface-container-high p-space-md"
    >
      <div className="flex flex-col gap-space-sm sm:flex-row">
        <select
          aria-label="Competência para adicionar"
          value={choice}
          onChange={(event) => setChoice(event.target.value)}
          className={FIELD}
        >
          <option value="">Escolha uma competência da Biblioteca</option>
          {available.map((competency) => (
            <option key={competency}>{competency}</option>
          ))}
          <option value={NEW}>+ Nova competência</option>
        </select>
        {choice === NEW && (
          <input
            aria-label="Nova competência"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            placeholder="Ex.: Pontualidade"
            className={FIELD}
          />
        )}
        <button
          type="button"
          disabled={!isSingleWord(name)}
          onClick={add}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-50"
        >
          <Icon name="add" className="text-[1.125rem]" />
          Adicionar
        </button>
      </div>
      {choice === NEW && typed.trim() !== '' && !isSingleWord(typed.trim()) && (
        <p className="text-body-sm text-error">Use uma palavra só, ex.: Pontualidade.</p>
      )}
    </div>
  )
}

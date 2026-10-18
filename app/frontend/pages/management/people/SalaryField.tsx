import { useState } from 'react'
import { useMockNotice } from '@/components/MockNotice'

const reais = (value: number) => `R$ ${value.toLocaleString('pt-BR')}`

// The monthly salary that prices this person's points and saving; editing it is a simulation
export function SalaryField({ name, salary }: { name: string; salary: number | null }) {
  const notify = useMockNotice()
  const [value, setValue] = useState(salary)
  const [draft, setDraft] = useState(salary ? String(salary) : '')
  const [editing, setEditing] = useState(false)

  const save = () => {
    setValue(draft ? Number(draft) : null)
    setEditing(false)
    notify(`Salário de ${name} salvo (simulação).`)
  }

  return (
    <div role="group" aria-label="Salário" className="flex flex-wrap items-center gap-space-sm text-body-sm">
      {editing ? (
        <>
          <label className="flex items-center gap-space-xs text-label-md text-on-surface">
            Salário mensal (R$)
            <input
              type="number"
              min={0}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="h-9 w-32 rounded-lg border-0 bg-surface-container-low px-space-sm text-body-md focus:ring-2 focus:ring-primary-container"
            />
          </label>
          <button
            type="button"
            onClick={save}
            className="h-9 rounded-lg bg-primary px-space-md text-label-md text-on-primary hover:bg-primary-container"
          >
            Salvar
          </button>
        </>
      ) : (
        <>
          <span className="text-on-surface-variant">
            {value ? `Salário: ${reais(value)}` : 'Salário não informado · usa o valor do setor'}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-label-md text-primary hover:underline"
          >
            Editar salário
          </button>
        </>
      )}
    </div>
  )
}

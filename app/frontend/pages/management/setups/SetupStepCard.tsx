import { useState } from 'react'
import { Icon } from '@/components/Icon'
import type { SetupStep } from '@/types/management'

type SetupStepCardProps = {
  step: SetupStep
  number: number
  open: boolean
  onToggle: () => void
  onSave: () => void
}

export function SetupStepCard({ step, number, open, onToggle, onSave }: SetupStepCardProps) {
  const [values, setValues] = useState(step.fields.map((field) => field.value))

  return (
    <li className="rounded-xl bg-surface-container-lowest shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center gap-space-md p-space-md text-left"
      >
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${step.done ? 'bg-tertiary-container text-on-primary' : 'bg-surface-container-high text-primary'}`}
        >
          <Icon name={step.done ? 'check' : step.icon} className="text-[1.375rem]" />
        </span>
        <span className="flex flex-1 flex-col">
          <span className="text-label-lg text-on-surface">
            {number}. {step.title}
          </span>
          <span className={`text-body-sm ${step.done ? 'text-tertiary' : 'text-on-surface-variant'}`}>
            {step.done ? 'Concluído' : 'Pendente'}
          </span>
        </span>
        <Icon name={open ? 'expand_less' : 'expand_more'} className="text-[1.5rem] text-on-surface-variant" />
      </button>
      {open && (
        <div className="flex flex-col gap-space-sm border-t border-surface-container px-space-md pt-space-sm pb-space-md">
          {step.fields.map((field, index) => (
            <label key={field.label} className="flex flex-col gap-space-xs">
              <span className="text-label-md text-on-surface">{field.label}</span>
              <input
                type="text"
                value={values[index]}
                onChange={(event) =>
                  setValues((current) => current.map((v, i) => (i === index ? event.target.value : v)))
                }
                className="h-11 rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container"
              />
            </label>
          ))}
          <button
            type="button"
            onClick={onSave}
            className="mt-space-xs inline-flex h-11 w-fit items-center gap-space-xs rounded-xl bg-primary px-space-md text-label-md text-on-primary hover:bg-primary-container"
          >
            <Icon name="save" className="text-[1.125rem]" />
            Salvar
          </button>
        </div>
      )}
    </li>
  )
}

import { Head, Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { SetupStep } from '@/types/management'
import { SetupStepCard } from './SetupStepCard'

// Saving only marks the step as done locally; nothing is persisted in the MVP
function Checklist({ initialSteps }: { initialSteps: SetupStep[] }) {
  const notify = useMockNotice()
  const [steps, setSteps] = useState(initialSteps)
  const [openIndex, setOpenIndex] = useState<number | null>(initialSteps.findIndex((step) => !step.done))
  const done = steps.filter((step) => step.done).length

  const save = (index: number) => {
    setSteps((current) => current.map((step, i) => (i === index ? { ...step, done: true } : step)))
    setOpenIndex(steps.findIndex((step, i) => i > index && !step.done))
    notify(`${steps[index].title} salvo (simulação).`)
  }

  return (
    <>
      <div className="flex flex-col gap-space-xs">
        <span className="text-label-md text-on-surface">
          {done} de {steps.length} passos concluídos
        </span>
        <div className="h-3 overflow-hidden rounded-full bg-surface-container-high">
          <div
            className="h-full rounded-full bg-primary-container transition-all"
            style={{ width: `${(done / steps.length) * 100}%` }}
          />
        </div>
      </div>
      <ol className="flex flex-col gap-space-sm">
        {steps.map((step, index) => (
          <SetupStepCard
            key={step.title}
            step={step}
            number={index + 1}
            open={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            onSave={() => save(index)}
          />
        ))}
      </ol>
      {done === steps.length && (
        <Link
          href="/management"
          className="inline-flex h-12 w-fit items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container"
        >
          Tudo pronto! Ir para o Início
          <Icon name="arrow_forward" className="text-[1.25rem]" />
        </Link>
      )}
    </>
  )
}

export default function SetupsShow() {
  const { steps } = usePage<{ steps: SetupStep[] }>().props

  return (
    <ManagementLayout>
      <Head title="Primeiros passos" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-space-lg pt-space-md">
        <div className="flex flex-col gap-space-xs">
          <h1 className="text-headline-xl tracking-tight text-on-surface">Primeiros passos</h1>
          <p className="text-body-md text-on-surface-variant">
            4 passos rápidos para deixar a Nivela com a cara da sua empresa.
          </p>
        </div>
        <Checklist initialSteps={steps} />
      </div>
    </ManagementLayout>
  )
}

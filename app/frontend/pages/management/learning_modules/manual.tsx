import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState, type ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { NewModuleProps } from '@/types/management'

type DraftLesson = { title: string; text: string }

const FIELD =
  'h-11 rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container'
const INPUT = `${FIELD} w-full`
const SAVE_DELAY_MS = 900

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-space-xs">
      <span className="text-label-md text-on-surface">{label}</span>
      {children}
    </label>
  )
}

function LessonFields({
  lesson,
  number,
  onChange,
}: {
  lesson: DraftLesson
  number: number
  onChange: (lesson: DraftLesson) => void
}) {
  return (
    <li className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md">
      <span className="text-label-md text-primary">Lição {number}</span>
      <input
        aria-label={`Título da lição ${number}`}
        placeholder="Título curto"
        value={lesson.title}
        onChange={(e) => onChange({ ...lesson, title: e.target.value })}
        className={`${INPUT} bg-surface-container-lowest`}
      />
      <textarea
        aria-label={`Texto da lição ${number}`}
        placeholder="Explique em 3 frases simples"
        rows={3}
        value={lesson.text}
        onChange={(e) => onChange({ ...lesson, text: e.target.value })}
        className="w-full rounded-xl border-0 bg-surface-container-lowest p-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container"
      />
    </li>
  )
}

// Hand-written module: everything stays in the form; saving is a simulation
function ManualEditor({ journey }: Pick<NewModuleProps, 'journey'>) {
  const notify = useMockNotice()
  const [name, setName] = useState('')
  const [lessons, setLessons] = useState<DraftLesson[]>([{ title: '', text: '' }])
  const backPath = journey ? `/management/journeys/${journey.id}` : '/management/journeys'

  const save = () => {
    notify(`Módulo "${name}" salvo com ${lessons.length} lição(ões) (simulação).`)
    setTimeout(() => router.visit(backPath), SAVE_DELAY_MS)
  }

  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <Field label="Nome do módulo">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Trocas e devoluções"
          className={INPUT}
        />
      </Field>
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
        <Field label="Competência treinada">
          <input placeholder="Ex.: Atendimento pós-venda" className={INPUT} />
        </Field>
        <Field label="Trecho">
          <select className={INPUT} defaultValue="company">
            <option value="company">Empresa</option>
            <option value="sector">Setor</option>
          </select>
        </Field>
      </div>
      <span className="text-label-lg text-on-surface">Lições</span>
      <ol className="flex flex-col gap-space-sm">
        {lessons.map((lesson, index) => (
          <LessonFields
            key={index}
            lesson={lesson}
            number={index + 1}
            onChange={(l) => setLessons((current) => current.map((c, i) => (i === index ? l : c)))}
          />
        ))}
      </ol>
      <button
        type="button"
        onClick={() => setLessons((current) => [...current, { title: '', text: '' }])}
        className="inline-flex h-11 w-fit items-center gap-space-xs rounded-xl bg-surface-container px-space-md text-label-md text-primary hover:bg-surface-container-high"
      >
        <Icon name="add" className="text-[1.125rem]" />
        Adicionar lição
      </button>
      <Field label="Perguntas na avaliação final">
        <input type="number" min={3} max={20} defaultValue={10} className={`${FIELD} w-32`} />
      </Field>
      <button
        type="button"
        disabled={!name.trim()}
        onClick={save}
        className="inline-flex h-12 w-fit items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-50"
      >
        <Icon name="save" className="text-[1.25rem]" />
        Salvar módulo
      </button>
    </section>
  )
}

export default function LearningModulesManual() {
  const { journey } = usePage<NewModuleProps>().props

  return (
    <ManagementLayout>
      <Head title="Criar módulo" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-space-lg pt-space-md">
        {journey && (
          <Link
            href={`/management/journeys/${journey.id}`}
            className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
          >
            <Icon name="chevron_left" className="text-[1.125rem]" />
            {journey.name}
          </Link>
        )}
        <div className="flex flex-col gap-space-xs">
          <h1 className="text-headline-xl tracking-tight text-on-surface">Criar módulo</h1>
          <p className="text-body-md text-on-surface-variant">
            Escreva as lições do seu jeito. Cada lição deve caber em 5 minutos.
          </p>
        </div>
        <ManualEditor journey={journey} />
      </div>
    </ManagementLayout>
  )
}

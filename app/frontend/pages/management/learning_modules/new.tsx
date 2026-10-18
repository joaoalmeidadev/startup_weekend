import { Head, Link, usePage } from '@inertiajs/react'
import { useCallback, useEffect, useState } from 'react'
import { Icon } from '@/components/Icon'
import { WizardSteps } from '@/components/WizardSteps'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { NewModuleProps } from '@/types/management'

const SAMPLE_FILE = 'Manual de SAC.pdf'
const SAMPLE_NAME = 'Rotinas de atendimento'
const GENERATION_MS = 2500

function NameField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-col gap-space-xs">
      <label htmlFor="content-name" className="text-label-lg text-on-surface">
        Nome do conteúdo
      </label>
      <input
        id="content-name"
        type="text"
        value={value}
        placeholder="Ex.: Rotinas de atendimento"
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary-container"
      />
    </div>
  )
}

function UploadStep({ manualPath, onStart }: { manualPath: string; onStart: () => void }) {
  const [name, setName] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [simpleLanguage, setSimpleLanguage] = useState(true)
  const pickSample = () => {
    setFileName(SAMPLE_FILE)
    if (!name.trim()) setName(SAMPLE_NAME)
  }

  return (
    <div className="flex flex-col gap-space-md">
      <NameField value={name} onChange={setName} />
      <label className="flex cursor-pointer flex-col items-center gap-space-sm rounded-xl border-2 border-dashed border-primary-fixed-dim bg-surface-container-low p-space-xl text-center hover:bg-surface-container">
        <Icon name="upload_file" className="text-[3rem] text-primary" />
        <span className="text-label-lg text-on-surface">
          {fileName ?? 'Arraste aqui ou clique para escolher'}
        </span>
        <span className="text-body-sm text-on-surface-variant">
          PDF, DOCX ou vídeo — manuais, apresentações, procedimentos
        </span>
        <input
          type="file"
          accept=".pdf,.doc,.docx,video/*"
          className="sr-only"
          aria-label="Arquivo do módulo"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
        />
      </label>
      {!fileName && (
        <button type="button" onClick={pickSample} className="w-fit text-label-md text-primary underline">
          Usar o arquivo de exemplo ({SAMPLE_FILE})
        </button>
      )}
      <label className="flex items-center gap-space-sm">
        <input
          type="checkbox"
          checked={simpleLanguage}
          onChange={() => setSimpleLanguage(!simpleLanguage)}
          className="size-5 rounded border-outline text-primary-container focus:ring-primary-container"
        />
        <span className="text-body-md text-on-surface">Reescrever em linguagem simples</span>
      </label>
      <div className="flex flex-wrap items-center gap-space-md">
        <button
          type="button"
          disabled={!fileName || !name.trim()}
          onClick={onStart}
          className="inline-flex h-12 w-fit items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-50"
        >
          <Icon name="auto_awesome" className="text-[1.25rem]" />
          Criar lições com IA
        </button>
        <Link href={manualPath} className="text-label-md text-primary hover:underline">
          Prefiro escrever manualmente
        </Link>
      </div>
    </div>
  )
}

function GeneratingStep({ lessons, onDone }: { lessons: number; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, GENERATION_MS)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div role="status" className="flex flex-col items-center gap-space-md p-space-xl text-center">
      <Icon name="progress_activity" className="animate-spin text-[3rem] text-primary" />
      <span className="text-headline-sm text-on-surface">A IA está criando {lessons} lições…</span>
      <span className="text-body-sm text-on-surface-variant">
        Lendo o manual, separando os assuntos e escrevendo em linguagem simples.
      </span>
    </div>
  )
}

function DoneStep({ generated }: { generated: NewModuleProps['generated'] }) {
  return (
    <div className="flex flex-col items-center gap-space-md p-space-lg text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant">
        <Icon name="task_alt" className="text-[2.25rem]" />
      </div>
      <span className="text-headline-md text-on-surface">{generated.lessons} lições criadas!</span>
      <span className="text-body-md text-on-surface-variant">
        Nada vai para os colaboradores até você revisar e aprovar cada uma.
      </span>
      <Link
        href={generated.review_path}
        className="inline-flex h-12 items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container"
      >
        Revisar lições
        <Icon name="arrow_forward" className="text-[1.25rem]" />
      </Link>
    </div>
  )
}

function manualPathFor(journey: NewModuleProps['journey']) {
  const base = '/management/modules/new?mode=manual'
  return journey ? `${base}&journey=${journey.id}` : base
}

export default function LearningModulesNew() {
  const { journey, generated } = usePage<NewModuleProps>().props
  const [step, setStep] = useState(0)
  const finishGeneration = useCallback(() => setStep(2), [])

  return (
    <ManagementLayout>
      <Head title="Novo conteúdo" />
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
          <h1 className="text-headline-xl tracking-tight text-on-surface">Novo conteúdo</h1>
          <p className="text-body-md text-on-surface-variant">
            O treinamento que hoje é repassado de pessoa para pessoa — envie uma vez.
          </p>
        </div>
        <WizardSteps current={step} />
        <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          {step === 0 && <UploadStep manualPath={manualPathFor(journey)} onStart={() => setStep(1)} />}
          {step === 1 && <GeneratingStep lessons={generated.lessons} onDone={finishGeneration} />}
          {step === 2 && <DoneStep generated={generated} />}
        </section>
      </div>
    </ManagementLayout>
  )
}

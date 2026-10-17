import { Head, Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { SectorGoal } from '@/types/management'
import { CompetencyCard } from './CompetencyCard'

function SectorTabs({ sectors, current }: { sectors: string[]; current: string }) {
  return (
    <nav aria-label="Setores" className="flex flex-wrap items-center gap-space-xs">
      {sectors.map((sector) => (
        <Link
          key={sector}
          href={`/management/sector_goal?sector=${encodeURIComponent(sector)}`}
          aria-current={sector === current ? 'page' : undefined}
          className={`rounded-lg px-space-md py-2 text-label-md transition-colors ${sector === current ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'}`}
        >
          {sector}
        </Link>
      ))}
    </nav>
  )
}

function NoGoalYet({ sector }: { sector: string }) {
  const notify = useMockNotice()
  return (
    <section className="flex flex-col items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-sm">
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-container">
        <Icon name="groups" className="text-[2rem]" />
      </div>
      <h2 className="text-headline-md text-on-surface">{sector} ainda não tem meta</h2>
      <p className="max-w-xl text-body-md text-on-surface-variant">
        Convide de 3 a 5 colaboradores experientes do setor. Eles fazem a mesma avaliação e a média deles vira
        a meta.
      </p>
      <button
        type="button"
        onClick={() => notify('Convites enviados aos experientes (simulação).')}
        className="inline-flex h-12 items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container"
      >
        <Icon name="person_add" className="text-[1.25rem]" />
        Convidar experientes
      </button>
    </section>
  )
}

function GoalEditor({ sectorGoal }: { sectorGoal: SectorGoal }) {
  const notify = useMockNotice()
  const [goals, setGoals] = useState(sectorGoal.competencies.map((competency) => competency.goal))
  const setGoal = (index: number, goal: number) =>
    setGoals((current) => current.map((g, i) => (i === index ? goal : g)))

  return (
    <>
      <div className="mb-space-xl flex w-full flex-col gap-space-lg">
        {sectorGoal.competencies.map((competency, index) => (
          <CompetencyCard
            key={competency.name}
            competency={competency}
            goal={goals[index]}
            onGoalChange={(goal) => setGoal(index, goal)}
          />
        ))}
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm sm:flex-row">
        <div className="flex items-center gap-space-md">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-on-secondary-fixed">
            <Icon name="verified" className="text-[1.5rem]" />
          </div>
          <div className="flex flex-col">
            <span className="text-label-md font-semibold text-on-surface">
              Impacto Imediato de Certificação
            </span>
            <p className="max-w-xl text-body-sm text-on-surface-variant">
              Ao salvar, os colaboradores que ultrapassarem a meta receberão o selo{' '}
              <strong className="text-on-surface">“Nivelado em {sectorGoal.sector}”</strong>.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => notify(`Régua do setor ${sectorGoal.sector} salva (simulação).`)}
          className="inline-flex min-h-[3rem] w-full items-center justify-center gap-space-xs rounded-xl bg-primary px-space-xl text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary-container sm:w-auto"
        >
          <Icon name="save" className="text-[1.25rem]" />
          <span>Salvar alterações da meta</span>
        </button>
      </div>
    </>
  )
}

function ExpertsBanner({ sectorGoal }: { sectorGoal: SectorGoal }) {
  const notify = useMockNotice()
  return (
    <div className="mb-space-xl flex w-full flex-col justify-between gap-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:flex-row lg:items-center">
      <div className="flex max-w-3xl items-start gap-space-md">
        <div className="mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
          <Icon name="groups" className="text-[1.625rem]" />
        </div>
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-label-sm text-on-primary-fixed">
              Linha de Base Ativa
            </span>
            <span className="text-label-sm text-on-surface-variant">
              • {sectorGoal.experts_count} Especialistas Mapeados
            </span>
          </div>
          <p className="text-body-lg leading-relaxed font-medium text-on-surface">
            A meta é calculada automaticamente a partir do desempenho de {sectorGoal.experts_count}{' '}
            colaboradores experientes deste setor.
          </p>
          <p className="text-body-sm text-on-surface-variant">
            Ajuste a régua desejada para cada competência para atualizar o patamar de conformidade do time de{' '}
            {sectorGoal.sector}.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => notify('O convite de colaboradores experientes chega em breve.')}
        className="inline-flex min-h-[3rem] shrink-0 items-center justify-center gap-space-xs rounded-xl bg-surface-container-high px-space-lg text-label-lg text-primary transition-all hover:bg-surface-container"
      >
        <Icon name="person_add" className="text-[1.25rem]" />
        <span>+ Convidar colaborador experiente de referência</span>
      </button>
    </div>
  )
}

export default function SectorGoalsShow() {
  const { sector_goal: sectorGoal } = usePage<{ sector_goal: SectorGoal }>().props

  return (
    <ManagementLayout>
      <Head title="Meta do setor" />
      <div className="flex w-full flex-col">
        <div className="mb-space-lg flex w-full flex-col items-start justify-between gap-space-md rounded-xl bg-surface-container-high p-space-md shadow-sm md:flex-row md:items-center">
          <div className="flex min-w-0 items-center gap-space-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary">
              <Icon name="tune" className="text-[1.375rem]" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-label-sm tracking-wider text-on-surface-variant uppercase">
                Calibragem Setorial
              </span>
              <h1 className="truncate text-headline-lg text-on-surface">
                Meta do Setor: {sectorGoal.sector}
              </h1>
            </div>
          </div>
          <SectorTabs sectors={sectorGoal.sectors} current={sectorGoal.sector} />
        </div>
        {sectorGoal.competencies.length === 0 ? (
          <NoGoalYet sector={sectorGoal.sector} />
        ) : (
          <>
            <ExpertsBanner sectorGoal={sectorGoal} />
            <GoalEditor key={sectorGoal.sector} sectorGoal={sectorGoal} />
          </>
        )}
      </div>
    </ManagementLayout>
  )
}

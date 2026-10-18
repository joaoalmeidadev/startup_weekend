import { Head, Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { GoalLevel, SectorGoal } from '@/types/management'
import { CompetencyCard } from './CompetencyCard'
import { GoalLevelPicker } from './GoalLevelPicker'

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

// Level picked plus one goal per competency; "adjusted" when any ruler left the level target
function useGoalLevels(sectorGoal: SectorGoal) {
  const [levelKey, setLevelKey] = useState(sectorGoal.level)
  const [goals, setGoals] = useState(sectorGoal.competencies.map((competency) => competency.goal ?? 0))
  const level = sectorGoal.levels.find((candidate) => candidate.key === levelKey) ?? null
  const adjusted = level !== null && goals.some((goal) => goal !== level.target)

  const pickLevel = (picked: GoalLevel) => {
    setLevelKey(picked.key)
    setGoals((current) => current.map(() => picked.target))
  }
  const setGoal = (index: number, goal: number) =>
    setGoals((current) => current.map((g, i) => (i === index ? goal : g)))

  return { level, goals, adjusted, pickLevel, setGoal }
}

function NoGoalYet({ sector }: { sector: string }) {
  return (
    <section className="flex items-start gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-container">
        <Icon name="flag" className="text-[1.5rem]" />
      </div>
      <div className="flex flex-col gap-space-xs">
        <h2 className="text-headline-md text-on-surface">{sector} ainda não tem meta</h2>
        <p className="text-body-md text-on-surface-variant">
          Escolha um dos níveis abaixo para começar. Depois, ajuste cada competência se precisar.
        </p>
      </div>
    </section>
  )
}

function LevelStatus({ level, adjusted }: { level: GoalLevel; adjusted: boolean }) {
  return (
    <p className="flex items-center gap-space-xs text-body-md text-on-surface-variant">
      <Icon name={adjusted ? 'tune' : 'check_circle'} className="text-[1.125rem] text-primary" />
      Nível escolhido:{' '}
      {adjusted ? (
        <>
          <strong className="text-on-surface">Personalizado</strong> (a partir do {level.label})
        </>
      ) : (
        <>
          <strong className="text-on-surface">{level.label}</strong> · {level.target} pts em todas as
          competências
        </>
      )}
    </p>
  )
}

function VeteransNote({ sectorGoal }: { sectorGoal: SectorGoal }) {
  const notify = useMockNotice()
  const hasVeterans = sectorGoal.experts_count > 0
  return (
    <div className="flex flex-col justify-between gap-space-sm rounded-xl bg-surface-container-low p-space-md sm:flex-row sm:items-center">
      <p className="flex items-start gap-space-xs text-body-sm text-on-surface-variant">
        <span className="mt-1 size-2.5 shrink-0 rounded-full bg-outline" />
        {hasVeterans
          ? `Referência dos seus veteranos: ${sectorGoal.experts_count} veteranos do setor fizeram a mesma avaliação. A marca cinza em cada régua mostra a média deles.`
          : 'Ainda não há referência dos seus veteranos neste setor. Ela é opcional e ajuda a calibrar a meta.'}
      </p>
      <button
        type="button"
        onClick={() => notify('Convites enviados aos veteranos (simulação).')}
        className="inline-flex shrink-0 items-center gap-space-xs text-label-md text-primary hover:underline"
      >
        <Icon name="person_add" className="text-[1.125rem]" />
        {hasVeterans ? 'Convidar mais veteranos' : 'Convidar veteranos'}
      </button>
    </div>
  )
}

function SaveBar({ sector, levelLabel }: { sector: string; levelLabel: string }) {
  const notify = useMockNotice()
  return (
    <div className="flex w-full flex-col items-center justify-between gap-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm sm:flex-row">
      <div className="flex items-center gap-space-md">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-on-secondary-fixed">
          <Icon name="verified" className="text-[1.5rem]" />
        </div>
        <p className="max-w-xl text-body-md text-on-surface-variant">
          Ao salvar, quem atingir a meta em todas as competências recebe o selo{' '}
          <strong className="text-on-surface">“Nivelado em {sector}”</strong>.
        </p>
      </div>
      <button
        type="button"
        onClick={() => notify(`Meta de ${sector} salva no nível ${levelLabel} (simulação).`)}
        className="inline-flex min-h-[3rem] w-full items-center justify-center gap-space-xs rounded-xl bg-primary px-space-xl text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary-container sm:w-auto"
      >
        <Icon name="save" className="text-[1.25rem]" />
        <span>Salvar meta</span>
      </button>
    </div>
  )
}

function GoalEditor({ sectorGoal }: { sectorGoal: SectorGoal }) {
  const { level, goals, adjusted, pickLevel, setGoal } = useGoalLevels(sectorGoal)

  return (
    <div className="flex w-full flex-col gap-space-lg">
      {!level && <NoGoalYet sector={sectorGoal.sector} />}
      <GoalLevelPicker
        levels={sectorGoal.levels}
        selected={level?.key ?? null}
        adjusted={adjusted}
        onPick={pickLevel}
      />
      <VeteransNote sectorGoal={sectorGoal} />
      {level && (
        <>
          <LevelStatus level={level} adjusted={adjusted} />
          {sectorGoal.competencies.map((competency, index) => (
            <CompetencyCard
              key={competency.name}
              competency={competency}
              goal={goals[index]}
              onGoalChange={(goal) => setGoal(index, goal)}
            />
          ))}
          <SaveBar sector={sectorGoal.sector} levelLabel={adjusted ? 'Personalizado' : level.label} />
        </>
      )}
    </div>
  )
}

export default function SectorGoalsShow() {
  const { sector_goal: sectorGoal } = usePage<{ sector_goal: SectorGoal }>().props

  return (
    <ManagementLayout>
      <Head title="Meta do setor" />
      <div className="flex w-full flex-col gap-space-lg">
        <div className="flex w-full flex-col items-start justify-between gap-space-md rounded-xl bg-surface-container-high p-space-md shadow-sm md:flex-row md:items-center">
          <div className="flex min-w-0 items-center gap-space-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary">
              <Icon name="tune" className="text-[1.375rem]" />
            </div>
            <div className="flex min-w-0 flex-col">
              <h1 className="truncate text-headline-lg text-on-surface">
                Meta do setor: {sectorGoal.sector}
              </h1>
              <p className="text-body-sm text-on-surface-variant">
                Comece por um nível de mercado e ajuste com a referência dos seus veteranos.
              </p>
            </div>
          </div>
          <SectorTabs sectors={sectorGoal.sectors} current={sectorGoal.sector} />
        </div>
        <GoalEditor key={sectorGoal.sector} sectorGoal={sectorGoal} />
      </div>
    </ManagementLayout>
  )
}

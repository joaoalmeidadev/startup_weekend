import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import type { SectorDetail } from '@/types/management'
import { Block } from './Block'
import { GoalFields } from './GoalFields'
import { useGoalLevels } from './useGoalLevels'

function NoGoalYet({ sector }: { sector: string }) {
  return (
    <div className="flex items-start gap-space-md rounded-xl bg-surface-container-low p-space-md">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-container">
        <Icon name="flag" className="text-[1.5rem]" />
      </div>
      <div className="flex flex-col gap-space-xs">
        <h3 className="text-headline-sm text-on-surface">{sector} ainda não tem meta</h3>
        <p className="text-body-md text-on-surface-variant">
          Escolha um dos níveis abaixo para começar. Depois, ajuste cada competência se precisar.
        </p>
      </div>
    </div>
  )
}

function VeteransNote({ expertsCount }: { expertsCount: number }) {
  const notify = useMockNotice()
  const hasVeterans = expertsCount > 0
  return (
    <div className="flex flex-col justify-between gap-space-sm rounded-xl bg-surface-container-low p-space-md sm:flex-row sm:items-center">
      <p className="flex items-start gap-space-xs text-body-sm text-on-surface-variant">
        <span className="mt-1 size-2.5 shrink-0 rounded-full bg-outline" />
        {hasVeterans
          ? `Referência dos seus veteranos: ${expertsCount} veteranos daqui fizeram a mesma avaliação. A marca cinza em cada régua mostra a média deles.`
          : 'Ainda não há referência dos seus veteranos aqui. Ela é opcional e ajuda a calibrar a meta.'}
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
    <div className="flex w-full flex-col items-center justify-between gap-space-lg rounded-xl bg-surface-container-low p-space-md sm:flex-row">
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

// Start from a market level and fine-tune each competency with the veterans reference
export function SectorGoal({
  sector,
  libraryCompetencies,
}: {
  sector: SectorDetail
  libraryCompetencies: string[]
}) {
  const goal = useGoalLevels(sector)
  const { level, adjusted } = goal

  return (
    <Block title="Meta" hint="Comece por um nível de mercado e ajuste com a referência dos seus veteranos.">
      {!level && <NoGoalYet sector={sector.name} />}
      <GoalFields levels={sector.levels} libraryCompetencies={libraryCompetencies} goal={goal}>
        <VeteransNote expertsCount={sector.experts_count} />
      </GoalFields>
      {level && <SaveBar sector={sector.name} levelLabel={adjusted ? 'Personalizado' : level.label} />}
    </Block>
  )
}

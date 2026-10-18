import type { ReactNode } from 'react'
import { LegendKey } from '@/components/charts/ChartCard'
import { CHART } from '@/components/charts/colors'
import { DumbbellBars } from '@/components/charts/DumbbellBars'
import { Icon } from '@/components/Icon'
import type { PersonDetail } from '@/types/management'

export function Card({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  const id = `card-${icon}`
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <h2 id={id} className="flex items-center gap-space-xs text-headline-sm text-on-surface">
        <Icon name={icon} className="text-[1.375rem] text-primary" />
        {title}
      </h2>
      {children}
    </section>
  )
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col rounded-lg bg-surface-container-low p-space-sm">
      <span className="text-headline-sm font-bold text-on-surface tabular-nums">{value}</span>
      <span className="text-body-sm text-on-surface-variant">{label}</span>
    </div>
  )
}

export function StudyCard({ person }: { person: PersonDetail }) {
  const { study } = person
  return (
    <Card title="Estudo" icon="school">
      <div className="grid grid-cols-2 gap-space-sm md:grid-cols-3 2xl:grid-cols-5">
        <Fact value={`${study.weekly_minutes} min`} label="nesta semana" />
        <Fact value={`${study.streak_days} dias`} label="seguidos de estudo" />
        <Fact value={String(study.lessons_done)} label="lições concluídas" />
        <Fact value={`${study.review_accuracy}%`} label="de acerto nas revisões" />
        <Fact value={`${study.hours_done.toLocaleString('pt-BR')} h`} label="de treino substituídas" />
      </div>
      <div className="flex flex-col gap-space-sm">
        <div className="flex flex-wrap items-center justify-between gap-space-xs">
          <h3 className="text-label-lg text-on-surface">Antes × depois no que já estudou</h3>
          <span className="flex flex-wrap gap-space-sm text-label-sm text-on-surface-variant">
            <LegendKey color={CHART.axis} label="Diagnóstico" shape="ring" />
            <LegendKey color={CHART.team} label="Hoje" shape="dot" />
            <LegendKey color={CHART.goal} label="Meta" shape="tick" />
          </span>
        </div>
        <DumbbellBars rows={person.competencies} />
      </div>
    </Card>
  )
}

export function BadgeCard({ person }: { person: PersonDetail }) {
  const { badge } = person
  return (
    <Card title="Selo e conquistas" icon="workspace_premium">
      <div className="flex items-center gap-space-sm">
        <span
          className={`flex size-12 items-center justify-center rounded-full ${badge.earned ? 'bg-primary text-on-primary' : 'bg-surface-container text-outline'}`}
        >
          <Icon name="verified" className="text-[1.75rem]" />
        </span>
        <span className="flex flex-col">
          <span className="text-label-lg text-on-surface">{badge.label}</span>
          <span className="text-body-sm text-on-surface-variant">
            {badge.earned ? `Conquistado em ${badge.date}` : `Previsão: ${badge.forecast}`}
          </span>
        </span>
      </div>
      {person.milestones.length > 0 && (
        <ul className="flex flex-col gap-space-xs">
          {person.milestones.map((milestone) => (
            <li key={milestone} className="flex items-center gap-space-xs text-body-md text-on-surface">
              <Icon name="check_circle" className="text-[1.125rem] text-primary" />
              <span>{milestone}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export function RewardsCard({ person }: { person: PersonDetail }) {
  const { rewards } = person
  return (
    <Card title="Recompensas" icon="redeem">
      <div className="flex flex-wrap gap-x-space-md text-label-lg text-on-surface">
        <span>{rewards.points} pts ganhos</span>
        <span className="text-primary">{rewards.balance} pts de saldo</span>
      </div>
      {rewards.redeemed.length === 0 ? (
        <p className="text-body-sm text-outline">Ainda não resgatou nenhuma recompensa.</p>
      ) : (
        <ul className="flex flex-col gap-space-xs">
          {rewards.redeemed.map((reward) => (
            <li key={reward.name} className="flex items-center justify-between gap-space-sm text-body-md">
              <span className="text-on-surface">{reward.name}</span>
              <span className="text-body-sm text-on-surface-variant tabular-nums">
                {reward.date} · {reward.points} pts
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

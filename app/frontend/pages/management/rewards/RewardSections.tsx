import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import type { Reward, RewardsProps } from '@/types/management'
import { PersonAvatar } from '../people/PersonAvatar'
import { brl } from './rewardEconomics'

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  const id = `section-${title.toLowerCase().replace(/\W+/g, '-')}`
  return (
    <section aria-labelledby={id} className="flex flex-col gap-space-md">
      <div className="flex flex-col">
        <h2 id={id} className="text-headline-sm text-on-surface">
          {title}
        </h2>
        {hint && <p className="text-body-sm text-on-surface-variant">{hint}</p>}
      </div>
      {children}
    </section>
  )
}

// Only the manager sees this: the collaborator only sees points and rewards
export function RuleCard({ share }: { share: number }) {
  return (
    <section
      aria-labelledby="rule-title"
      className="flex items-start gap-space-md rounded-xl bg-secondary-fixed/40 p-space-md"
    >
      <Icon name="savings" className="text-[1.75rem] text-primary" />
      <div className="flex flex-col gap-1">
        <h2 id="rule-title" className="text-label-lg text-on-surface">
          Como funciona
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Cada hora estudada evita uma hora de alguém treinando. O prêmio devolve até{' '}
          {Math.round(share * 100)}% dessa economia — a pessoa vê só os pontos.
        </p>
      </div>
    </section>
  )
}

export function IdeasBar({ ideas, onPick }: { ideas: Reward[]; onPick: (idea: Reward) => void }) {
  return (
    <Section title="Ideias para cadastrar" hint="Clique para abrir o cadastro já preenchido.">
      <div className="flex flex-wrap gap-space-xs">
        {ideas.map((idea) => (
          <button
            key={idea.id}
            type="button"
            onClick={() => onPick(idea)}
            className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-lowest px-space-md py-2 text-label-md text-on-surface shadow-sm hover:bg-surface-container"
          >
            <Icon name={idea.icon} className="text-[1.125rem] text-primary" />
            {idea.name}
          </button>
        ))}
      </div>
    </Section>
  )
}

export function RecentRedemptions({ redemptions, month }: Pick<RewardsProps, 'redemptions' | 'month'>) {
  return (
    <Section title="Resgates recentes">
      <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
        <ul className="flex flex-col gap-space-xs">
          {redemptions.map((redemption) => (
            <li
              key={`${redemption.person.id}-${redemption.reward}-${redemption.date}`}
              className="flex items-center justify-between gap-space-sm"
            >
              <span className="flex items-center gap-space-sm">
                <PersonAvatar person={redemption.person} />
                <span className="flex flex-col">
                  <span className="text-label-lg text-on-surface">{redemption.person.name}</span>
                  <span className="text-body-sm text-on-surface-variant">{redemption.reward}</span>
                </span>
              </span>
              <span className="text-body-sm text-on-surface-variant tabular-nums">
                {redemption.date} · {redemption.points} pts
              </span>
            </li>
          ))}
        </ul>
        <p className="border-t border-surface-container-high pt-space-sm text-label-md text-on-surface">
          {`No mês: ${brl(month.spent)} em prêmios · ${brl(month.saved)} de treino economizado`}
        </p>
      </div>
    </Section>
  )
}

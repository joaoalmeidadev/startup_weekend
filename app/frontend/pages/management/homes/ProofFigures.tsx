import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import type { TeamDashboard } from '@/types/management'

const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

function Figure({
  title,
  icon,
  value,
  children,
}: {
  title: string
  icon: string
  value: string
  children: ReactNode
}) {
  const id = `figure-${icon}`
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <h2 id={id} className="flex items-center gap-space-xs text-label-lg text-on-surface-variant">
        <Icon name={icon} className="text-[1.25rem] text-primary" />
        {title}
      </h2>
      <span className="text-[2.75rem] leading-none font-bold text-on-surface tabular-nums">{value}</span>
      <div className="flex flex-col gap-1 text-body-sm text-on-surface-variant">{children}</div>
    </section>
  )
}

// The three answers to "is it working?": they learned, they got there faster, the company stopped paying for the hand-off
export function ProofFigures({ dashboard }: { dashboard: TeamDashboard }) {
  const { knowledge_gain: gain, time_to_level: time, savings } = dashboard
  return (
    <div className="grid grid-cols-1 gap-space-md lg:grid-cols-3">
      <Figure title="Aprenderam" icon="school" value={`${gain.before} → ${gain.now}`}>
        <span className="font-semibold text-primary">+{gain.now - gain.before} pts desde o diagnóstico</span>
        <span>Nota média da equipe, de 0 a 100</span>
      </Figure>
      <Figure title="Mais rápido" icon="bolt" value={`${time.days} dias`}>
        <span className="font-semibold text-primary">para nivelar um novato</span>
        <span>
          antes: ~{time.before_days} dias no repasse · {decimal.format(time.before_days / time.days)}× mais
          rápido
        </span>
      </Figure>
      <Figure title="Repasse economizado" icon="savings" value={`${savings.hours} h`}>
        <span className="font-semibold text-primary">≈ R$ {decimal.format(savings.amount / 1000)} mil</span>
        <span>{savings.new_hires} novatos sem repasse do veterano · estimativa</span>
        <span>{`Usa o salário informado de ${savings.salaries.informed} de ${savings.salaries.total} pessoas`}</span>
      </Figure>
    </div>
  )
}

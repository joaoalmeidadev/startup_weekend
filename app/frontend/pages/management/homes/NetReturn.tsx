import { useId } from 'react'
import { Icon } from '@/components/Icon'
import type { TeamDashboard } from '@/types/management'

const money = (value: number) => `${value < 0 ? '−' : ''}R$ ${Math.abs(value).toLocaleString('pt-BR')}`

function Line({ label, amount }: { label: string; amount: number }) {
  const id = useId()
  return (
    <li aria-labelledby={id} className="flex items-baseline justify-between gap-space-sm">
      <span id={id}>{label}</span>
      <span className="font-semibold text-on-surface tabular-nums">{money(amount)}</span>
    </li>
  )
}

// Savings minus what the company spent: rewards redeemed and the Nivela price for the team
export function NetReturn({ dashboard }: { dashboard: TeamDashboard }) {
  const net = dashboard.return
  const { rework_cost: reworkCost, price_per_person: price, people, months } = net.assumptions
  const period = dashboard.periods.find((option) => option.key === dashboard.period)?.label ?? ''
  const positive = net.balance > 0
  return (
    <section
      aria-labelledby="net-return"
      className="flex flex-col gap-space-md rounded-xl border border-success-green/30 bg-success-bg p-space-lg shadow-sm"
    >
      <div className="flex flex-col">
        <h2 id="net-return" className="flex items-center gap-space-xs text-label-lg text-on-surface">
          <Icon name="account_balance_wallet" className="text-[1.25rem] text-success-green" />
          Quanto a Nivela já devolveu
        </h2>
        <span className="text-body-sm text-on-surface-variant">{period.toLowerCase()}</span>
      </div>
      <ul className="flex flex-col gap-space-xs text-body-md text-on-surface-variant">
        <Line label="+ treino presencial economizado" amount={net.training_saved} />
        <Line
          label={`+ retrabalho evitado (${net.rework_count} × ${money(reworkCost)})`}
          amount={net.rework_avoided}
        />
        <Line label="− prêmios pagos" amount={net.rewards_paid} />
        <Line
          label={`− Nivela (${people} pessoas × ${money(price)} × ${months} ${months === 1 ? 'mês' : 'meses'})`}
          amount={net.platform_cost}
        />
      </ul>
      <div className="flex flex-col gap-space-xs border-t border-success-green/30 pt-space-sm">
        <span
          className={`text-headline-xl font-bold tabular-nums ${positive ? 'text-success-green' : 'text-on-surface'}`}
        >
          {`= ${money(net.balance)} de saldo`}
        </span>
        <span className="text-label-lg text-on-surface">
          {`Cada R$ 1 investido voltou R$ ${net.return_per_real.toLocaleString('pt-BR')}`}
        </span>
        <span className="text-body-sm text-on-surface-variant">
          {`Estimativa: retrabalho a ${money(reworkCost)} por ocorrência; Nivela a ${money(price)} por pessoa por mês.`}
        </span>
      </div>
    </section>
  )
}

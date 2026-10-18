import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { hourCost, learnerHourly, pointsPerHour, teacherHourly } from '@/lib/pointsRule'
import type { PointsRule } from '@/types/management'
import { formatHours, formatReais, type JourneyValue } from './journeyValue'

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

function Figure({ icon, figure, label }: { icon: string; figure: string; label: string }) {
  return (
    <div className="flex items-center gap-space-sm">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
        <Icon name={icon} className="text-[1.375rem]" />
      </span>
      <p className="flex flex-col">
        <span className="text-headline-sm text-on-surface">{figure}</span>{' '}
        <span className="text-body-sm text-on-surface-variant">{label}</span>
      </p>
    </div>
  )
}

function RuleLine({ rule }: { rule: PointsRule }) {
  return (
    <p className="text-body-sm text-on-surface-variant">
      1 h de treino = {formatReais(hourCost(rule))} (quem ensina {formatReais(teacherHourly(rule))} + quem
      aprende {formatReais(learnerHourly(rule))}) · {pointsPerHour(rule)} pts/h — calcule outros valores em{' '}
      <Link href="/management/rewards" className="font-semibold text-primary hover:underline">
        Recompensas
      </Link>
    </p>
  )
}

function StudyLine({ value }: { value: JourneyValue }) {
  const goal =
    value.total > 0
      ? `Cobre ${value.covered} de ${value.total} competências da meta`
      : 'Sem meta de setor para comparar'

  return (
    <p className="text-body-sm text-on-surface-variant">
      {plural(value.modules, 'módulo', 'módulos')} · {plural(value.lessons, 'lição', 'lições')} · ~
      {plural(value.weeks, 'semana', 'semanas')} a 5 min/dia · {goal}
    </p>
  )
}

// What the journey is worth by the admin's points rule, recalculated on every change to the path
export function JourneyCalculator({ value, rule }: { value: JourneyValue; rule: PointsRule }) {
  return (
    <section
      aria-labelledby="calculator-title"
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <h2 id="calculator-title" className="text-label-lg text-on-surface">
        Calculadora da jornada
      </h2>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-4">
        <Figure icon="schedule" figure={`${formatHours(value.hours)} h`} label="de treino substituídas" />
        <Figure icon="savings" figure={formatReais(value.saved)} label="economizados" />
        <Figure icon="stars" figure={`${value.points} pts`} label="na jornada" />
        <Figure icon="redeem" figure={`até ${formatReais(value.points)}`} label="viram prêmios" />
      </div>
      <div className="flex flex-col gap-1 border-t border-surface-container-high pt-space-sm">
        <RuleLine rule={rule} />
        <StudyLine value={value} />
      </div>
    </section>
  )
}

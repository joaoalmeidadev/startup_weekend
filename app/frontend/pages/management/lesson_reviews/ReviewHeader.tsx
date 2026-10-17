import { Link } from '@inertiajs/react'
import { Fragment } from 'react'
import { Icon } from '@/components/Icon'
import type { LessonReview } from '@/types/management'

function LessonDot({ number, current, approved }: { number: number; current: number; approved: boolean }) {
  if (approved) {
    return (
      <div
        title={`Lição ${number}: Aprovada`}
        className="flex size-7 items-center justify-center rounded-full bg-success-green text-white shadow-sm"
      >
        <Icon name="check" className="text-[1rem]" />
      </div>
    )
  }
  if (number === current) {
    return (
      <div
        title={`Lição ${number}: Em análise agora`}
        aria-current="step"
        className="flex size-8 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-white shadow-sm ring-4 ring-primary-container/20"
      >
        {number}
      </div>
    )
  }
  return (
    <div
      title={`Lição ${number}: Pendente`}
      className="flex size-6 items-center justify-center rounded-full bg-surface-muted text-[0.6875rem] font-semibold text-ink-muted"
    >
      {number}
    </div>
  )
}

function LessonPath({ review }: { review: LessonReview }) {
  const numbers = Array.from({ length: review.total }, (_, index) => index + 1)
  return (
    <ol className="flex items-center" aria-label="Lições do módulo">
      {numbers.map((number) => {
        const approved = number <= review.approved
        return (
          <Fragment key={number}>
            <li>
              <LessonDot number={number} current={review.position} approved={approved} />
            </li>
            {number < review.total && (
              <li
                aria-hidden="true"
                className={`h-0.5 ${approved ? 'w-4 bg-success-green' : 'w-3 bg-border-subtle'}`}
              />
            )}
          </Fragment>
        )
      })}
    </ol>
  )
}

export function ReviewHeader({ review }: { review: LessonReview }) {
  const title = review.final
    ? `Revisando a Lição ${review.position} de ${review.total} (Final)`
    : `Revisando a Lição ${review.position} de ${review.total}`

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
      <nav
        aria-label="Você está em"
        className="flex flex-wrap items-center gap-2 text-xs font-medium text-ink-muted"
      >
        {review.breadcrumb.map((crumb, index) => {
          const last = index === review.breadcrumb.length - 1
          return (
            <Fragment key={crumb.href}>
              {index > 0 && <span>›</span>}
              <Link
                href={crumb.href}
                className={`transition-colors hover:text-primary-container ${last ? 'font-semibold text-ink' : ''}`}
              >
                {crumb.label}
              </Link>
            </Fragment>
          )
        })}
      </nav>
      <div className="flex flex-col justify-between gap-4 border-t border-border-subtle/60 pt-1 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-bold text-ink">{title}</h1>
          <p className="text-xs text-ink-muted">
            Confira o texto antes de liberar para a equipe de {review.team}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LessonPath review={review} />
          <span className="rounded-full bg-teal-soft px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-primary-container">
            {review.approved} de {review.total} aprovadas
          </span>
        </div>
      </div>
    </section>
  )
}

export function TaskBanner({ final }: { final: boolean }) {
  return (
    <section className="flex items-center gap-3 rounded-xl border border-border-subtle bg-white px-4 py-3 text-sm text-ink">
      <Icon name="lightbulb" className="flex-shrink-0 text-[1.375rem] text-primary-container" />
      {final ? (
        <p className="leading-relaxed">
          <strong className="font-semibold text-primary-container">Última lição:</strong> confira as
          orientações finais de encerramento do chamado. Ao aprovar, o módulo completo será publicado para a
          equipe.
        </p>
      ) : (
        <p className="leading-relaxed">
          <strong className="font-semibold text-primary-container">Sua tarefa:</strong> confira se a IA
          explicou certo o que está no manual da empresa. Se estiver certo, aprove.
        </p>
      )}
    </section>
  )
}

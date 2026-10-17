import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { ManagerReview } from '@/types/management'

const BACK_DELAY_MS = 900

function ReviewForm({ review }: { review: ManagerReview }) {
  const notify = useMockNotice()
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const firstName = review.person.name.split(' ')[0]
  const complete = Object.keys(answers).length === review.statements.length

  const send = () => {
    notify(`Avaliação de ${review.person.name} enviada (simulação).`)
    setTimeout(() => router.visit(`/management/people/${review.person.id}`), BACK_DELAY_MS)
  }

  return (
    <section className="flex flex-col gap-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      {review.statements.map((statement, index) => (
        <fieldset key={statement} className="flex flex-col gap-space-sm">
          <legend className="mb-space-xs text-label-lg text-on-surface">
            {firstName} {statement}
          </legend>
          <div className="flex flex-wrap gap-space-xs">
            {review.scale.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={answers[index] === option}
                onClick={() => setAnswers((current) => ({ ...current, [index]: option }))}
                className={`rounded-full px-space-md py-2 text-label-md ${answers[index] === option ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      <button
        type="button"
        disabled={!complete}
        onClick={send}
        className="inline-flex h-12 w-fit items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-50"
      >
        <Icon name="send" className="text-[1.25rem]" />
        Enviar avaliação
      </button>
    </section>
  )
}

export default function ReviewsShow() {
  const { review } = usePage<{ review: ManagerReview }>().props

  return (
    <ManagementLayout>
      <Head title="Avaliar" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-space-lg pt-space-md">
        <Link
          href={`/management/people/${review.person.id}`}
          className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
        >
          <Icon name="chevron_left" className="text-[1.125rem]" />
          {review.person.name}
        </Link>
        <div className="flex flex-col gap-space-xs">
          <h1 className="text-headline-xl tracking-tight text-on-surface">Avaliar {review.person.name}</h1>
          <p className="text-body-md text-on-surface-variant">
            As mesmas perguntas que os colegas respondem. Sua resposta entra no feedback dela.
          </p>
        </div>
        <ReviewForm review={review} />
      </div>
    </ManagementLayout>
  )
}

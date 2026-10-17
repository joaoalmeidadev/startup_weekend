import { Head, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { PrimaryButton } from '@/components/PrimaryButton'
import { FocusLayout } from '@/layouts/FocusLayout'
import type { PeerReview } from '@/types/collaborator'

// One statement per screen: "A Joana explica as coisas com clareza?"
function questionsFor(review: PeerReview) {
  return review.colleagues.flatMap((colleague) =>
    review.statements.map((statement) => ({
      colleague,
      text: `${colleague.name.split(' ')[0]} ${statement}`,
    })),
  )
}

function ThankYou() {
  return (
    <div className="flex flex-col items-center gap-space-lg pt-space-xl text-center">
      <div className="flex size-24 items-center justify-center rounded-full bg-tertiary-container text-on-primary">
        <Icon name="favorite" filled className="text-[3rem]" />
      </div>
      <h1 className="text-headline-xl text-on-surface">Obrigado!</h1>
      <p className="text-body-xl text-on-surface-variant">
        Suas respostas são anônimas e ajudam seus colegas a crescer.
      </p>
      <PrimaryButton onClick={() => router.visit('/collaborator/journey')}>
        Voltar para a jornada
      </PrimaryButton>
    </div>
  )
}

export default function PeerReviewsShow() {
  const { peer_review: review } = usePage<{ peer_review: PeerReview }>().props
  const questions = questionsFor(review)
  const [index, setIndex] = useState(0)
  const done = index >= questions.length
  const next = () => setIndex(index + 1)

  if (done) {
    return (
      <FocusLayout progress={1}>
        <Head title="Avaliar colega" />
        <ThankYou />
      </FocusLayout>
    )
  }

  const question = questions[index]
  return (
    <FocusLayout progress={index / questions.length}>
      <Head title="Avaliar colega" />
      <span className="text-label-lg text-on-surface-variant">
        Avaliando {question.colleague.name} · {question.colleague.sector}
      </span>
      <h1 className="text-headline-lg text-on-surface">{question.text}</h1>
      <div className="flex flex-col gap-space-sm">
        {review.scale.map((option) => (
          <button
            key={option}
            type="button"
            onClick={next}
            className="min-h-[3.5rem] w-full rounded-2xl border-[1.5px] border-slate-200 bg-surface-container-lowest p-space-md text-left text-body-lg text-on-surface hover:border-primary-container hover:bg-surface-container-low"
          >
            {option}
          </button>
        ))}
      </div>
      <button type="button" onClick={next} className="self-center text-label-md text-primary underline">
        Pular
      </button>
    </FocusLayout>
  )
}

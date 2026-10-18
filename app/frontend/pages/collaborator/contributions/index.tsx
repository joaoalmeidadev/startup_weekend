import { Head, Link, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { CollaboratorLayout } from '@/layouts/CollaboratorLayout'
import type { ContributionsPage } from '@/types/collaborator'
import { ContributionCard } from './ContributionCard'

function EarnedCard({ earned }: { earned: number }) {
  return (
    <div className="flex items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant">
        <Icon name="volunteer_activism" className="text-[1.75rem]" />
      </span>
      <span className="text-label-lg text-on-surface">{`Você já ganhou ${earned} pts compartilhando`}</span>
    </div>
  )
}

export default function ContributionsIndex() {
  const { contributions, earned } = usePage<ContributionsPage>().props

  return (
    <CollaboratorLayout>
      <Head title="Compartilhar conhecimento" />
      <div className="flex w-full max-w-3xl flex-col gap-space-lg py-space-lg">
        <div className="flex flex-col gap-space-xs">
          <h1 className="text-headline-sm text-on-surface">Compartilhar conhecimento</h1>
          <p className="text-body-md text-on-surface-variant">
            Ensine o que você sabe do seu trabalho. Se for aprovado, vira uma jornada para os colegas e você
            ganha pontos.
          </p>
        </div>
        <EarnedCard earned={earned} />
        <Link
          href="/collaborator/contributions/new"
          className="flex h-12 w-full items-center justify-center gap-space-sm rounded-xl bg-primary-container text-label-lg text-on-primary shadow-sm hover:bg-primary"
        >
          <Icon name="add" className="text-[1.5rem]" />
          Propor uma jornada
        </Link>
        <section className="flex flex-col gap-space-sm">
          <h2 className="text-label-lg text-on-surface">Suas propostas</h2>
          {contributions.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">Você ainda não propôs nenhuma jornada.</p>
          ) : (
            contributions.map((contribution) => (
              <ContributionCard key={contribution.id} contribution={contribution} />
            ))
          )}
        </section>
      </div>
    </CollaboratorLayout>
  )
}

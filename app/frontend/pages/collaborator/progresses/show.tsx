import { Head, Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { CollaboratorLayout } from '@/layouts/CollaboratorLayout'
import type { Progress } from '@/types/collaborator'
import { BadgeGrid } from './BadgeGrid'
import { StretchBars } from './StretchBars'

type ProgressPageProps = { progress: Progress }

function Card({
  icon,
  title,
  aside,
  children,
}: {
  icon: string
  title: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <Icon name={icon} className="text-[1.75rem] text-primary" />
          <h2 className="text-headline-md text-on-surface">{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}

export default function ProgressesShow() {
  const { progress } = usePage<ProgressPageProps>().props
  const earned = progress.badges.filter((badge) => badge.earned).length

  return (
    <CollaboratorLayout>
      <Head title="Meu progresso" />
      <div className="mx-auto flex w-full max-w-[38.75rem] flex-col gap-space-xl pb-space-xl">
        <div className="mt-space-md flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <Icon name="military_tech" filled className="text-[2rem] text-secondary" />
            <h1 className="text-headline-xl text-on-surface">Meu Progresso</h1>
          </div>
          <p className="text-body-xl text-on-surface-variant">
            Veja seus selos e quanto você já avançou na jornada.
          </p>
        </div>

        <Card
          icon="workspace_premium"
          title="Minhas Conquistas"
          aside={
            <span className="rounded-full bg-primary-fixed/40 px-space-sm py-1 text-body-lg-bold text-primary">
              {earned} de {progress.badges.length}
            </span>
          }
        >
          <p className="text-body-lg text-on-surface-variant">Selos que você ganhou praticando suas aulas:</p>
          <BadgeGrid badges={progress.badges} />
        </Card>

        <Card icon="trending_up" title="Minha Evolução">
          <p className="text-headline-md text-on-surface">
            {progress.evolution.completed} de {progress.evolution.total} módulos concluídos
          </p>
          <StretchBars stretches={progress.evolution.stretches} />
        </Card>

        <div className="flex flex-col items-center pt-space-xs">
          <Link
            href="/collaborator/journey"
            className="flex h-16 w-full items-center justify-center gap-space-sm rounded-xl bg-primary text-label-lg text-on-primary shadow-md transition-all hover:bg-primary-container active:translate-y-0.5"
          >
            <Icon name="arrow_back" className="text-[1.625rem]" />
            <span>Voltar para Minha Jornada</span>
          </Link>
          <p className="mt-space-sm text-center text-label-md text-on-surface-variant">
            Seu progresso é salvo automaticamente a cada aula concluída.
          </p>
        </div>
      </div>
    </CollaboratorLayout>
  )
}

import { Head, Link, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { ModuleSummary } from '@/types/management'
import { ContentLibrary } from './ContentLibrary'

function LibraryHeader() {
  return (
    <section className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
      <div className="flex flex-col gap-space-xs">
        <h1 className="text-headline-xl tracking-tight text-on-surface">Biblioteca</h1>
        <p className="text-body-md text-on-surface-variant">O que alimenta as jornadas.</p>
      </div>
      <Link
        href="/management/modules/new"
        className="inline-flex h-12 items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-md transition-all hover:bg-primary-container"
      >
        <Icon name="add" className="text-[1.25rem]" />
        <span>Novo conteúdo</span>
      </Link>
    </section>
  )
}

export default function LibrariesShow() {
  const { library } = usePage<{ library: ModuleSummary[] }>().props

  return (
    <ManagementLayout>
      <Head title="Biblioteca" />
      <div className="flex w-full flex-col gap-space-lg">
        <LibraryHeader />
        <ContentLibrary library={library} />
      </div>
    </ManagementLayout>
  )
}

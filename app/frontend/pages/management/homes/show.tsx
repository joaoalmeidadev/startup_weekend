import { Head, Link, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { HomeProps, Manager } from '@/types/management'

const TONES: Record<string, string> = {
  leveled: 'bg-tertiary-container text-on-tertiary-container',
  learning: 'bg-primary-container text-on-primary-container',
  attention: 'bg-secondary-container text-on-secondary-container',
}

// Real download: the people report is generated as CSV by the server
function ExportButton() {
  return (
    <a
      href="/management/people.csv"
      download
      className="inline-flex items-center gap-space-xs text-label-md text-primary hover:underline"
    >
      <Icon name="download" className="text-[1.125rem]" />
      Exportar relatório
    </a>
  )
}

export default function HomesShow() {
  const { home, manager } = usePage<{ home: HomeProps; manager: Manager }>().props
  const firstName = manager.name.split(' ')[0]

  return (
    <ManagementLayout>
      <Head title="Início" />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <div className="flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
          <div className="flex flex-col">
            <span className="text-label-sm font-bold tracking-wider text-primary uppercase">
              Gestão • {manager.company}
            </span>
            <h1 className="text-headline-xl tracking-tight text-on-surface">Olá, {firstName}!</h1>
            <p className="mt-space-xs text-body-md text-on-surface-variant">
              Veja como está o nivelamento da equipe hoje.
            </p>
          </div>
          <ExportButton />
        </div>

        <section className="grid grid-cols-1 gap-space-md md:grid-cols-3">
          {home.numbers.map((number) => (
            <div
              key={number.label}
              className="flex items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
            >
              <div className={`flex size-14 items-center justify-center rounded-xl ${TONES[number.tone]}`}>
                <Icon name={number.icon} className="text-[1.75rem]" />
              </div>
              <div className="flex flex-col">
                <span className="text-headline-xl leading-none font-bold text-on-surface">
                  {number.value}
                </span>
                <span className="text-label-md text-on-surface-variant">{number.label}</span>
              </div>
            </div>
          ))}
        </section>

        {home.setup.done < home.setup.total && (
          <Link
            href={home.setup.href}
            className="flex items-center justify-between gap-space-md rounded-xl bg-primary-container p-space-md text-on-primary shadow-sm hover:brightness-110"
          >
            <span className="flex items-center gap-space-sm">
              <Icon name="checklist" className="text-[1.75rem]" />
              <span className="flex flex-col">
                <span className="text-label-lg">Configure sua empresa</span>
                <span className="text-body-sm text-on-primary-container">
                  {home.setup.done} de {home.setup.total} passos concluídos
                </span>
              </span>
            </span>
            <Icon name="arrow_forward" className="text-[1.5rem]" />
          </Link>
        )}

        <section className="flex flex-col gap-space-md">
          <h2 className="text-headline-md text-on-surface">Precisa da sua atenção</h2>
          <ul className="flex flex-col gap-space-sm">
            {home.attention.map((item) => (
              <li
                key={item.text}
                className="flex items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
              >
                <div className="flex items-center gap-space-sm">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-on-secondary-container">
                    <Icon name={item.icon} className="text-[1.375rem]" />
                  </div>
                  <span className="text-body-lg text-on-surface">{item.text}</span>
                </div>
                <Link
                  href={item.href}
                  className="inline-flex h-11 shrink-0 items-center gap-space-xs rounded-xl bg-primary px-space-md text-label-md text-on-primary hover:bg-primary-container"
                >
                  {item.action}
                  <Icon name="arrow_forward" className="text-[1.125rem]" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ManagementLayout>
  )
}

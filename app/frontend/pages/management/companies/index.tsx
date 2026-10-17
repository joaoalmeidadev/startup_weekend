import { Head, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { Company } from '@/types/management'

type CompaniesProps = { numbers: { label: string; value: string }[]; companies: Company[] }

const STATUS = {
  active: { label: 'Ativa', className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  trial: { label: 'Teste', className: 'bg-secondary-fixed text-on-secondary-container' },
}

function CompanyRow({ company, open, onToggle }: { company: Company; open: boolean; onToggle: () => void }) {
  const notify = useMockNotice()
  const status = STATUS[company.status]
  return (
    <li className="rounded-xl bg-surface-container-lowest shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center gap-space-md p-space-md text-left"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
          <Icon name="domain" className="text-[1.375rem]" />
        </span>
        <span className="flex flex-1 flex-col">
          <span className="text-label-lg text-on-surface">{company.name}</span>
          <span className="text-body-sm text-on-surface-variant">
            {company.people} pessoas ativas · {company.leveled}% niveladas
          </span>
        </span>
        <span className={`rounded-full px-space-sm py-0.5 text-label-sm font-bold ${status.className}`}>
          {status.label}
        </span>
        <Icon name={open ? 'expand_less' : 'expand_more'} className="text-[1.5rem] text-on-surface-variant" />
      </button>
      {open && (
        <div className="flex flex-col gap-space-sm border-t border-surface-container px-space-md pt-space-sm pb-space-md md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col text-body-md text-on-surface">
            <span>Plano: {company.plan}</span>
            <span className="text-body-sm text-on-surface-variant">
              Próxima cobrança: {company.next_charge}
            </span>
          </div>
          <div className="flex gap-space-sm">
            <button
              type="button"
              onClick={() => notify('Mudar plano chega em breve.')}
              className="h-10 rounded-xl bg-surface-container px-space-md text-label-md text-primary hover:bg-surface-container-high"
            >
              Mudar plano
            </button>
            <button
              type="button"
              onClick={() => notify(`${company.name} pausada (simulação).`)}
              className="h-10 rounded-xl bg-surface-container px-space-md text-label-md text-error hover:bg-error-container"
            >
              Pausar
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

export default function CompaniesIndex() {
  const { numbers, companies } = usePage<CompaniesProps>().props
  const [open, setOpen] = useState<string | null>(null)

  return (
    <ManagementLayout area="platform">
      <Head title="Empresas" />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <div className="flex flex-col gap-space-xs">
          <span className="text-label-sm font-bold tracking-wider text-primary uppercase">Admin Nivela</span>
          <h1 className="text-headline-xl tracking-tight text-on-surface">Empresas clientes</h1>
        </div>
        <section className="grid grid-cols-1 gap-space-md md:grid-cols-3">
          {numbers.map((number) => (
            <div
              key={number.label}
              className="flex flex-col rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
            >
              <span className="text-headline-xl font-bold text-on-surface">{number.value}</span>
              <span className="text-label-md text-on-surface-variant">{number.label}</span>
            </div>
          ))}
        </section>
        <ul className="flex flex-col gap-space-sm">
          {companies.map((company) => (
            <CompanyRow
              key={company.name}
              company={company}
              open={open === company.name}
              onToggle={() => setOpen(open === company.name ? null : company.name)}
            />
          ))}
        </ul>
      </div>
    </ManagementLayout>
  )
}

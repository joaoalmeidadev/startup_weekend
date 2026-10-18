import { Head } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'

export default function RewardsShow() {
  return (
    <ManagementLayout>
      <Head title="Recompensas" />
      <div className="flex w-full flex-col gap-space-lg">
        <h1 className="text-headline-xl tracking-tight text-on-surface">Recompensas</h1>
        <section className="flex flex-col items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-sm">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary-fixed text-on-secondary-container">
            <Icon name="redeem" className="text-[1.75rem]" />
          </span>
          <p className="text-headline-sm text-on-surface">Em breve</p>
          <p className="max-w-md text-body-md text-on-surface-variant">
            Aqui você vai configurar recompensas para quem chega ao selo Nivelado.
          </p>
        </section>
      </div>
    </ManagementLayout>
  )
}

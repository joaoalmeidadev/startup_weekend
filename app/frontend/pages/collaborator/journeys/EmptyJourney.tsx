import { Icon } from '@/components/Icon'

export function EmptyJourney({ company }: { company: string }) {
  return (
    <section className="flex flex-col items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-md">
      <div className="flex size-24 items-center justify-center rounded-full bg-surface-container text-primary-container">
        <Icon name="hourglass_top" className="text-[3rem]" />
      </div>
      <h1 className="text-headline-lg text-on-surface">Sua jornada está sendo preparada</h1>
      <p className="text-body-xl text-on-surface-variant">
        O RH da {company} está escolhendo os módulos. Você recebe um lembrete assim que ela estiver pronta.
      </p>
    </section>
  )
}

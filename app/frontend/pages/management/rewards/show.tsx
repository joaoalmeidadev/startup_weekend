import { Head, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { Reward, RewardsProps } from '@/types/management'
import { PointsCalculator } from './PointsCalculator'
import { RewardCard } from './RewardCard'
import { RewardForm } from './RewardForm'
import { IdeasBar, RecentRedemptions, Section } from './RewardSections'

type FormState = { idea: Reward | null } | null

function RewardsScreen({ points_rule, rewards, ideas, redemptions, month }: RewardsProps) {
  const notify = useMockNotice()
  const [calculating, setCalculating] = useState(false)
  const [catalog, setCatalog] = useState(rewards)
  const [form, setForm] = useState<FormState>(null)

  const register = (reward: Reward) => {
    setCatalog((current) => [...current, reward])
    setForm(null)
    notify(`Recompensa "${reward.name}" cadastrada (simulação).`)
  }

  return (
    <div className="flex w-full flex-col gap-space-lg pt-space-md">
      <section className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
        <div className="flex flex-col">
          <h1 className="text-headline-xl tracking-tight text-on-surface">Recompensas</h1>
          <p className="text-body-md text-on-surface-variant">
            Prêmios que a equipe troca por pontos de estudo.
          </p>
        </div>
        <div className="flex flex-wrap gap-space-sm">
          <button
            type="button"
            onClick={() => setCalculating(true)}
            className="inline-flex h-12 items-center justify-center gap-space-sm rounded-xl bg-surface-container-lowest px-space-lg text-label-lg text-primary shadow-sm ring-1 ring-primary-fixed-dim hover:bg-surface-container"
          >
            <Icon name="calculate" className="text-[1.25rem]" />
            Calcular pontuação
          </button>
          <button
            type="button"
            onClick={() => setForm({ idea: null })}
            className="inline-flex h-12 items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-md hover:bg-primary-container"
          >
            <Icon name="add" className="text-[1.25rem]" />
            Cadastrar recompensa
          </button>
        </div>
      </section>
      <Section title="Catálogo">
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-3">
          {catalog.map((reward) => (
            <RewardCard key={reward.id} reward={reward} rule={points_rule} />
          ))}
        </div>
      </Section>
      <IdeasBar ideas={ideas} onPick={(idea) => setForm({ idea })} />
      <RecentRedemptions redemptions={redemptions} month={month} />
      {calculating && <PointsCalculator rule={points_rule} onClose={() => setCalculating(false)} />}
      {form && (
        <RewardForm idea={form.idea} rule={points_rule} onSave={register} onClose={() => setForm(null)} />
      )}
    </div>
  )
}

export default function RewardsShow() {
  const props = usePage<RewardsProps>().props
  return (
    <ManagementLayout>
      <Head title="Recompensas" />
      <RewardsScreen {...props} />
    </ManagementLayout>
  )
}

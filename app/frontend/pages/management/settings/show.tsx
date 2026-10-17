import { Head, usePage } from '@inertiajs/react'
import { useState, type ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { Settings } from '@/types/management'

function Block({
  icon,
  title,
  hint,
  children,
}: {
  icon: string
  title: string
  hint: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="flex items-start gap-space-sm">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
          <Icon name={icon} className="text-[1.375rem]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-headline-sm text-on-surface">{title}</h2>
          <p className="text-body-sm text-on-surface-variant">{hint}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex items-center justify-between gap-space-md rounded-xl bg-surface-container-low p-space-sm text-left"
    >
      <span className="text-body-md text-on-surface">{label}</span>
      <span
        className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${checked ? 'bg-primary-container' : 'bg-outline-variant'}`}
      >
        <span
          className={`size-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`}
        />
      </span>
    </button>
  )
}

// Choices stay in local state until settings are persisted
function SettingsForm({ settings }: { settings: Settings }) {
  const notify = useMockNotice()
  const [alertDays, setAlertDays] = useState(settings.alert_days)
  const [ranking, setRanking] = useState(settings.ranking_enabled)
  const [badges, setBadges] = useState(settings.badges)
  const toggleBadge = (name: string) =>
    setBadges((current) =>
      current.map((badge) => (badge.name === name ? { ...badge, enabled: !badge.enabled } : badge)),
    )

  return (
    <>
      <Block icon="notifications_active" title="Alertas" hint="Quando o gestor deve ser avisado.">
        <label className="flex flex-wrap items-center gap-space-sm text-body-md text-on-surface">
          Avisar quando alguém ficar abaixo da meta por
          <select
            value={alertDays}
            onChange={(event) => setAlertDays(Number(event.target.value))}
            className="rounded-lg border-0 bg-surface-container-low py-1.5 text-label-md text-on-surface focus:ring-2 focus:ring-primary-container"
          >
            {settings.alert_options.map((days) => (
              <option key={days} value={days}>
                {days} dias
              </option>
            ))}
          </select>
        </label>
      </Block>
      <Block
        icon="leaderboard"
        title="Ranking"
        hint="Mede dedicação, nunca nota. Cada pessoa escolhe como aparece."
      >
        <Toggle
          label="Mostrar ranking para os colaboradores"
          checked={ranking}
          onChange={() => setRanking(!ranking)}
        />
      </Block>
      <Block icon="military_tech" title="Selos" hint="Quais conquistas os colaboradores podem ganhar.">
        <div className="flex flex-col gap-space-xs">
          {badges.map((badge) => (
            <Toggle
              key={badge.name}
              label={badge.name}
              checked={badge.enabled}
              onChange={() => toggleBadge(badge.name)}
            />
          ))}
        </div>
      </Block>
      <button
        type="button"
        onClick={() => notify('Configurações salvas (simulação).')}
        className="inline-flex h-12 w-fit items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container"
      >
        <Icon name="save" className="text-[1.25rem]" />
        Salvar configurações
      </button>
    </>
  )
}

export default function SettingsShow() {
  const { settings } = usePage<{ settings: Settings }>().props

  return (
    <ManagementLayout>
      <Head title="Configurações" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-space-lg pt-space-md">
        <h1 className="text-headline-xl tracking-tight text-on-surface">Configurações</h1>
        <SettingsForm settings={settings} />
      </div>
    </ManagementLayout>
  )
}

import { Head, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { CollaboratorLayout } from '@/layouts/CollaboratorLayout'
import type { Profile, Viewer } from '@/types/collaborator'
import { ReminderModal } from './ReminderModal'
import { SettingRow } from './SettingRow'

type ProfilePageProps = { profile: Profile; viewer: Viewer }
type OpenModal = 'reminder' | null

const BACK_TO_HOME_DELAY_MS = 1200

// Settings are kept in local state until there is somewhere to save them
function ProfileSettings({ profile }: { profile: Profile }) {
  const notify = useMockNotice()
  const [reminderTime, setReminderTime] = useState(profile.reminder_time)
  const [openModal, setOpenModal] = useState<OpenModal>(null)

  const saveAndGoBack = () => {
    notify('Tudo pronto! Suas opções foram salvas.')
    setTimeout(() => router.visit('/collaborator/home'), BACK_TO_HOME_DELAY_MS)
  }

  return (
    <>
      <div className="flex flex-col gap-space-md">
        <SettingRow
          icon="notifications_active"
          title="Lembrete diário no celular"
          value={`Ativado • Todo dia às ${reminderTime}`}
          actionIcon="schedule"
          actionLabel="Mudar horário"
          actionAriaLabel="Mudar horário do lembrete"
          onAction={() => setOpenModal('reminder')}
        />
        <SettingRow
          icon="quiz"
          title="Meu diagnóstico"
          value="Monta a jornada com o que você precisa"
          actionIcon="replay"
          actionLabel="Refazer"
          actionAriaLabel="Refazer meu diagnóstico"
          onAction={() => router.visit('/collaborator/welcome')}
        />
        <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          <button
            type="button"
            onClick={() => router.delete('/users/sign_out')}
            className="flex min-h-[3rem] w-full items-center justify-center gap-space-sm rounded-xl bg-error-container/40 px-space-md transition-all hover:bg-error-container active:scale-[0.99]"
          >
            <Icon name="logout" className="text-[1.5rem] text-error" />
            <span className="text-label-lg text-error">Sair da minha conta</span>
          </button>
        </div>
      </div>

      <div className="pt-space-sm">
        <button
          type="button"
          onClick={saveAndGoBack}
          className="flex min-h-[3rem] w-full items-center justify-center gap-space-sm rounded-xl bg-primary-container px-space-lg text-on-primary shadow-md transition-all hover:bg-primary active:translate-y-[2px]"
        >
          <span className="text-label-lg">Salvar e voltar ao início</span>
          <Icon name="arrow_forward" className="text-[1.875rem]" />
        </button>
      </div>

      {openModal === 'reminder' && (
        <ReminderModal
          current={reminderTime}
          options={profile.reminder_options}
          onConfirm={(time) => {
            setReminderTime(time)
            setOpenModal(null)
          }}
          onClose={() => setOpenModal(null)}
        />
      )}
    </>
  )
}

export default function ProfilesShow() {
  const { profile, viewer } = usePage<ProfilePageProps>().props

  return (
    <CollaboratorLayout>
      <Head title="Meu perfil" />
      <div className="flex w-full max-w-3xl flex-col gap-space-lg pb-space-xl">
        <div className="flex items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          <div className="relative shrink-0">
            <img
              src={viewer.avatar_url}
              alt={viewer.name}
              className="size-20 rounded-full object-cover shadow-sm"
            />
            <div className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary">
              <Icon name="verified" className="text-[1.125rem]" />
            </div>
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-headline-sm text-on-surface">{viewer.name}</span>
            <span className="truncate text-body-md text-on-surface-variant">
              {viewer.sector} • {viewer.company}
            </span>
          </div>
        </div>
        <ProfileSettings profile={profile} />
      </div>
    </CollaboratorLayout>
  )
}

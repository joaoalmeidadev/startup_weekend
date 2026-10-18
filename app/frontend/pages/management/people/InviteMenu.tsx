import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { Modal } from '@/components/Modal'
import { useMockNotice } from '@/components/MockNotice'
import type { InviteSector } from '@/types/management'
import { NEW_SECTOR, SectorField } from './SectorField'

type Kind = 'email' | 'sheet'

const OPTIONS: { kind: Kind; icon: string; title: string; hint: string }[] = [
  { kind: 'email', icon: 'mail', title: 'Por e-mail', hint: 'Envio individual rápido' },
  { kind: 'sheet', icon: 'upload_file', title: 'Por planilha (CSV/XLS)', hint: 'Importação em lote' },
]

type InviteModalProps = {
  kind: Kind
  sectors: InviteSector[]
  initialSector: string
  onClose: () => void
}

const plural = (count: number) => (count === 1 ? '1 convite enviado' : `${count} convites enviados`)

function sentMessage(emails: number, sector: string, created: boolean) {
  if (created) return `Setor ${sector} criado e ${plural(emails)} (simulação).`
  return `${plural(emails)} para ${sector} (simulação).`
}

function InviteModal({ kind, sectors, initialSector, onClose }: InviteModalProps) {
  const notify = useMockNotice()
  const [value, setValue] = useState('')
  const [sector, setSector] = useState(initialSector)
  const [newSector, setNewSector] = useState('')
  const creating = sector === NEW_SECTOR
  const sectorName = creating ? newSector.trim() : sector
  const emails = value.split('\n').filter((line) => line.trim()).length
  const ready = kind === 'sheet' ? Boolean(value) : emails > 0 && Boolean(sectorName)

  const send = () => {
    notify(kind === 'sheet' ? 'Convites enviados (simulação).' : sentMessage(emails, sectorName, creating))
    onClose()
  }

  return (
    <Modal icon={kind === 'email' ? 'mail' : 'upload_file'} title="Convidar pessoas" onClose={onClose}>
      {kind === 'email' && (
        <SectorField
          sectors={sectors}
          selected={sector}
          newName={newSector}
          onSelect={setSector}
          onNewName={setNewSector}
        />
      )}
      {kind === 'email' ? (
        <label className="flex flex-col gap-space-xs">
          <span className="text-label-md text-on-surface">E-mails (um por linha)</span>
          <textarea
            rows={4}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="joana@distribuidorasul.com.br"
            className="rounded-xl border-0 bg-surface-container-low p-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container"
          />
        </label>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-space-xs rounded-xl border-2 border-dashed border-primary-fixed-dim bg-surface-container-low p-space-lg text-center">
          <Icon name="upload_file" className="text-[2.5rem] text-primary" />
          <span className="text-label-md text-on-surface">
            {value || 'Escolha a planilha (nome, e-mail, setor e salário opcional)'}
          </span>
          <input
            type="file"
            accept=".csv,.xls,.xlsx"
            aria-label="Planilha de pessoas"
            className="sr-only"
            onChange={(event) => setValue(event.target.files?.[0]?.name ?? '')}
          />
          <span className="text-body-sm text-on-surface-variant">
            O salário só entra na conta de economia; não muda os pontos de ninguém.
          </span>
        </label>
      )}
      <button
        type="button"
        disabled={!ready}
        onClick={send}
        className="flex min-h-[3rem] w-full items-center justify-center rounded-xl bg-primary text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-50"
      >
        Enviar convites
      </button>
    </Modal>
  )
}

type InviteMenuProps = { sectors: InviteSector[]; sector?: string; label?: string }

// sector: the one already picked in the e-mail invite (e.g. from a sector page)
export function InviteMenu({ sectors, sector = '', label = '+ Convidar pessoas' }: InviteMenuProps) {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<Kind | null>(null)

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-12 items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-md transition-all hover:bg-primary-container"
      >
        <Icon name="person_add" className="text-[1.25rem]" />
        <span>{label}</span>
      </button>
      {open && (
        <div className="absolute top-14 right-0 z-50 flex w-64 flex-col gap-1 rounded-xl bg-surface-container-lowest p-space-sm shadow-xl">
          {OPTIONS.map((option) => (
            <button
              key={option.kind}
              type="button"
              onClick={() => {
                setOpen(false)
                setKind(option.kind)
              }}
              className="flex items-center gap-space-sm rounded-lg p-space-sm text-left transition-colors hover:bg-surface-container"
            >
              <Icon name={option.icon} className="text-[1.25rem] text-primary" />
              <div className="flex flex-col">
                <span className="text-label-md text-on-surface">{option.title}</span>
                <span className="text-body-sm text-on-surface-variant">{option.hint}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      {kind && (
        <InviteModal kind={kind} sectors={sectors} initialSector={sector} onClose={() => setKind(null)} />
      )}
    </div>
  )
}

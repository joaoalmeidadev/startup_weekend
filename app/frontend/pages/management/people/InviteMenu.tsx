import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { Modal } from '@/components/Modal'
import { useMockNotice } from '@/components/MockNotice'

type Kind = 'email' | 'sheet'

const OPTIONS: { kind: Kind; icon: string; title: string; hint: string }[] = [
  { kind: 'email', icon: 'mail', title: 'Por e-mail', hint: 'Envio individual rápido' },
  { kind: 'sheet', icon: 'upload_file', title: 'Por planilha (CSV/XLS)', hint: 'Importação em lote' },
]

function InviteModal({ kind, onClose }: { kind: Kind; onClose: () => void }) {
  const notify = useMockNotice()
  const [value, setValue] = useState('')
  const send = () => {
    notify('Convites enviados (simulação).')
    onClose()
  }

  return (
    <Modal icon={kind === 'email' ? 'mail' : 'upload_file'} title="Convidar pessoas" onClose={onClose}>
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
            {value || 'Escolha a planilha (nome, e-mail, setor)'}
          </span>
          <input
            type="file"
            accept=".csv,.xls,.xlsx"
            aria-label="Planilha de pessoas"
            className="sr-only"
            onChange={(event) => setValue(event.target.files?.[0]?.name ?? '')}
          />
        </label>
      )}
      <button
        type="button"
        disabled={!value.trim()}
        onClick={send}
        className="flex min-h-[3rem] w-full items-center justify-center rounded-xl bg-primary text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-50"
      >
        Enviar convites
      </button>
    </Modal>
  )
}

export function InviteMenu() {
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
        <span>+ Convidar pessoas</span>
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
      {kind && <InviteModal kind={kind} onClose={() => setKind(null)} />}
    </div>
  )
}

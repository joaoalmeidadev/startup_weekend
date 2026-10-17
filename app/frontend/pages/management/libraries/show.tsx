import { Head, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { Modal } from '@/components/Modal'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { LibraryModule } from '@/types/management'

function EditModuleModal({ module, onClose }: { module: LibraryModule; onClose: () => void }) {
  const notify = useMockNotice()
  const [name, setName] = useState(module.name)
  const save = () => {
    notify(`"${name}" atualizado para todas as empresas (simulação).`)
    onClose()
  }

  return (
    <Modal icon="edit" title="Editar módulo da Base" onClose={onClose}>
      <label className="flex flex-col gap-space-xs">
        <span className="text-label-md text-on-surface">Nome do módulo</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container"
        />
      </label>
      <span className="text-label-md text-on-surface">Lições</span>
      <ol className="flex flex-col gap-space-xs">
        {module.lesson_titles.map((title, index) => (
          <li
            key={title}
            className="rounded-lg bg-surface-container-low p-space-sm text-body-sm text-on-surface"
          >
            {index + 1}. {title}
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={save}
        className="flex min-h-[3rem] w-full items-center justify-center rounded-xl bg-primary text-label-lg text-on-primary hover:bg-primary-container"
      >
        Salvar
      </button>
    </Modal>
  )
}

function LibraryGrid({ modules }: { modules: LibraryModule[] }) {
  const notify = useMockNotice()
  const [editing, setEditing] = useState<LibraryModule | null>(null)

  return (
    <>
      <button
        type="button"
        onClick={() => notify('Novo módulo da Base chega em breve.')}
        className="inline-flex h-12 w-fit items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container"
      >
        <Icon name="add" className="text-[1.25rem]" />
        Novo módulo
      </button>
      <ul className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <li
            key={module.id}
            className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
          >
            <span className="text-headline-sm text-on-surface">{module.name}</span>
            <span className="text-body-sm text-on-surface-variant">
              {module.competency} · {module.lessons} lições
            </span>
            <button
              type="button"
              onClick={() => setEditing(module)}
              className="mt-auto inline-flex h-10 w-fit items-center gap-space-xs rounded-xl bg-surface-container px-space-md text-label-md text-primary hover:bg-surface-container-high"
            >
              <Icon name="edit" className="text-[1.125rem]" />
              Editar
            </button>
          </li>
        ))}
      </ul>
      {editing && <EditModuleModal module={editing} onClose={() => setEditing(null)} />}
    </>
  )
}

export default function LibrariesShow() {
  const { modules } = usePage<{ modules: LibraryModule[] }>().props

  return (
    <ManagementLayout area="platform">
      <Head title="Biblioteca base" />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <div className="flex flex-col gap-space-xs">
          <span className="text-label-sm font-bold tracking-wider text-primary uppercase">Admin Nivela</span>
          <h1 className="text-headline-xl tracking-tight text-on-surface">Biblioteca base</h1>
          <p className="text-body-md text-on-surface-variant">
            Módulos de matemática, português e comportamento que todas as empresas podem usar no trecho Base.
          </p>
        </div>
        <LibraryGrid modules={modules} />
      </div>
    </ManagementLayout>
  )
}

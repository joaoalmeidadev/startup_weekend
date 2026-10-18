import { router } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/Icon'
import type { Manager } from '@/types/management'

// The manager's name in the top bar opens a small menu to sign out
export function AccountMenu({ manager }: { manager: Manager }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-space-sm rounded-xl px-space-sm py-1 transition-colors hover:bg-surface-container"
      >
        <span className="text-right">
          <span className="block text-label-md leading-tight font-semibold text-on-surface">
            {manager.name}
          </span>
          <span className="block text-label-sm leading-tight text-on-surface-variant">
            {manager.role_label}
          </span>
        </span>
        <span className="flex size-8 items-center justify-center rounded-full bg-primary">
          <Icon name="person" className="text-[1.125rem] text-on-primary" />
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute top-12 right-0 z-50 w-48 rounded-xl bg-surface-container-lowest p-space-xs shadow-xl"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => router.delete('/users/sign_out')}
            className="flex w-full items-center gap-space-sm rounded-lg p-space-sm text-left text-label-lg text-error transition-colors hover:bg-surface-container"
          >
            <Icon name="logout" className="text-[1.25rem]" />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}

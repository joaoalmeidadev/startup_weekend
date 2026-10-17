import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'

type ModalProps = {
  icon: string
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ icon, title, onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-gutter backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-[28.75rem] flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-xl"
      >
        <div className="flex items-center gap-space-sm">
          <Icon name={icon} className="text-[1.75rem] text-primary" />
          <span className="text-headline-md text-on-surface">{title}</span>
        </div>
        {children}
      </div>
    </div>
  )
}

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '@/components/Icon'

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; icon?: string }

// The tactile primary button from the collaborator design system
export function PrimaryButton({
  children,
  icon = 'arrow_forward',
  className = '',
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={`flex h-16 w-full items-center justify-center gap-space-sm rounded-2xl bg-primary-container text-label-lg text-on-primary shadow-[0_4px_0_#0A4349] transition hover:brightness-110 active:translate-y-0.5 active:shadow-[0_2px_0_#0A4349] disabled:opacity-50 disabled:shadow-none ${className}`}
    >
      {children}
      {icon && <Icon name={icon} className="text-[1.5rem]" />}
    </button>
  )
}

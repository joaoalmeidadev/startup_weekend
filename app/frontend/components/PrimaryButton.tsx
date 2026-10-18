import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '@/components/Icon'

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; icon?: string }

// The tactile primary button from the admin buttons, so both sides match
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
      className={`flex h-12 w-full items-center justify-center gap-space-sm rounded-xl bg-primary text-label-lg text-on-primary shadow-md transition-all hover:bg-primary-container disabled:opacity-50 disabled:shadow-none ${className}`}
    >
      {children}
      {icon && <Icon name={icon} className="text-[1.5rem]" />}
    </button>
  )
}

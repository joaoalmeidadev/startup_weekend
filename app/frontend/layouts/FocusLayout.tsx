import { Link } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { MockNoticeProvider } from '@/components/MockNotice'
import { OfflineBanner } from '@/components/OfflineBanner'

type FocusLayoutProps = {
  children: ReactNode
  progress?: number
  closeHref?: string
}

// Distraction-free screens (diagnostic, lesson): only a way out and a thin progress bar
export function FocusLayout({ children, progress, closeHref = '/collaborator/journeys' }: FocusLayoutProps) {
  return (
    <MockNoticeProvider>
      <OfflineBanner />
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[540px] items-center gap-space-md px-gutter">
          <Link
            href={closeHref}
            aria-label="Sair e voltar para a jornada"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
          >
            <Icon name="close" className="text-[1.75rem]" />
          </Link>
          {progress !== undefined && (
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-container-high"
            >
              <div
                className="h-full rounded-full bg-primary-container transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-[540px] flex-col gap-space-lg px-gutter pt-space-md pb-space-xl">
        {children}
      </main>
    </MockNoticeProvider>
  )
}

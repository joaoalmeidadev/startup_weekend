import { Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { MockNoticeProvider } from '@/components/MockNotice'
import { OfflineBanner } from '@/components/OfflineBanner'
import type { Viewer } from '@/types/collaborator'

type NavItem = { href: string; icon: string; label: string; sections?: string[] }

// Início is the gamified home (it took over Meu progresso); Jornadas also covers a journey's modules
const NAV_ITEMS: NavItem[] = [
  {
    href: '/collaborator/home',
    icon: 'home',
    label: 'Início',
    sections: ['/collaborator/home', '/collaborator/progress'],
  },
  {
    href: '/collaborator/journeys',
    icon: 'alt_route',
    label: 'Jornadas',
    sections: ['/collaborator/journey', '/collaborator/modules'],
  },
  { href: '/collaborator/rewards', icon: 'redeem', label: 'Prêmios' },
  { href: '/collaborator/contributions', icon: 'volunteer_activism', label: 'Compartilhar' },
  { href: '/collaborator/profile', icon: 'person', label: 'Perfil' },
]

const ACTIVE = 'bg-primary-container text-on-primary text-body-lg-bold'
const INACTIVE = 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'

function AvatarBadge() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
      <Icon name="person" className="text-[1.125rem] text-on-primary" />
    </div>
  )
}

export function CollaboratorLayout({ children }: { children: ReactNode }) {
  const { url, props } = usePage<{ viewer: Viewer }>()
  const { viewer } = props
  const isActive = (item: NavItem) =>
    (item.sections ?? [item.href]).some((section) => url.startsWith(section))

  return (
    <MockNoticeProvider>
      <OfflineBanner />
      <aside className="fixed top-0 left-0 z-50 hidden h-full w-72 flex-col justify-between bg-surface-container-lowest px-space-md py-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] lg:flex">
        <div className="flex flex-col gap-space-lg">
          <div className="flex items-center gap-space-sm px-space-xs">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary">
              <Icon name="local_shipping" className="text-[1.5rem] text-on-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-headline-md leading-tight text-primary">{viewer.company}</span>
              <span className="text-label-md text-on-surface-variant">Nivela Colaborador</span>
            </div>
          </div>
          <nav className="flex flex-col gap-space-sm" aria-label="Principal">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item) ? 'page' : undefined}
                className={`flex min-h-[3.5rem] items-center gap-space-md rounded-xl p-space-md transition-colors ${isActive(item) ? ACTIVE : INACTIVE}`}
              >
                <Icon name={item.icon} className="text-[1.75rem]" />
                <span className="text-label-lg">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-space-sm rounded-xl bg-surface-container-low p-space-md">
          <AvatarBadge />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-body-lg-bold text-on-surface">{viewer.name}</span>
            <span className="truncate text-label-md text-on-surface-variant">{viewer.sector}</span>
          </div>
        </div>
      </aside>

      <header className="fixed top-0 right-0 left-0 z-40 flex h-20 items-center justify-between bg-surface/80 px-gutter shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-72">
        <span className="text-headline-md font-bold text-primary">Nivela</span>
        <div className="flex items-center gap-space-md">
          <div className="hidden flex-col text-right sm:flex">
            <span className="text-body-lg-bold text-on-surface">
              {viewer.name} ({viewer.sector})
            </span>
            <span className="text-label-md text-on-surface-variant">{viewer.company}</span>
          </div>
          <AvatarBadge />
        </div>
      </header>

      <main className="relative min-h-screen w-full bg-surface px-gutter pt-20 pb-28 lg:pb-0 lg:pl-[calc(18rem+1.25rem)]">
        {children}
      </main>

      <nav
        aria-label="Principal no celular"
        className="fixed right-0 bottom-0 left-0 z-40 flex border-t border-slate-200 bg-surface-container-lowest lg:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-[4.5rem] flex-1 flex-col items-center justify-center gap-1 text-label-md ${isActive(item) ? 'text-primary-container' : 'text-on-surface-variant'}`}
          >
            <Icon name={item.icon} className="text-[1.75rem]" filled={isActive(item)} />
            {item.label}
          </Link>
        ))}
      </nav>
    </MockNoticeProvider>
  )
}

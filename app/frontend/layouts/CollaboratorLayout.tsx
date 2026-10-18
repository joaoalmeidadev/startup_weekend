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

// Same sizes and colors as ManagementLayout, so both sides of the platform look like one product
const ITEM = 'flex min-h-[3rem] w-full items-center gap-space-sm rounded-xl px-space-md transition-all'
const ACTIVE = 'bg-primary-container font-semibold text-on-primary shadow-[0_2px_12px_rgba(15,94,102,0.12)]'
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
    <div className="min-h-screen bg-surface text-body-md text-on-surface">
      <MockNoticeProvider>
        <OfflineBanner />
        <aside className="fixed top-0 left-0 z-40 hidden h-full w-72 flex-col justify-between bg-surface-container-low p-space-md lg:flex">
          <div className="flex flex-col gap-space-lg">
            <div className="flex items-center gap-space-sm px-space-sm pt-space-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-headline-md font-bold text-on-primary">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-headline-sm leading-tight font-bold text-primary">Nivela</span>
                <span className="text-label-sm font-semibold text-on-surface-variant">{viewer.company}</span>
              </div>
            </div>
            <nav className="flex flex-col gap-space-xs" aria-label="Principal">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item) ? 'page' : undefined}
                  className={`${ITEM} ${isActive(item) ? ACTIVE : INACTIVE}`}
                >
                  <Icon name={item.icon} className="text-[1.5rem]" />
                  <span className="text-label-lg">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <AvatarBadge />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-label-lg text-on-surface">{viewer.name}</span>
              <span className="truncate text-label-sm font-semibold text-on-surface-variant">
                {viewer.sector}
              </span>
            </div>
          </div>
        </aside>

        <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between bg-surface/80 px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-72 lg:justify-end">
          <span className="text-headline-sm font-bold text-primary lg:hidden">Nivela</span>
          <div className="flex items-center gap-space-sm">
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-label-lg text-on-surface">{viewer.name}</span>
              <span className="text-label-sm font-semibold text-on-surface-variant">{viewer.sector}</span>
            </div>
            <AvatarBadge />
          </div>
        </header>

        <div className="w-full lg:pl-72">
          <main className="min-h-screen w-full px-space-lg pt-16 pb-28 lg:pb-space-xl">{children}</main>
        </div>

        <nav
          aria-label="Principal no celular"
          className="fixed right-0 bottom-0 left-0 z-40 flex border-t border-outline-variant/40 bg-surface-container-lowest lg:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[4rem] flex-1 flex-col items-center justify-center gap-0.5 text-label-sm ${isActive(item) ? 'text-primary-container' : 'text-on-surface-variant'}`}
            >
              <Icon name={item.icon} className="text-[1.5rem]" filled={isActive(item)} />
              {item.label}
            </Link>
          ))}
        </nav>
      </MockNoticeProvider>
    </div>
  )
}

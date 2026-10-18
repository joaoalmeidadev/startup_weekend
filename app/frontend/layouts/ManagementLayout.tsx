import { Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { MockNoticeProvider, useMockNotice } from '@/components/MockNotice'
import type { Manager } from '@/types/management'

type NavItem = { icon: string; label: string; href: string; sections?: string[]; exact?: boolean }

const NAV: NavItem[] = [
  { icon: 'dashboard', label: 'Dashboard', href: '/management', exact: true },
  { icon: 'route', label: 'Jornadas', href: '/management/journeys' },
  {
    icon: 'groups',
    label: 'Setores',
    href: '/management/sectors',
    sections: ['/management/sectors', '/management/people'],
  },
  {
    icon: 'library_books',
    label: 'Biblioteca',
    href: '/management/library',
    sections: ['/management/library', '/management/modules', '/management/lesson_reviews'],
  },
  { icon: 'redeem', label: 'Recompensas', href: '/management/rewards' },
]

const ITEM = 'flex min-h-[3rem] w-full items-center gap-space-sm rounded-xl px-space-md transition-all'
const ACTIVE = 'bg-primary-container font-semibold text-on-primary shadow-[0_2px_12px_rgba(15,94,102,0.12)]'
const INACTIVE = 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'

// The dashboard also answers with a period filter, e.g. /management?period=30d
function isActive(item: NavItem, url: string) {
  if (item.exact) return url.split('?')[0] === item.href
  return (item.sections ?? [item.href]).some((section) => url.startsWith(section))
}

function SideNav() {
  const { url } = usePage()

  return (
    <nav className="flex flex-col gap-space-xs" aria-label="Gestão">
      {NAV.map((item) => {
        const active = isActive(item, url)
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`${ITEM} ${active ? ACTIVE : INACTIVE}`}
          >
            <Icon name={item.icon} className="text-[1.5rem]" />
            <span className="text-label-lg">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function SupportCard() {
  const notify = useMockNotice()
  return (
    <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-lowest p-space-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-space-xs text-primary">
        <Icon name="support_agent" className="text-[1.25rem]" />
        <span className="text-label-md font-bold text-primary">Precisa de suporte?</span>
      </div>
      <p className="text-body-sm text-on-surface-variant">
        Fale com a equipe Nivela para orientações e dúvidas.
      </p>
      <button
        type="button"
        onClick={() => notify('O chat com o suporte chega em breve.')}
        className="mt-space-xs inline-flex items-center gap-space-xs text-label-sm font-semibold text-primary transition-colors hover:text-primary-container"
      >
        <Icon name="chat" className="text-[1rem]" />
        Falar com Suporte
      </button>
    </div>
  )
}

export function ManagementLayout({ children }: { children: ReactNode }) {
  const { manager } = usePage<{ manager: Manager }>().props

  return (
    <div className="theme-management min-h-screen bg-surface text-body-md text-on-surface">
      <MockNoticeProvider>
        <aside className="fixed top-0 left-0 z-40 hidden h-full w-72 flex-col justify-between bg-surface-container-low p-space-md lg:flex">
          <div className="flex flex-col gap-space-lg">
            <div className="flex items-center gap-space-sm px-space-sm pt-space-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-headline-md font-bold text-on-primary">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-headline-sm leading-tight font-bold text-primary">Nivela</span>
                <span className="text-label-sm font-semibold text-on-surface-variant">{manager.company}</span>
              </div>
            </div>
            <SideNav />
          </div>
          <SupportCard />
        </aside>

        <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-end bg-surface/80 px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-72">
          <div className="flex items-center gap-space-sm">
            <div className="text-right">
              <span className="block text-label-md leading-tight font-semibold text-on-surface">
                {manager.name}
              </span>
              <span className="block text-label-sm leading-tight text-on-surface-variant">
                {manager.role_label}
              </span>
            </div>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary">
              <Icon name="person" className="text-[1.125rem] text-on-primary" />
            </div>
          </div>
        </header>

        <div className="w-full lg:pl-72">
          <main className="min-h-screen w-full px-space-lg pt-16 pb-space-xl">{children}</main>
        </div>
      </MockNoticeProvider>
    </div>
  )
}

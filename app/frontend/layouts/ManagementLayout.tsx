import { Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { MockNoticeProvider, useMockNotice } from '@/components/MockNotice'
import type { Manager } from '@/types/management'

type NavItem = { icon: string; label: string; href: string; sections?: string[]; exact?: boolean }
type Area = 'company' | 'team' | 'platform'

const COMPANY_NAV: NavItem[] = [
  { icon: 'dashboard', label: 'Início', href: '/management', exact: true },
  { icon: 'group', label: 'Pessoas', href: '/management/people' },
  {
    icon: 'route',
    label: 'Jornadas',
    href: '/management/journeys',
    sections: ['/management/journeys', '/management/modules', '/management/lesson_reviews'],
  },
  { icon: 'tune', label: 'Meta', href: '/management/sector_goal' },
  { icon: 'settings', label: 'Configurações', href: '/management/settings' },
]

// Gestor: only their own team (Atendimento in the mock)
const TEAM_NAV: NavItem[] = [
  { icon: 'monitoring', label: 'Dashboard', href: '/management/team' },
  { icon: 'groups', label: 'Minha equipe', href: '/management/people?team=1' },
]

// Admin Nivela: the Nivela team looking at every client company
const PLATFORM_NAV: NavItem[] = [
  { icon: 'domain', label: 'Empresas', href: '/management/companies' },
  { icon: 'local_library', label: 'Biblioteca base', href: '/management/library' },
]

const NAV_BY_AREA: Record<Area, NavItem[]> = { company: COMPANY_NAV, team: TEAM_NAV, platform: PLATFORM_NAV }

const ITEM = 'flex min-h-[3rem] w-full items-center gap-space-sm rounded-xl px-space-md transition-all'
const ACTIVE = 'bg-primary-container font-semibold text-on-primary shadow-[0_2px_12px_rgba(15,94,102,0.12)]'
const INACTIVE = 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'

function SideNav({ area }: { area: Area }) {
  const { url } = usePage()

  return (
    <nav className="flex flex-col gap-space-xs" aria-label="Gestão">
      {NAV_BY_AREA[area].map((item) => {
        const active = item.exact
          ? url === item.href
          : (item.sections ?? [item.href]).some((section) => url.startsWith(section))
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

const SWITCH = 'rounded-lg px-space-md py-1 text-label-sm'
const SWITCH_ON =
  'bg-surface-container-lowest font-semibold text-on-surface shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
const SWITCH_OFF = 'text-on-surface-variant transition-colors hover:text-on-surface'

const SWITCHES: { area: Area; label: string; href: string }[] = [
  { area: 'company', label: 'RH', href: '/management' },
  { area: 'team', label: 'Gestor', href: '/management/team' },
  { area: 'platform', label: 'Admin Nivela', href: '/management/companies' },
]

function RoleSwitcher({ area }: { area: Area }) {
  return (
    <nav className="flex rounded-lg bg-surface-container-high p-space-xs" aria-label="Visão">
      {SWITCHES.map((item) => (
        <Link
          key={item.area}
          href={item.href}
          aria-current={area === item.area ? 'page' : undefined}
          className={`${SWITCH} ${area === item.area ? SWITCH_ON : SWITCH_OFF}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export function ManagementLayout({ children, area = 'company' }: { children: ReactNode; area?: Area }) {
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
                <span className="text-label-sm font-semibold text-on-surface-variant">
                  {area === 'platform' ? 'Admin Nivela' : manager.company}
                </span>
              </div>
            </div>
            <SideNav area={area} />
          </div>
          <SupportCard />
        </aside>

        <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between bg-surface/80 px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-72">
          <RoleSwitcher area={area} />
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

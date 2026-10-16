import { Link, router, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { FlashMessages } from '@/components/FlashMessages'

type AppLayoutProps = {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { current_user, flash } = usePage().props

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <Link href="/" className="font-semibold">
            App
          </Link>
          {current_user ? (
            <div className="flex items-center gap-4 text-sm">
              <span>{current_user.email}</span>
              <button type="button" onClick={() => router.delete('/users/sign_out')} className="underline">
                Sair
              </button>
            </div>
          ) : (
            <div className="flex gap-4 text-sm">
              <Link href="/users/sign_in">Entrar</Link>
              <Link href="/users/sign_up">Criar conta</Link>
            </div>
          )}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl space-y-4 p-4">
        <FlashMessages flash={flash} />
        {children}
      </main>
    </div>
  )
}

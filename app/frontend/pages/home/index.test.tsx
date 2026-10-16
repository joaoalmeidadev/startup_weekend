import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SharedProps } from '@/types'
import HomeIndex from './index'

const pageProps: { props: SharedProps } = { props: { current_user: null, flash: {} } }

vi.mock('@inertiajs/react', () => ({
  Head: () => null,
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
  router: { delete: vi.fn() },
  usePage: () => pageProps,
}))

describe('HomeIndex', () => {
  beforeEach(() => {
    pageProps.props = { current_user: null, flash: {} }
  })

  it('welcomes guests and offers login', () => {
    render(<HomeIndex />)

    expect(screen.getByRole('heading', { name: 'Bem-vindo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/users/sign_in')
  })

  it('greets the signed-in user', () => {
    pageProps.props = { current_user: { id: 1, email: 'jane@example.com' }, flash: {} }

    render(<HomeIndex />)

    expect(screen.getByRole('heading', { name: 'Olá, jane@example.com' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
  })
})

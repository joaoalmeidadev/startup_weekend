import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SharedProps } from '@/types'
import SessionsNew from './new'

const pageProps: { props: SharedProps } = { props: { current_user: null, flash: {} } }
const post = vi.fn()

vi.mock('@inertiajs/react', async () => {
  const { useState } = await import('react')
  return {
    Head: () => null,
    usePage: () => pageProps,
    useForm: (initial: Record<string, string>) => {
      const [data, setDataState] = useState(initial)
      return {
        data,
        processing: false,
        setData: (key: string, value: string) => setDataState((current) => ({ ...current, [key]: value })),
        transform: vi.fn(),
        post,
      }
    },
  }
})

describe('SessionsNew', () => {
  beforeEach(() => {
    pageProps.props = { current_user: null, flash: {} }
    post.mockClear()
  })

  it('submits the e-mail and password to the session endpoint', async () => {
    render(<SessionsNew />)

    await userEvent.type(screen.getByLabelText('E-mail'), 'maria@example.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /Entrar/ }))

    expect(post).toHaveBeenCalledWith('/users/sign_in')
  })

  it('shows the alert from a failed attempt', () => {
    pageProps.props = { current_user: null, flash: { alert: 'E-mail ou senha incorretos.' } }

    render(<SessionsNew />)

    expect(screen.getByRole('alert')).toHaveTextContent('E-mail ou senha incorretos.')
  })

  it('tells people who to ask when they forget the password', () => {
    render(<SessionsNew />)

    expect(screen.getByText(/fale com o RH da sua empresa/i)).toBeInTheDocument()
  })
})

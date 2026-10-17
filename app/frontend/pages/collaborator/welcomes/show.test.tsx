import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { viewer } from '@/test/collaboratorFixtures'
import { page, router } from '@/test/inertiaMock'
import WelcomesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('WelcomesShow', () => {
  beforeEach(() => {
    page.url = '/collaborator/welcome'
    page.props = { viewer }
    router.visit.mockClear()
  })

  it('greets the collaborator and starts the diagnostic', async () => {
    render(<WelcomesShow />)

    expect(screen.getByRole('heading', { name: 'Oi, Maria!' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Começar/ }))

    expect(router.visit).toHaveBeenCalledWith('/collaborator/diagnostic')
  })
})

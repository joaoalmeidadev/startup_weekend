import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { router } from '@/test/inertiaMock'
import { OfflineBanner } from './OfflineBanner'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('OfflineBanner', () => {
  it('appears when the connection drops and offers a retry', async () => {
    render(<OfflineBanner />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    expect(screen.getByRole('alert')).toHaveTextContent('Sem conexão')
    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(router.reload).toHaveBeenCalled()

    act(() => {
      window.dispatchEvent(new Event('online'))
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

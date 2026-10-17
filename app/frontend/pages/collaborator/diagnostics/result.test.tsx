import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { diagnosticResult, viewer } from '@/test/collaboratorFixtures'
import { page, router } from '@/test/inertiaMock'
import DiagnosticsResult from './result'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('DiagnosticsResult', () => {
  beforeEach(() => {
    page.url = '/collaborator/diagnostic/result'
    page.props = { result: diagnosticResult, viewer }
    router.visit.mockClear()
  })

  it('splits what the person knows from what the journey will teach', async () => {
    render(<DiagnosticsResult />)

    expect(screen.getByRole('heading', { name: /Você já sabe/ })).toBeInTheDocument()
    expect(screen.getByText('• Porcentagem')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Ver minha jornada/ }))
    expect(router.visit).toHaveBeenCalledWith('/collaborator/journey')
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { diagnosticQuestions, viewer } from '@/test/collaboratorFixtures'
import { page, router } from '@/test/inertiaMock'
import DiagnosticsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('DiagnosticsShow', () => {
  beforeEach(() => {
    page.url = '/collaborator/diagnostic'
    page.props = { diagnostic: { questions: diagnosticQuestions }, viewer }
    router.visit.mockClear()
  })

  it('asks one question at a time and only continues after an answer', async () => {
    render(<DiagnosticsShow />)

    expect(screen.getByText('Pergunta 1 de 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Continuar/ })).toBeDisabled()

    await userEvent.click(screen.getByRole('radio', { name: /R\$ 20/ }))
    await userEvent.click(screen.getByRole('button', { name: /Continuar/ }))

    expect(screen.getByText('Pergunta 2 de 2')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cliente irritado. O que você faz?' })).toBeInTheDocument()
  })

  it('goes to the result after the last question', async () => {
    render(<DiagnosticsShow />)

    await userEvent.click(screen.getByRole('radio', { name: /R\$ 20/ }))
    await userEvent.click(screen.getByRole('button', { name: /Continuar/ }))
    await userEvent.click(screen.getByRole('radio', { name: /Escuto/ }))
    await userEvent.click(screen.getByRole('button', { name: /Ver meu resultado/ }))

    expect(router.visit).toHaveBeenCalledWith('/collaborator/diagnostic/result')
  })
})

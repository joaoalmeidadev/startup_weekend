import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import LibrariesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('LibrariesShow', () => {
  beforeEach(() => {
    page.url = '/management/library'
    page.props = {
      modules: [
        {
          id: 'conversa-clara',
          name: 'Conversa Clara',
          competency: 'Comunicação clara',
          lessons: 1,
          status: 'published',
          lesson_titles: ['Ouvir antes de responder'],
        },
      ],
      manager,
    }
  })

  it('edits a base module (simulated)', async () => {
    render(<LibrariesShow />)

    await userEvent.click(screen.getByRole('button', { name: /Editar/ }))
    expect(screen.getByText('1. Ouvir antes de responder')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      '"Conversa Clara" atualizado para todas as empresas (simulação).',
    )
  })
})

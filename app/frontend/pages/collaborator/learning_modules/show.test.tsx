import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { viewer } from '@/test/collaboratorFixtures'
import { page, router } from '@/test/inertiaMock'
import CollaboratorModuleShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const learningModule = {
  name: 'Rotinas da Distribuidora',
  done: 1,
  lessons: [
    { title: 'Chegada do caminhão', status: 'done' as const },
    { title: 'Do caminhão à prateleira', status: 'current' as const },
    { title: 'Separação de pedidos', status: 'locked' as const },
  ],
  continue_path: '/collaborator/lessons/rotinas-da-distribuidora',
}

describe('CollaboratorModuleShow', () => {
  beforeEach(() => {
    page.url = '/collaborator/modules/rotinas-da-distribuidora'
    page.props = { learning_module: learningModule, viewer }
    router.visit.mockClear()
  })

  it('shows the module progress and every lesson in order', () => {
    render(<CollaboratorModuleShow />)

    expect(screen.getByText('1 de 3 lições · uns 5 minutos cada')).toBeInTheDocument()
    expect(screen.getByText('3. Separação de pedidos')).toBeInTheDocument()
  })

  it('continues from the current lesson', async () => {
    render(<CollaboratorModuleShow />)

    await userEvent.click(screen.getByRole('button', { name: /Continuar lição/ }))

    expect(router.visit).toHaveBeenCalledWith('/collaborator/lessons/rotinas-da-distribuidora')
  })

  it('has nothing to continue in a finished module', () => {
    page.props = { learning_module: { ...learningModule, continue_path: null }, viewer }
    render(<CollaboratorModuleShow />)

    expect(screen.queryByRole('button', { name: /Continuar lição/ })).not.toBeInTheDocument()
  })
})

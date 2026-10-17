import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import SetupsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const steps = [
  {
    title: 'Empresa e logo',
    icon: 'apartment',
    done: true,
    fields: [{ label: 'Nome da empresa', value: 'Distribuidora Sul' }],
  },
  { title: 'Cultura e valores', icon: 'favorite', done: false, fields: [{ label: 'Missão', value: '' }] },
]

describe('SetupsShow', () => {
  beforeEach(() => {
    page.url = '/management/setup'
    page.props = { steps, manager }
  })

  it('opens the first pending step', () => {
    render(<SetupsShow />)

    expect(screen.getByText('1 de 2 passos concluídos')).toBeInTheDocument()
    expect(screen.getByLabelText('Missão')).toBeInTheDocument()
  })

  it('marks a step as done when saved and offers to go home once all are done', async () => {
    render(<SetupsShow />)

    await userEvent.type(screen.getByLabelText('Missão'), 'Entregar no prazo')
    await userEvent.click(screen.getByRole('button', { name: /Salvar/ }))

    expect(screen.getByText('2 de 2 passos concluídos')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Tudo pronto/ })).toHaveAttribute('href', '/management')
  })
})

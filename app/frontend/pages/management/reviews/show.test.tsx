import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import ReviewsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('ReviewsShow', () => {
  beforeEach(() => {
    page.url = '/management/people/maria-souza/review'
    page.props = {
      review: {
        person: { id: 'maria-souza', name: 'Maria Souza' },
        statements: ['explica as coisas com clareza?', 'ajuda os colegas?'],
        scale: ['Nunca', 'Sempre'],
      },
      manager,
    }
  })

  it('only sends after every statement is answered', async () => {
    render(<ReviewsShow />)

    const send = screen.getByRole('button', { name: /Enviar avaliação/ })
    expect(send).toBeDisabled()

    const always = screen.getAllByRole('button', { name: 'Sempre' })
    await userEvent.click(always[0])
    expect(send).toBeDisabled()
    await userEvent.click(always[1])

    expect(send).toBeEnabled()
    await userEvent.click(send)
    expect(screen.getByRole('status')).toHaveTextContent('Avaliação de Maria Souza enviada (simulação).')
  })
})

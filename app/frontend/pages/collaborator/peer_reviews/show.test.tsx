import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { viewer } from '@/test/collaboratorFixtures'
import { page } from '@/test/inertiaMock'
import PeerReviewsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('PeerReviewsShow', () => {
  beforeEach(() => {
    page.url = '/collaborator/peer_review'
    page.props = {
      peer_review: {
        colleagues: [{ name: 'Joana Lima', sector: 'Atendimento' }],
        statements: ['explica as coisas com clareza?', 'ajuda os colegas?'],
        scale: ['Nunca', 'Sempre'],
      },
      viewer,
    }
  })

  it('asks one statement about the colleague per screen', async () => {
    render(<PeerReviewsShow />)

    expect(screen.getByRole('heading', { name: 'Joana explica as coisas com clareza?' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Sempre' }))

    expect(screen.getByRole('heading', { name: 'Joana ajuda os colegas?' })).toBeInTheDocument()
  })

  it('thanks the collaborator at the end, even when skipping', async () => {
    render(<PeerReviewsShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Pular' }))
    await userEvent.click(screen.getByRole('button', { name: 'Nunca' }))

    expect(screen.getByRole('heading', { name: 'Obrigado!' })).toBeInTheDocument()
  })
})

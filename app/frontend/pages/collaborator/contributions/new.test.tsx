import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { contributionForm, viewer } from '@/test/collaboratorFixtures'
import { page, router } from '@/test/inertiaMock'
import ContributionsNew from './new'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const send = () => screen.getByRole('button', { name: 'Enviar para aprovação' })

async function fillJourney() {
  await userEvent.type(screen.getByLabelText('Nome da jornada'), 'Clientes difíceis')
  await userEvent.selectOptions(screen.getByLabelText('Para quem é'), 'Atendimento')
  await userEvent.type(screen.getByLabelText(/Quanto tempo levaria/), '2')
}

async function fillLesson(number: number) {
  await userEvent.type(screen.getByLabelText(`Título da lição ${number}`), 'Ouvir sem interromper')
  await userEvent.type(screen.getByLabelText(`Texto da lição ${number}`), 'Deixe o cliente terminar.')
  await userEvent.type(screen.getByLabelText(`Pergunta da lição ${number}`), 'Primeiro passo?')
  for (const letter of ['A', 'B', 'C'])
    await userEvent.type(screen.getByLabelText(`Alternativa ${letter} da lição ${number}`), `Opção ${letter}`)
  await userEvent.click(screen.getByLabelText(`Correta: alternativa A da lição ${number}`))
}

describe('ContributionsNew', () => {
  beforeEach(() => {
    page.url = '/collaborator/contributions/new'
    page.props = { ...contributionForm, viewer }
    router.visit.mockClear()
  })

  it('goes back to her proposals', () => {
    render(<ContributionsNew />)

    expect(screen.getByRole('link', { name: 'Voltar' })).toHaveAttribute(
      'href',
      '/collaborator/contributions',
    )
  })

  it('offers the sectors as who the journey is for', () => {
    render(<ContributionsNew />)

    expect(screen.getByRole('option', { name: 'Logística' })).toBeInTheDocument()
  })

  it('estimates the points from the hours, saying the RH decides', async () => {
    render(<ContributionsNew />)

    await userEvent.type(screen.getByLabelText(/Quanto tempo levaria/), '1,5')

    expect(screen.getByText('Se aprovada, você pode ganhar cerca de 6 pts')).toBeInTheDocument()
    expect(screen.getByText(/o RH decide os pontos na aprovação/)).toBeInTheDocument()
  })

  it('keeps sending disabled and says what is missing', async () => {
    render(<ContributionsNew />)

    expect(send()).toBeDisabled()
    expect(screen.getByText('Dê um nome para a jornada.')).toBeInTheDocument()

    await fillJourney()
    expect(send()).toBeDisabled()
    expect(screen.queryByText('Dê um nome para a jornada.')).not.toBeInTheDocument()
    expect(screen.getByText('Dê um título para a lição 1.')).toBeInTheDocument()
  })

  it('asks for the file when the lesson is a video', async () => {
    render(<ContributionsNew />)
    await fillJourney()
    await fillLesson(1)

    await userEvent.selectOptions(screen.getByLabelText('Formato da lição 1'), 'Vídeo')
    expect(screen.getByText('Envie o vídeo da lição 1.')).toBeInTheDocument()

    const file = new File(['x'], 'atendimento.mp4', { type: 'video/mp4' })
    await userEvent.upload(screen.getByLabelText('Enviar o vídeo da lição 1'), file)
    expect(screen.getByText('atendimento.mp4')).toBeInTheDocument()
    expect(send()).toBeEnabled()
  })

  it('requires every added lesson to be complete', async () => {
    render(<ContributionsNew />)
    await fillJourney()
    await fillLesson(1)

    await userEvent.click(screen.getByRole('button', { name: 'Adicionar lição' }))
    expect(send()).toBeDisabled()
    expect(screen.getByText('Dê um título para a lição 2.')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Remover lição 2' }))
    expect(send()).toBeEnabled()
  })

  it('sends a complete proposal and goes back to her proposals', async () => {
    render(<ContributionsNew />)
    await fillJourney()
    await fillLesson(1)

    await userEvent.click(send())

    expect(screen.getByRole('status')).toHaveTextContent('Enviada! O RH vai analisar (simulação).')
    await waitFor(() => expect(router.visit).toHaveBeenCalledWith('/collaborator/contributions'), {
      timeout: 2000,
    })
  })
})

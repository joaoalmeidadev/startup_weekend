import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { microLesson, viewer } from '@/test/collaboratorFixtures'
import { page } from '@/test/inertiaMock'
import LessonsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

async function reachQuestion() {
  await userEvent.click(screen.getByRole('button', { name: /^Continuar/ }))
  await userEvent.click(screen.getByRole('button', { name: /Entendi, vamos praticar/ }))
}

describe('LessonsShow', () => {
  beforeEach(() => {
    page.url = '/collaborator/lessons/rotinas-da-distribuidora'
    page.props = { lesson: microLesson, viewer }
  })

  it('walks from the video to the explanation', async () => {
    render(<LessonsShow />)

    expect(screen.getByRole('heading', { name: 'Do caminhão à prateleira' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /^Continuar/ }))

    expect(screen.getByText('Toda mercadoria passa pela conferência.')).toBeInTheDocument()
  })

  it('gives a hint on a wrong answer and keeps the lesson open', async () => {
    render(<LessonsShow />)
    await reachQuestion()

    await userEvent.click(screen.getByRole('button', { name: 'Guardar no estoque.' }))

    expect(screen.getByRole('status')).toHaveTextContent('Quase! Confira antes.')
    expect(screen.getByRole('button', { name: /Concluir lição/ })).toBeDisabled()
  })

  it('celebrates the module after the right answer', async () => {
    render(<LessonsShow />)
    await reachQuestion()

    await userEvent.click(screen.getByRole('button', { name: 'Anotar e avisar.' }))
    await userEvent.click(screen.getByRole('button', { name: /Concluir lição/ }))

    expect(screen.getByText('+20 pontos')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Parabéns!' })).toBeInTheDocument()
  })
})

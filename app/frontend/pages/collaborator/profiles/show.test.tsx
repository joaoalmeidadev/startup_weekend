import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { profile, viewer } from '@/test/collaboratorFixtures'
import { page, router } from '@/test/inertiaMock'
import ProfilesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('ProfilesShow', () => {
  beforeEach(() => {
    page.url = '/collaborator/profile'
    page.props = { profile, viewer }
    router.delete.mockClear()
  })

  it('changes the reminder time through the modal', async () => {
    render(<ProfilesShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Mudar horário do lembrete' }))
    await userEvent.click(screen.getByRole('button', { name: '08:00' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar horário' }))

    expect(screen.getByText('Ativado • Todo dia às 08:00')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renames how the collaborator appears in the ranking', async () => {
    render(<ProfilesShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Alterar como apareço no ranking' }))
    const input = screen.getByLabelText('Seu nome ou apelido')
    await userEvent.clear(input)
    await userEvent.type(input, 'Mari')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar nome' }))

    expect(screen.getByText('Mostrando como: Mari')).toBeInTheDocument()
  })

  it('keeps the previous name when the field is left blank', async () => {
    render(<ProfilesShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Alterar como apareço no ranking' }))
    await userEvent.clear(screen.getByLabelText('Seu nome ou apelido'))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar nome' }))

    expect(screen.getByText('Mostrando como: Maria Souza')).toBeInTheDocument()
  })

  it('signs out for real', async () => {
    render(<ProfilesShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Sair da minha conta' }))

    expect(router.delete).toHaveBeenCalledWith('/users/sign_out')
  })
})

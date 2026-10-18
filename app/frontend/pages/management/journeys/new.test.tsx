import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { audienceOptions, manager } from '@/test/managementFixtures'
import { page, router } from '@/test/inertiaMock'
import JourneysNew from './new'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const create = () => screen.getByRole('button', { name: 'Criar e escolher conteúdos' })

describe('JourneysNew', () => {
  beforeEach(() => {
    router.visit.mockClear()
    page.url = '/management/journeys/new'
    page.props = { audience_options: audienceOptions, people: ['Maria Souza', 'Marcos Oliveira'], manager }
  })

  it('asks for the name, the kind and who receives the journey', () => {
    render(<JourneysNew />)

    expect(screen.getByRole('heading', { level: 1, name: 'Nova jornada' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Nome da jornada' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Base' })).toHaveAccessibleDescription(
      'Habilidades gerais que todo mundo precisa',
    )
    expect(screen.getByRole('radio', { name: 'Empresa' })).toHaveAccessibleDescription(
      'Cultura, processos e o jeito da empresa',
    )
    expect(screen.getByRole('radio', { name: 'Setor' })).toHaveAccessibleDescription(
      'O dia a dia de um setor',
    )
    expect(screen.getByRole('radio', { name: 'Setores e grupos' })).toBeChecked()
    expect(screen.queryByRole('checkbox', { name: /Novatos/ })).not.toBeInTheDocument()
  })

  it('needs a name, a kind and someone to receive it', async () => {
    render(<JourneysNew />)

    await userEvent.type(screen.getByRole('textbox', { name: 'Nome da jornada' }), 'Comercial na prática')
    expect(create()).toBeDisabled()
    await userEvent.click(screen.getByRole('radio', { name: 'Setor' }))
    expect(create()).toBeDisabled()
    await userEvent.click(screen.getByRole('checkbox', { name: /Comercial/ }))

    expect(create()).toBeEnabled()
  })

  it('creates the journey (simulation) and goes on to pick its contents', async () => {
    render(<JourneysNew />)

    await userEvent.type(screen.getByRole('textbox', { name: 'Nome da jornada' }), 'Comercial na prática')
    await userEvent.click(screen.getByRole('radio', { name: 'Setor' }))
    await userEvent.click(screen.getByRole('checkbox', { name: /Comercial/ }))
    await userEvent.click(create())

    expect(screen.getByRole('status')).toHaveTextContent('Jornada "Comercial na prática" criada (simulação).')
    expect(router.visit).toHaveBeenCalledWith('/management/journeys/atendimento-na-pratica')
  })

  it('can go to specific people, opening a journey of the chosen kind', async () => {
    render(<JourneysNew />)

    await userEvent.type(screen.getByRole('textbox', { name: 'Nome da jornada' }), 'Mentoria')
    await userEvent.click(screen.getByRole('radio', { name: 'Empresa' }))
    await userEvent.click(screen.getByRole('radio', { name: 'Pessoas específicas' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Maria Souza' }))
    await userEvent.click(create())

    expect(router.visit).toHaveBeenCalledWith('/management/journeys/promocao-para-lider')
  })

  it('opens the Base Nivela for a new base journey', async () => {
    render(<JourneysNew />)

    await userEvent.type(screen.getByRole('textbox', { name: 'Nome da jornada' }), 'Base')
    await userEvent.click(screen.getByRole('radio', { name: 'Base' }))
    await userEvent.click(screen.getByRole('checkbox', { name: /Staff/ }))
    await userEvent.click(create())

    expect(router.visit).toHaveBeenCalledWith('/management/journeys/base-nivela')
  })
})

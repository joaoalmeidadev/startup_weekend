import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, newSectorProps } from '@/test/managementFixtures'
import { page, router } from '@/test/inertiaMock'
import SectorsNew from './new'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const createButton = () => screen.getByRole('button', { name: /Criar/ })
const ruler = (name: string) => screen.getByLabelText(`Meta de ${name}`) as HTMLInputElement

describe('SectorsNew', () => {
  beforeEach(() => {
    page.url = '/management/sectors/new'
    page.props = { ...newSectorProps, manager }
    router.visit.mockClear()
  })

  afterEach(() => vi.useRealTimers())

  it('builds the sector in three numbered blocks', () => {
    render(<SectorsNew />)

    expect(screen.getByRole('heading', { name: 'Novo setor', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Voltar para Setores/ })).toHaveAttribute(
      'href',
      '/management/sectors',
    )
    expect(screen.getByRole('region', { name: '1. Nome' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: '2. Pessoas' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: '3. Meta' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Setor de trabalho/ })).toBeChecked()
  })

  it('picks people with a search and counts the selected ones', async () => {
    render(<SectorsNew />)

    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    await userEvent.type(screen.getByLabelText('Buscar pessoas'), 'lucas')
    expect(screen.getAllByRole('checkbox')).toHaveLength(1)
    expect(screen.getByText('Comercial')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('checkbox', { name: /Lucas Pereira/ }))

    expect(screen.getByText('1 pessoa selecionada')).toBeInTheDocument()
  })

  it('moves the Base competencies rulers to the chosen level', async () => {
    render(<SectorsNew />)

    expect(screen.queryByLabelText('Meta de Comunicação')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: /Médio/ }))

    expect(ruler('Comunicação').value).toBe('75')
    expect(ruler('Raciocínio').value).toBe('75')
  })

  it('needs a name and a level, then creates the work sector (simulated)', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<SectorsNew />)

    expect(createButton()).toBeDisabled()
    await userEvent.type(screen.getByLabelText('Nome'), 'Financeiro')
    expect(createButton()).toBeDisabled()
    await userEvent.click(screen.getByRole('radio', { name: /Fácil/ }))
    await userEvent.click(createButton())

    expect(screen.getByRole('status')).toHaveTextContent('Setor Financeiro criado (simulação).')
    act(() => vi.runAllTimers())
    expect(router.visit).toHaveBeenCalledWith('/management/sectors/staff')
  })

  it('needs at least one person for a group', async () => {
    render(<SectorsNew />)

    await userEvent.click(screen.getByRole('radio', { name: /Grupo/ }))
    await userEvent.type(screen.getByLabelText('Nome'), 'Brigada')
    await userEvent.click(screen.getByRole('radio', { name: /Fácil/ }))
    expect(createButton()).toBeDisabled()
    expect(screen.getByText('Escolha ao menos uma pessoa para o grupo.')).toBeInTheDocument()

    const people = within(screen.getByRole('region', { name: '2. Pessoas' }))
    await userEvent.click(people.getByRole('checkbox', { name: /Maria Souza/ }))
    await userEvent.click(createButton())

    expect(screen.getByRole('status')).toHaveTextContent('Grupo Brigada criado (simulação).')
  })
})

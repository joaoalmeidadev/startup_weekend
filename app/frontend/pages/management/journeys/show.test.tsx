import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { catalog, journey, journeyGoal, manager, readyJourney } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import JourneysShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const stretch = (title: string) => screen.getByRole('region', { name: `Trecho ${title}` })
const catalogGroup = (title: string) => screen.getByRole('region', { name: `Catálogo: ${title}` })
const value = () => screen.getByRole('region', { name: 'Valor desta jornada' })
const namesIn = (title: string) =>
  within(stretch(title))
    .queryAllByRole('link')
    .map((link) => link.textContent)

describe('JourneysShow (montador de jornada)', () => {
  beforeEach(() => {
    page.url = '/management/journeys/onboarding-atendimento'
    page.props = {
      journey,
      catalog,
      goal: journeyGoal,
      ready_journey: readyJourney,
      start_ready: false,
      manager,
    }
  })

  it('sums up the value of the journey as an estimate', () => {
    render(<JourneysShow />)

    expect(value()).toHaveTextContent('Substitui ~12h de repasse por novato')
    expect(value()).toHaveTextContent('≈ R$ 480 por contratação')
    expect(value()).toHaveTextContent('estimativa')
    expect(value()).toHaveTextContent('3 módulos · 16 lições')
    expect(value()).toHaveTextContent('~3 semanas a 5 min/dia')
    expect(value()).toHaveTextContent('Cobre 2 de 4 competências da meta')
  })

  it('shows the path the collaborator will follow, ending in the Nivelado badge', () => {
    render(<JourneysShow />)

    const preview = within(screen.getByRole('region', { name: 'Como o colaborador vai ver' }))
    expect(within(stretch('Empresa')).getByRole('link', { name: /Rotinas/ })).toHaveAttribute(
      'href',
      '/management/modules/rotinas-de-atendimento',
    )
    expect(within(stretch('Empresa')).getByText('Gerado por IA')).toBeInTheDocument()
    expect(within(stretch('Setor')).getByText('Nenhum módulo neste trecho ainda.')).toBeInTheDocument()
    expect(preview.getByText('Nivelado')).toBeInTheDocument()
  })

  it('groups the catalog by origin and blocks modules already in the journey', () => {
    render(<JourneysShow />)

    expect(
      within(catalogGroup('Produtos Nivela')).getByRole('button', {
        name: 'Conversa Clara já está na jornada',
      }),
    ).toBeDisabled()
    expect(
      within(catalogGroup('Gerado por IA')).getByRole('button', { name: 'Adicionar Segurança no Armazém' }),
    ).toBeEnabled()
  })

  it('lists the ready-to-use Nivela products first', () => {
    render(<JourneysShow />)

    const groups = within(screen.getByRole('region', { name: 'Catálogo' })).getAllByRole('region')
    expect(groups[0]).toHaveAccessibleName('Catálogo: Produtos Nivela')
    expect(groups[0]).toHaveTextContent('pronto para usar')
  })

  it('puts a general Nivela product straight into its suggested stretch', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Adicionar Atendimento ao Cliente' }))

    expect(namesIn('Setor')).toEqual([expect.stringContaining('Atendimento ao Cliente')])
  })

  it('starts over with the ready-made Nivela journey in one click', async () => {
    render(<JourneysShow />)

    const ready = within(screen.getByRole('region', { name: 'Jornada pronta Nivela' }))
    expect(ready.getByText(/3 módulos · ~10h de repasse/)).toBeInTheDocument()
    await userEvent.click(ready.getByRole('button', { name: 'Começar com a jornada pronta' }))

    expect(namesIn('Empresa')).toEqual([])
    expect(namesIn('Setor')).toEqual([expect.stringContaining('Atendimento ao Cliente')])
    expect(value()).toHaveTextContent('Substitui ~10h')
    expect(screen.getByRole('status')).toHaveTextContent('Jornada pronta Nivela')
  })

  it('opens already on the ready-made journey when asked', () => {
    page.props = { ...page.props, start_ready: true }
    render(<JourneysShow />)

    expect(namesIn('Setor')).toEqual([expect.stringContaining('Atendimento ao Cliente')])
  })

  it('puts a Nivela product straight into Base and updates the value', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Adicionar Postura e Empatia' }))

    expect(namesIn('Base')[2]).toContain('Postura e Empatia')
    expect(value()).toHaveTextContent('Substitui ~15h')
    expect(value()).toHaveTextContent('Cobre 3 de 4')
    expect(screen.getByRole('button', { name: 'Postura e Empatia já está na jornada' })).toBeDisabled()
  })

  it('asks Empresa or Setor before adding an AI or company module', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Adicionar Tratamento de Reclamações' }))
    await userEvent.click(screen.getByRole('button', { name: 'Setor' }))

    expect(namesIn('Setor')).toEqual([expect.stringContaining('Tratamento de Reclamações')])
    expect(value()).toHaveTextContent('4 módulos · 22 lições')
  })

  it('removes a module and gives it back to the catalog', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Remover Rotinas' }))

    expect(namesIn('Empresa')).toEqual([])
    expect(value()).toHaveTextContent('Substitui ~6h')
    expect(screen.getByRole('button', { name: 'Adicionar Rotinas' })).toBeEnabled()
  })

  it('reorders modules inside a stretch', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Subir Matemática' }))

    expect(namesIn('Base')[0]).toContain('Matemática')
  })

  it('publishes the changes as a simulation', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: /Publicar alterações/ }))

    expect(screen.getByRole('status')).toHaveTextContent('simulação')
  })

  it('changes who receives the journey', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Alterar' }))
    await userEvent.click(screen.getByRole('checkbox', { name: /Novatos automaticamente/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByText('Novatos')).toBeInTheDocument()
    expect(screen.getByText('Setor Atendimento')).toBeInTheDocument()
  })
})

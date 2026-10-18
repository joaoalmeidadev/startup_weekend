import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  audienceOptions,
  catalog,
  journey,
  journeyGoal,
  manager,
  pointsRule,
  readyJourney,
  serviceJourney,
} from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import JourneysShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const preview = () => screen.getByRole('region', { name: 'Como o participante vê' })
const catalogGroup = (title: string) => screen.getByRole('region', { name: `Biblioteca: ${title}` })
const calculator = () => screen.getByRole('region', { name: 'Calculadora da jornada' })
const stops = () =>
  within(within(preview()).getByRole('list', { name: 'Paradas da jornada' }))
    .getAllByRole('link')
    .map((link) => link.textContent)

describe('JourneysShow (montador de jornada)', () => {
  beforeEach(() => {
    page.url = '/management/journeys/base-nivela'
    page.props = {
      journey,
      catalog,
      goal: journeyGoal,
      ready_journey: readyJourney,
      start_ready: false,
      audience_options: audienceOptions,
      people: ['Maria Souza', 'Marcos Oliveira'],
      points_rule: pointsRule,
      manager,
    }
  })

  it('shows the kind of the journey and who receives it', () => {
    render(<JourneysShow />)

    expect(screen.getByRole('heading', { level: 1, name: 'Base Nivela' })).toBeInTheDocument()
    expect(screen.getByText('Ativa')).toBeInTheDocument()
    const audience = within(screen.getByRole('group', { name: 'Quem recebe' }))
    expect(audience.getByText('Atendimento')).toBeInTheDocument()
    expect(audience.getByText('Staff · Grupo')).toBeInTheDocument()
    expect(screen.getByText('Jornada Base')).toBeInTheDocument()
  })

  it('links the goal to the page of the first sector that receives it', () => {
    render(<JourneysShow />)

    expect(screen.getByRole('link', { name: 'Ver a meta de Atendimento' })).toHaveAttribute(
      'href',
      '/management/sectors/atendimento',
    )
  })

  it('has no goal to compare when it goes to specific people', () => {
    page.props = {
      ...page.props,
      journey: { ...journey, audience: { type: 'people', names: ['Maria Souza'] } },
      goal: { sector: null, slug: null, competencies: [] },
    }
    render(<JourneysShow />)

    expect(screen.queryByRole('link', { name: /Ver a meta/ })).not.toBeInTheDocument()
    expect(calculator()).toHaveTextContent('Sem meta de setor para comparar')
  })

  it('prices the journey by the points rule: hours of training replaced, reais saved and points', () => {
    page.props = { ...page.props, journey: serviceJourney, ready_journey: null }
    render(<JourneysShow />)

    expect(calculator()).toHaveTextContent('9 h de treino substituídas')
    expect(calculator()).toHaveTextContent('R$ 765 economizados')
    expect(calculator()).toHaveTextContent('306 pts na jornada')
    expect(calculator()).toHaveTextContent('até R$ 306 viram prêmios')
  })

  it('shows the rule it used, set in Recompensas', () => {
    render(<JourneysShow />)

    expect(calculator()).toHaveTextContent(
      '1 h de treino = R$ 85 (gestor R$ 60 + pessoa R$ 25) · 34 pts/h — definido em Recompensas',
    )
    expect(within(calculator()).getByRole('link', { name: 'Recompensas' })).toHaveAttribute(
      'href',
      '/management/rewards',
    )
  })

  it('keeps the study time and the goal coverage as a secondary line', () => {
    render(<JourneysShow />)

    expect(calculator()).toHaveTextContent('3 módulos · 16 lições · ~3 semanas a 5 min/dia')
    expect(calculator()).toHaveTextContent('Cobre 2 de 4 competências da meta')
  })

  it('edits the hours each content replaces and recalculates the journey', async () => {
    render(<JourneysShow />)

    expect(within(preview()).getByText('204 pts')).toBeInTheDocument()
    const hours = screen.getByRole('spinbutton', { name: 'Horas de treino de Rotinas' })
    expect(hours).toHaveValue(6)
    await userEvent.clear(hours)
    await userEvent.type(hours, '2')

    expect(within(preview()).getByText('68 pts')).toBeInTheDocument()
    expect(calculator()).toHaveTextContent('8 h de treino substituídas')
    expect(calculator()).toHaveTextContent('272 pts na jornada')
  })

  it('lets the admin type the points of a content, and clear them back to the rule', async () => {
    render(<JourneysShow />)

    const manual = screen.getByRole('spinbutton', { name: 'Pontos manuais de Rotinas' })
    await userEvent.type(manual, '100')

    expect(within(preview()).getByText('100 pts')).toBeInTheDocument()
    expect(within(preview()).getByText('manual')).toBeInTheDocument()
    expect(calculator()).toHaveTextContent('304 pts na jornada')

    await userEvent.clear(manual)

    expect(within(preview()).queryByText('manual')).not.toBeInTheDocument()
    expect(calculator()).toHaveTextContent('408 pts na jornada')
  })

  it('shows the single ordered path the participant follows, ending in the badge', () => {
    render(<JourneysShow />)

    expect(stops()).toEqual(['Conversa Clara', 'Matemática', 'Rotinas'])
    expect(within(preview()).getByRole('link', { name: 'Rotinas' })).toHaveAttribute(
      'href',
      '/management/modules/rotinas-de-atendimento',
    )
    expect(within(preview()).getByText('Gerado por IA')).toBeInTheDocument()
    expect(within(preview()).getByText('Base Nivela concluída')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: /Trecho/ })).not.toBeInTheDocument()
  })

  it('groups the Biblioteca by origin, Nivela first, and blocks contents already in the journey', () => {
    render(<JourneysShow />)

    const groups = within(screen.getByRole('region', { name: 'Biblioteca' })).getAllByRole('region')
    expect(groups[0]).toHaveAccessibleName('Biblioteca: Produtos Nivela')
    expect(groups[0]).toHaveTextContent('pronto para usar')
    expect(
      within(catalogGroup('Produtos Nivela')).getByRole('button', {
        name: 'Conversa Clara já está na jornada',
      }),
    ).toBeDisabled()
  })

  it('adds any content to the end of the path in one click', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Adicionar Tratamento de Reclamações' }))

    expect(screen.queryByRole('button', { name: 'Setor' })).not.toBeInTheDocument()
    expect(stops()).toEqual(['Conversa Clara', 'Matemática', 'Rotinas', 'Tratamento de Reclamações'])
    expect(calculator()).toHaveTextContent('4 módulos · 22 lições')
    expect(calculator()).toHaveTextContent('17 h de treino substituídas')
    expect(
      screen.getByRole('button', { name: 'Tratamento de Reclamações já está na jornada' }),
    ).toBeDisabled()
  })

  it('removes a content and gives it back to the Biblioteca', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Remover Rotinas' }))

    expect(stops()).toEqual(['Conversa Clara', 'Matemática'])
    expect(calculator()).toHaveTextContent('6 h de treino substituídas')
    expect(calculator()).toHaveTextContent('204 pts na jornada')
    expect(screen.getByRole('button', { name: 'Adicionar Rotinas' })).toBeEnabled()
  })

  it('reorders the stops', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Descer Matemática' }))

    expect(stops()).toEqual(['Conversa Clara', 'Rotinas', 'Matemática'])
    expect(calculator()).toHaveTextContent('408 pts na jornada')
  })

  it('starts over with the ready-made Base Nivela on a base journey', async () => {
    render(<JourneysShow />)

    const ready = within(screen.getByRole('region', { name: 'Usar a Base Nivela pronta' }))
    expect(ready.getByText(/3 módulos · ~9 h de treino \(R\$ 765\)/)).toBeInTheDocument()
    await userEvent.click(ready.getByRole('button', { name: 'Usar a Base Nivela pronta' }))

    expect(stops()).toEqual(['Conversa Clara', 'Matemática', 'Postura e Empatia'])
    expect(screen.getByRole('status')).toHaveTextContent('Base Nivela pronta')
  })

  it('opens already on the ready-made Base when asked', () => {
    page.props = { ...page.props, start_ready: true }
    render(<JourneysShow />)

    expect(stops()).toEqual(['Conversa Clara', 'Matemática', 'Postura e Empatia'])
  })

  it('offers the ready-made Base only on base journeys', () => {
    page.props = { ...page.props, journey: { ...journey, kind: 'sector' }, ready_journey: null }
    render(<JourneysShow />)

    expect(screen.queryByRole('region', { name: 'Usar a Base Nivela pronta' })).not.toBeInTheDocument()
    expect(screen.getByText('Jornada Setor')).toBeInTheDocument()
  })

  it('publishes the changes as a simulation', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: /Publicar alterações/ }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Alterações publicadas: 408 pts na jornada (simulação).',
    )
  })

  it('changes who receives the journey to specific people', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Alterar' }))
    const dialog = within(screen.getByRole('dialog', { name: 'Quem recebe esta jornada' }))
    await userEvent.click(dialog.getByRole('radio', { name: 'Pessoas específicas' }))
    expect(dialog.getByRole('button', { name: 'Salvar' })).toBeDisabled()
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Maria Souza' }))
    await userEvent.click(dialog.getByRole('button', { name: 'Salvar' }))

    expect(
      within(screen.getByRole('group', { name: 'Quem recebe' })).getByText('1 pessoa'),
    ).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('(simulação)')
  })
})

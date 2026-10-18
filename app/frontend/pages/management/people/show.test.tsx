import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, personDetail } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import PeopleShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('PeopleShow', () => {
  beforeEach(() => {
    page.url = '/management/people/maria-souza'
    page.props = { person: personDetail, manager }
  })

  it('shows who the person is and where they are in the journey', () => {
    render(<PeopleShow />)

    expect(screen.getByRole('heading', { name: 'Maria Souza' })).toBeInTheDocument()
    expect(screen.getByText('Atendente · Atendimento · 1 mês de casa')).toBeInTheDocument()
  })

  it('shows the trail: Base, Empresa and Setor, each named after its journey', () => {
    render(<PeopleShow />)

    const trail = within(screen.getByRole('region', { name: 'Trilha' }))
    expect(trail.getByText('1. Base · Base Nivela')).toBeInTheDocument()
    expect(trail.getByText('2. Empresa · Jeito Distribuidora Sul')).toBeInTheDocument()
    expect(trail.getByText('3. Setor')).toBeInTheDocument()
    expect(trail.getByText('Nenhuma jornada de Setor')).toBeInTheDocument()
  })

  it('highlights score against goal, forecast, progress and activity at the top', () => {
    render(<PeopleShow />)

    const figures = screen.getByRole('region', { name: 'Resumo da pessoa' })
    expect(within(figures).getByText('68 / meta 75')).toBeInTheDocument()
    expect(within(figures).getByText('abaixo da meta')).toBeInTheDocument()
    expect(within(figures).getByText('Nivela em ~12 dias')).toBeInTheDocument()
    expect(within(figures).getByText('50%')).toBeInTheDocument()
    expect(within(figures).getByText('Módulo atual: Rotinas de atendimento')).toBeInTheDocument()
    expect(within(figures).getByText('há 2 dias · 35 min nesta semana')).toBeInTheDocument()
    expect(screen.getByText('No ritmo')).toBeInTheDocument()
  })

  it('shows initials when there is no photo', () => {
    page.props = { person: { ...personDetail, avatar_url: null }, manager }
    render(<PeopleShow />)

    expect(screen.getByText('MS')).toBeInTheDocument()
  })

  it('shows how the person studies and how much they grew since the diagnostic', () => {
    render(<PeopleShow />)

    const study = within(screen.getByRole('region', { name: 'Estudo' }))
    expect(study.getByText('35 min')).toBeInTheDocument()
    expect(study.getByText('3 dias')).toBeInTheDocument()
    expect(study.getByText('12')).toBeInTheDocument()
    expect(study.getByText('82%')).toBeInTheDocument()
    expect(study.getByText('8 h')).toBeInTheDocument()
    expect(study.getByText('de treino substituídas')).toBeInTheDocument()
    const row = study.getByText('Comunicação').closest('li') as HTMLElement
    expect(row).toHaveTextContent('40 → 70')
  })

  it('shows the badge forecast and the milestones', () => {
    render(<PeopleShow />)

    const badge = within(screen.getByRole('region', { name: 'Selo e conquistas' }))
    expect(badge.getByText('Nivelado em Atendimento')).toBeInTheDocument()
    expect(badge.getByText('Previsão: Nivela em ~12 dias')).toBeInTheDocument()
    expect(badge.getByText('Concluiu a jornada Base Nivela')).toBeInTheDocument()
  })

  it('shows the date of an earned badge', () => {
    page.props = {
      person: { ...personDetail, badge: { ...personDetail.badge, earned: true, date: '14/08' } },
      manager,
    }
    render(<PeopleShow />)

    expect(screen.getByText('Conquistado em 14/08')).toBeInTheDocument()
  })

  it('shows points and the rewards redeemed', () => {
    render(<PeopleShow />)

    const rewards = within(screen.getByRole('region', { name: 'Recompensas' }))
    expect(rewards.getByText('272 pts ganhos')).toBeInTheDocument()
    expect(rewards.getByText('242 pts de saldo')).toBeInTheDocument()
    const item = rewards.getByText('Vale-lanche').closest('li') as HTMLElement
    expect(item).toHaveTextContent('02/10')
    expect(item).toHaveTextContent('30 pts')
  })

  it('says when no reward was redeemed yet', () => {
    page.props = {
      person: { ...personDetail, rewards: { points: 0, balance: 0, redeemed: [] } },
      manager,
    }
    render(<PeopleShow />)

    expect(screen.getByText('Ainda não resgatou nenhuma recompensa.')).toBeInTheDocument()
  })

  it('no longer shows colleague feedback', () => {
    render(<PeopleShow />)

    expect(screen.queryByText('O que os colegas dizem')).not.toBeInTheDocument()
  })

  it('goes back to the sector of the person, under the Setores tab', () => {
    render(<PeopleShow />)

    expect(screen.getByRole('link', { name: /Voltar para Atendimento/ })).toHaveAttribute(
      'href',
      '/management/sectors/atendimento',
    )
    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Setores/ })).toHaveAttribute('aria-current', 'page')
    expect(nav.queryByRole('link', { name: /Pessoas/ })).not.toBeInTheDocument()
  })

  it('no longer offers the review or the role change', () => {
    render(<PeopleShow />)

    expect(screen.queryByRole('link', { name: /Avaliar/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Mudar de função/ })).not.toBeInTheDocument()
  })
})

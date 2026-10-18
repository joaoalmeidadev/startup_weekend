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
    expect(screen.getByRole('heading', { name: /Jornada: Onboarding Atendimento/ })).toBeInTheDocument()
    expect(screen.getByText('Sem módulos')).toBeInTheDocument()
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
    const row = study.getByText('Comunicação clara').closest('li') as HTMLElement
    expect(row).toHaveTextContent('40 → 70')
  })

  it('shows the badge forecast and the milestones', () => {
    render(<PeopleShow />)

    const badge = within(screen.getByRole('region', { name: 'Selo e conquistas' }))
    expect(badge.getByText('Nivelado em Atendimento')).toBeInTheDocument()
    expect(badge.getByText('Previsão: Nivela em ~12 dias')).toBeInTheDocument()
    expect(badge.getByText('Concluiu o trecho Base')).toBeInTheDocument()
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
    expect(rewards.getByText('240 pts ganhos')).toBeInTheDocument()
    expect(rewards.getByText('90 pts de saldo')).toBeInTheDocument()
    const item = rewards.getByText('Vale-lanche R$ 30').closest('li') as HTMLElement
    expect(item).toHaveTextContent('02/10')
    expect(item).toHaveTextContent('150 pts')
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

  it('no longer offers the review or the role change', () => {
    render(<PeopleShow />)

    expect(screen.queryByRole('link', { name: /Avaliar/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Mudar de função/ })).not.toBeInTheDocument()
  })
})

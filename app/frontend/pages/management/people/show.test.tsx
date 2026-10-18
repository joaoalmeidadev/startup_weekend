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

  it('lists strengths, what is being learned and colleague feedback', () => {
    render(<PeopleShow />)

    expect(screen.getByText('• Comunicação clara')).toBeInTheDocument()
    expect(screen.getByText('• Rotinas da Distribuidora')).toBeInTheDocument()
    expect(screen.getByText('• Explica as coisas com clareza.')).toBeInTheDocument()
  })

  it('no longer offers the review or the role change', () => {
    render(<PeopleShow />)

    expect(screen.queryByRole('link', { name: /Avaliar/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Mudar de função/ })).not.toBeInTheDocument()
  })
})

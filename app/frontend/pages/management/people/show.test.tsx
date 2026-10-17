import { render, screen } from '@testing-library/react'
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

  it('lists strengths, what is being learned and colleague feedback', () => {
    render(<PeopleShow />)

    expect(screen.getByText('• Comunicação clara')).toBeInTheDocument()
    expect(screen.getByText('• Rotinas da Distribuidora')).toBeInTheDocument()
    expect(screen.getByText('• Explica as coisas com clareza.')).toBeInTheDocument()
  })

  it('links to the review and the role change', () => {
    render(<PeopleShow />)

    expect(screen.getByRole('link', { name: /Avaliar/ })).toHaveAttribute(
      'href',
      '/management/people/maria-souza/review',
    )
    expect(screen.getByRole('link', { name: /Mudar de função/ })).toHaveAttribute(
      'href',
      '/management/people/maria-souza/role_change',
    )
  })
})

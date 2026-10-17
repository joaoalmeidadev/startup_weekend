import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { journeySummaries, manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import JourneysIndex from './index'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('JourneysIndex', () => {
  beforeEach(() => {
    page.url = '/management/journeys'
    page.props = { journeys: journeySummaries, manager }
  })

  it('links each journey card to its detail', () => {
    render(<JourneysIndex />)

    expect(screen.getByRole('link', { name: /Onboarding Atendimento/ })).toHaveAttribute(
      'href',
      '/management/journeys/onboarding-atendimento',
    )
    expect(screen.getByText('Ninguém começou ainda')).toBeInTheDocument()
  })

  it('creates a journey from the modal (mocked)', async () => {
    render(<JourneysIndex />)

    await userEvent.click(screen.getByRole('button', { name: /Nova jornada/ }))
    expect(screen.getByRole('button', { name: 'Criar jornada' })).toBeDisabled()

    await userEvent.type(screen.getByLabelText('Nome da jornada'), 'Onboarding Comercial')
    await userEvent.click(screen.getByRole('button', { name: 'Criar jornada' }))

    expect(screen.getByRole('status')).toHaveTextContent('Jornada "Onboarding Comercial" criada (simulação).')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps Jornadas active in the navigation', () => {
    render(<JourneysIndex />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Jornadas/ })).toHaveAttribute('aria-current', 'page')
  })
})

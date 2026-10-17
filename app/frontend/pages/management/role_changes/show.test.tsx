import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import RoleChangesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('RoleChangesShow', () => {
  beforeEach(() => {
    page.url = '/management/people/maria-souza/role_change'
    page.props = {
      role_change: {
        person: { id: 'maria-souza', name: 'Maria Souza', role: 'Atendente', sector: 'Atendimento' },
        roles: [{ title: 'Supervisor de atendimento', missing: ['Liderança', 'Reclamações'], weeks: 2 }],
      },
      manager,
    }
  })

  it('goes from the new role to the gaps and the new journey', async () => {
    render(<RoleChangesShow />)

    expect(screen.getByRole('button', { name: /Ver o que falta/ })).toBeDisabled()
    await userEvent.click(screen.getByRole('radio', { name: /Supervisor de atendimento/ }))
    await userEvent.click(screen.getByRole('button', { name: /Ver o que falta/ }))

    expect(screen.getByText('Liderança')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Criar nova jornada/ }))

    expect(screen.getByRole('status')).toHaveTextContent('Prazo sugerido: 2 semana(s).')
    expect(screen.getByRole('link', { name: /Voltar para Maria/ })).toHaveAttribute(
      'href',
      '/management/people/maria-souza',
    )
  })
})

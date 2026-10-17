import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import SettingsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('SettingsShow', () => {
  beforeEach(() => {
    page.url = '/management/settings'
    page.props = {
      settings: {
        alert_days: 30,
        alert_options: [15, 30],
        ranking_enabled: true,
        badges: [{ name: 'Nivelado em Atendimento', enabled: false }],
      },
      manager,
    }
  })

  it('toggles the ranking and the badges', async () => {
    render(<SettingsShow />)

    await userEvent.click(screen.getByRole('switch', { name: /Mostrar ranking/ }))
    await userEvent.click(screen.getByRole('switch', { name: /Nivelado em Atendimento/ }))

    expect(screen.getByRole('switch', { name: /Mostrar ranking/ })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('switch', { name: /Nivelado em Atendimento/ })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('saves as a simulation', async () => {
    render(<SettingsShow />)

    await userEvent.click(screen.getByRole('button', { name: /Salvar configurações/ }))

    expect(screen.getByRole('status')).toHaveTextContent('Configurações salvas (simulação).')
  })
})

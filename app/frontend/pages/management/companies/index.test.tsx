import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import CompaniesIndex from './index'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('CompaniesIndex', () => {
  beforeEach(() => {
    page.url = '/management/companies'
    page.props = {
      numbers: [{ label: 'Empresas ativas', value: '2' }],
      companies: [
        {
          name: 'Distribuidora Sul',
          plan: 'Pro',
          people: 42,
          leveled: 62,
          status: 'active',
          next_charge: '10/11/2026',
        },
      ],
      manager,
    }
  })

  it('expands a company to show its plan', async () => {
    render(<CompaniesIndex />)

    await userEvent.click(screen.getByRole('button', { name: /Distribuidora Sul/ }))

    expect(screen.getByText('Plano: Pro')).toBeInTheDocument()
  })

  it('switches the menu to the Nivela admin area', () => {
    render(<CompaniesIndex />)

    const nav = within(screen.getByRole('navigation', { name: 'Gestão' }))
    expect(nav.getByRole('link', { name: /Empresas/ })).toHaveAttribute('aria-current', 'page')
    expect(nav.queryByRole('link', { name: /Pessoas/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Admin Nivela' })).toHaveAttribute('aria-current', 'page')
  })
})

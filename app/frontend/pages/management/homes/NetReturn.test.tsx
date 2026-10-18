import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { teamDashboard as dashboard } from '@/test/managementFixtures'
import { NetReturn } from './NetReturn'

const card = () => within(screen.getByRole('region', { name: 'Quanto a Nivela já devolveu' }))

describe('NetReturn', () => {
  it('adds what was saved and subtracts what was spent in the period', () => {
    render(<NetReturn dashboard={dashboard} />)

    expect(card().getByText('últimos 6 meses')).toBeInTheDocument()
    expect(card().getByRole('listitem', { name: '+ treino presencial economizado' })).toHaveTextContent(
      'R$ 6.365',
    )
    expect(card().getByRole('listitem', { name: '+ retrabalho evitado (39 × R$ 80)' })).toHaveTextContent(
      'R$ 3.120',
    )
    expect(card().getByRole('listitem', { name: '− prêmios pagos' })).toHaveTextContent('R$ 220')
    expect(
      card().getByRole('listitem', { name: '− Nivela (14 pessoas × R$ 15 × 6 meses)' }),
    ).toHaveTextContent('R$ 1.260')
  })

  it('shows the balance and how much each real invested gave back', () => {
    render(<NetReturn dashboard={dashboard} />)

    expect(card().getByText('= R$ 8.005 de saldo')).toHaveClass('text-success-green')
    expect(card().getByText('Cada R$ 1 investido voltou R$ 6,4')).toBeInTheDocument()
    expect(
      card().getByText('Estimativa: retrabalho a R$ 80 por ocorrência; Nivela a R$ 15 por pessoa por mês.'),
    ).toBeInTheDocument()
  })

  it('keeps a negative balance plain and talks about a single month', () => {
    const net = {
      ...dashboard.return,
      balance: -150,
      assumptions: { ...dashboard.return.assumptions, months: 1 },
    }
    render(<NetReturn dashboard={{ ...dashboard, period: '30d', return: net }} />)

    expect(card().getByText('= −R$ 150 de saldo')).not.toHaveClass('text-success-green')
    expect(card().getByText('últimos 30 dias')).toBeInTheDocument()
    expect(
      card().getByRole('listitem', { name: '− Nivela (14 pessoas × R$ 15 × 1 mês)' }),
    ).toBeInTheDocument()
  })
})

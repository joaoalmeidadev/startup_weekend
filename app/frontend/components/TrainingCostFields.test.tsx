import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { TrainingCostFields, type TrainingCost } from './TrainingCostFields'

function Harness() {
  const [cost, setCost] = useState<TrainingCost>({ teacher_salary: 4400, learner_salary: 2200 })
  return (
    <>
      <TrainingCostFields value={cost} onChange={setCost} />
      <output aria-label="valor">{`${cost.teacher_salary}/${cost.learner_salary}`}</output>
    </>
  )
}

describe('TrainingCostFields', () => {
  it('asks for monthly salaries and shows the hour they make', () => {
    render(<Harness />)

    expect(screen.getByLabelText('Salário mensal de quem ensina (R$)')).toHaveValue(4400)
    expect(screen.getByLabelText('Salário mensal de quem aprende (R$)')).toHaveValue(2200)
    expect(screen.getByText('= R$ 20/h')).toBeInTheDocument()
    expect(screen.getByText('= R$ 10/h')).toBeInTheDocument()
    expect(screen.getByText('1 h de treino presencial custa R$ 30')).toBeInTheDocument()
  })

  it('recalculates the hour as the salary changes', async () => {
    render(<Harness />)

    const teacher = screen.getByLabelText('Salário mensal de quem ensina (R$)')
    await userEvent.clear(teacher)
    await userEvent.type(teacher, '6600')

    expect(screen.getByText('= R$ 30/h')).toBeInTheDocument()
    expect(screen.getByText('1 h de treino presencial custa R$ 40')).toBeInTheDocument()
  })

  it('lets whoever prefers type the hourly value instead', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Prefiro digitar o valor/hora' }))
    const teacher = screen.getByLabelText('Valor/hora de quem ensina (R$)')
    expect(teacher).toHaveValue(20)
    await userEvent.clear(teacher)
    await userEvent.type(teacher, '25')

    expect(screen.getByRole('status', { name: 'valor' })).toHaveTextContent('5500/2200')
    expect(screen.getByRole('button', { name: 'Prefiro digitar o salário' })).toBeInTheDocument()
  })
})

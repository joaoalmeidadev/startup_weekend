import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WizardSteps } from './WizardSteps'

describe('WizardSteps', () => {
  it('lists the four steps of a new content', () => {
    render(<WizardSteps current={0} />)

    const steps = within(screen.getByRole('list', { name: 'Etapas' })).getAllByRole('listitem')
    expect(steps.map((step) => step.textContent)).toEqual([
      '1Enviar o materialchevron_right',
      '2A IA cria as liçõeschevron_right',
      '3Revisarchevron_right',
      '4Salvar na Biblioteca',
    ])
  })

  it('marks the current step and checks the ones before it', () => {
    render(<WizardSteps current={2} />)

    expect(screen.getByText('Revisar').closest('li')).toHaveAttribute('aria-current', 'step')
    expect(screen.getByText('Enviar o material').closest('li')).toHaveTextContent('check')
    expect(screen.getByText('Salvar na Biblioteca').closest('li')).not.toHaveAttribute('aria-current')
  })
})

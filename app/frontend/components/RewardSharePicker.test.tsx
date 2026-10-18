import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { RewardSharePicker } from './RewardSharePicker'

function Harness({ initial = 0.4 }: { initial?: number }) {
  const [share, setShare] = useState(initial)
  return <RewardSharePicker value={share} onChange={setShare} />
}

describe('RewardSharePicker', () => {
  it('offers three ready options with what each one means', () => {
    render(<Harness />)

    expect(screen.getByRole('radio', { name: /Equilibrado · 40%/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: /Econômico · 20%/ })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Generoso · 60%/ })).toBeInTheDocument()
    expect(screen.getByText('A cada R$ 100 economizados, R$ 40 viram prêmio.')).toBeInTheDocument()
  })

  it('switches between the options', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('radio', { name: /Generoso · 60%/ }))

    expect(screen.getByText('A cada R$ 100 economizados, R$ 60 viram prêmio.')).toBeInTheDocument()
  })

  it('opens a percentage field to customize', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('radio', { name: /Personalizar/ }))
    const percent = screen.getByLabelText('Porcentagem que vira prêmio (%)')
    await userEvent.clear(percent)
    await userEvent.type(percent, '35')

    expect(screen.getByText('A cada R$ 100 economizados, R$ 35 viram prêmio.')).toBeInTheDocument()
  })

  it('starts on Personalizar when the share is not one of the options', () => {
    render(<Harness initial={0.35} />)

    expect(screen.getByRole('radio', { name: /Personalizar/ })).toBeChecked()
    expect(screen.getByLabelText('Porcentagem que vira prêmio (%)')).toHaveValue(35)
  })
})

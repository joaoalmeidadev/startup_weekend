import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FormField } from './FormField'

describe('FormField', () => {
  it('associates the label with the input', async () => {
    const handleChange = vi.fn()
    render(<FormField label="E-mail" name="email" value="" onChange={handleChange} />)

    await userEvent.type(screen.getByLabelText('E-mail'), 'a')

    expect(handleChange).toHaveBeenCalled()
  })

  it('shows joined error messages and flags the input as invalid', () => {
    render(<FormField label="Senha" name="password" error={['is too short', 'is weak']} />)

    const input = screen.getByLabelText('Senha')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('is too short, is weak')
  })

  it('has no description when valid', () => {
    render(<FormField label="Senha" name="password" />)

    const input = screen.getByLabelText('Senha')
    expect(input).toHaveAttribute('aria-invalid', 'false')
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  it('does not let callers override the wiring between label, input and error', () => {
    render(<FormField label="Senha" name="password" id="other" aria-invalid={false} error="is too short" />)

    const input = screen.getByLabelText('Senha')
    expect(input).toHaveAttribute('id', 'password')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})

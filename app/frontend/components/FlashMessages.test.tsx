import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FlashMessages } from './FlashMessages'

describe('FlashMessages', () => {
  it('renders notice and alert messages', () => {
    render(<FlashMessages flash={{ notice: 'Saved!', alert: 'Oops' }} />)

    expect(screen.getByRole('status')).toHaveTextContent('Saved!')
    expect(screen.getByRole('alert')).toHaveTextContent('Oops')
  })

  it('renders nothing when flash is empty', () => {
    const { container } = render(<FlashMessages flash={{}} />)

    expect(container).toBeEmptyDOMElement()
  })
})

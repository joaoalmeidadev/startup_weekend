import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SOURCES, SourceBadge } from './SourceBadge'

describe('SourceBadge', () => {
  it.each([
    ['ai', 'Gerado por IA', 'auto_awesome'],
    ['nivela', 'Produtos Nivela', 'verified'],
    ['company', 'Produtos da empresa', 'apartment'],
  ] as const)('labels the %s origin with its own icon', (source, label, icon) => {
    render(<SourceBadge source={source} />)

    const badge = screen.getByText(label)
    expect(badge.closest('[data-source]')).toHaveAttribute('data-source', source)
    expect(badge.closest('[data-source]')).toHaveTextContent(icon)
  })

  it('gives each origin a distinct color', () => {
    const colors = Object.values(SOURCES).map((source) => source.className)

    expect(new Set(colors).size).toBe(3)
  })
})

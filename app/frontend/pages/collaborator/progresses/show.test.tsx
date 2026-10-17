import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { progress, viewer } from '@/test/collaboratorFixtures'
import { page } from '@/test/inertiaMock'
import ProgressesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('ProgressesShow', () => {
  beforeEach(() => {
    page.url = '/collaborator/progress'
    page.props = { progress, viewer }
  })

  it('counts the earned badges and marks the locked one', () => {
    render(<ProgressesShow />)

    expect(screen.getByText('1 de 2')).toBeInTheDocument()
    expect(screen.getByText('Em breve')).toBeInTheDocument()
  })

  it('highlights the collaborator own position in the ranking', () => {
    render(<ProgressesShow />)

    expect(screen.getByText('Você (Maria)')).toBeInTheDocument()
    expect(screen.getByText('Lucas Mendes')).toBeInTheDocument()
  })

  it('lets the collaborator choose how to appear in the ranking', async () => {
    render(<ProgressesShow />)

    expect(screen.getByRole('radio', { name: /Mostrar meu nome: Maria/ })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    await userEvent.click(screen.getByRole('radio', { name: /Não aparecer na lista/ }))

    expect(screen.getByRole('radio', { name: /Não aparecer na lista/ })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByRole('radio', { name: /Mostrar meu nome/ })).toHaveAttribute('aria-checked', 'false')
  })
})

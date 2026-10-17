import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { learningModule, manager } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import LearningModulesShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('LearningModulesShow', () => {
  beforeEach(() => {
    page.url = '/management/modules/rotinas-de-atendimento'
    page.props = { learning_module: learningModule, manager }
  })

  it('sends the reviewer to the first pending lesson', () => {
    render(<LearningModulesShow />)

    expect(screen.getByRole('link', { name: /Revisar lições/ })).toHaveAttribute(
      'href',
      '/management/lesson_reviews/2',
    )
    expect(screen.getByText('1 lições esperando sua revisão')).toBeInTheDocument()
  })

  it('links every lesson to its review while the module is under review', () => {
    render(<LearningModulesShow />)

    expect(screen.getByRole('link', { name: /Como acolher/ })).toHaveAttribute(
      'href',
      '/management/lesson_reviews/2',
    )
  })

  it('only lists lessons once the module is published', () => {
    page.props = {
      learning_module: { ...learningModule, status: 'published', review_from: null },
      manager,
    }
    render(<LearningModulesShow />)

    expect(screen.queryByRole('link', { name: /Revisar lições/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Como acolher/ })).not.toBeInTheDocument()
  })
})

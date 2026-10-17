import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { lessonReview, manager } from '@/test/managementFixtures'
import { page, router } from '@/test/inertiaMock'
import LessonReviewsShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('LessonReviewsShow', () => {
  beforeEach(() => {
    page.url = '/management/lesson_reviews/2'
    page.props = { lesson_review: lessonReview(), manager }
    router.visit.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows where the lesson sits in the module', () => {
    render(<LessonReviewsShow />)

    expect(screen.getByRole('heading', { name: 'Revisando a Lição 2 de 8' })).toBeInTheDocument()
    expect(screen.getByText('1 de 8 aprovadas')).toBeInTheDocument()
    expect(screen.getByTitle('Lição 2: Em análise agora')).toHaveAttribute('aria-current', 'step')
  })

  it('moves on to the next lesson after approving', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<LessonReviewsShow />)

    await userEvent.click(screen.getByRole('button', { name: /Está certo, aprovar/ }))
    expect(screen.getByRole('status')).toHaveTextContent('Lição 2 aprovada!')

    act(() => vi.runAllTimers())
    expect(router.visit).toHaveBeenCalledWith('/management/lesson_reviews/3')
  })

  it('updates the preview after correcting the text', async () => {
    render(<LessonReviewsShow />)

    await userEvent.click(screen.getByRole('button', { name: /Corrigir texto/ }))
    const title = screen.getByLabelText(/Título da lição/)
    await userEvent.clear(title)
    await userEvent.type(title, 'Título corrigido')
    await userEvent.click(screen.getByRole('button', { name: /Salvar correção/ }))

    expect(screen.getByRole('heading', { name: 'Título corrigido' })).toBeInTheDocument()
    expect(screen.queryByLabelText(/Título da lição/)).not.toBeInTheDocument()
  })

  it('asks before discarding the lesson', async () => {
    render(<LessonReviewsShow />)

    await userEvent.click(screen.getByRole('button', { name: /Descartar lição/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Sim, descartar' }))

    expect(screen.getByRole('status')).toHaveTextContent('A IA está reprocessando')
  })

  it('publishes the module when the last lesson is approved', async () => {
    page.props = { lesson_review: lessonReview({ position: 8, approved: 7, final: true }), manager }
    render(<LessonReviewsShow />)

    await userEvent.click(screen.getByRole('button', { name: /Aprovar e publicar na jornada/ }))

    expect(screen.getByRole('dialog', { name: 'Módulo publicado' })).toHaveTextContent(
      '32 pessoas do Atendimento',
    )
    expect(router.visit).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: /Voltar para Jornadas/ }))
    expect(router.visit).toHaveBeenCalledWith('/management/journeys/onboarding-atendimento')
  })

  it('links the breadcrumb back to the journeys and the module', () => {
    render(<LessonReviewsShow />)

    const breadcrumb = within(screen.getByRole('navigation', { name: 'Você está em' }))
    expect(breadcrumb.getByRole('link', { name: 'Jornadas' })).toHaveAttribute('href', '/management/journeys')
    expect(breadcrumb.getByRole('link', { name: 'Módulo: Rotinas de atendimento' })).toHaveAttribute(
      'href',
      '/management/modules/rotinas-de-atendimento',
    )
  })
})

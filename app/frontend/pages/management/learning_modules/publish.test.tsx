import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { manager, publication } from '@/test/managementFixtures'
import { page } from '@/test/inertiaMock'
import LearningModulesPublish from './publish'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

describe('LearningModulesPublish', () => {
  beforeEach(() => {
    page.url = '/management/modules/rotinas-de-atendimento/publish'
    page.props = { publication, manager }
  })

  it('is the last step of the new content assistant', () => {
    render(<LearningModulesPublish />)

    const steps = within(screen.getByRole('list', { name: 'Etapas' }))
    expect(steps.getByText('Publicar').closest('li')).toHaveAttribute('aria-current', 'step')
    expect(screen.getByText(/Rotinas de atendimento · 8 lições aprovadas/)).toBeInTheDocument()
  })

  it('asks who receives the content, with the defaults checked', () => {
    render(<LearningModulesPublish />)

    const audience = within(screen.getByRole('group', { name: 'Quem recebe este conteúdo?' }))
    expect(audience.getByLabelText(/Setor Atendimento/)).toBeChecked()
    expect(audience.getByLabelText(/Novatos automaticamente/)).toBeChecked()
    expect(audience.getByLabelText(/Pessoas específicas/)).not.toBeChecked()
  })

  it('needs someone to receive the content', async () => {
    render(<LearningModulesPublish />)

    await userEvent.click(screen.getByLabelText(/Setor Atendimento/))
    await userEvent.click(screen.getByLabelText(/Novatos automaticamente/))

    expect(screen.getByRole('button', { name: /Publicar/ })).toBeDisabled()
  })

  it('celebrates the publication and goes back to the contents', async () => {
    render(<LearningModulesPublish />)

    await userEvent.click(screen.getByRole('button', { name: /Publicar/ }))

    const success = screen.getByRole('heading', { name: 'Publicado!' }).parentElement as HTMLElement
    expect(success).toHaveTextContent('32 pessoas já podem fazer este conteúdo.')
    expect(screen.getByText('Novo módulo ativo!')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Voltar para a Biblioteca/ })).toHaveAttribute(
      'href',
      '/management/library',
    )
  })
})

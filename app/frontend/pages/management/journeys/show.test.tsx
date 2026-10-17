import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { journey, library, manager } from '@/test/managementFixtures'
import { page, router } from '@/test/inertiaMock'
import JourneysShow from './show'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const stretch = (title: string) => screen.getByRole('region', { name: `Trecho ${title}` })

describe('JourneysShow', () => {
  beforeEach(() => {
    page.url = '/management/journeys/onboarding-atendimento'
    page.props = { journey, library, manager }
    router.visit.mockClear()
  })

  it('shows the three stretches with modules linking to their detail', () => {
    render(<JourneysShow />)

    expect(within(stretch('Empresa')).getByRole('link', { name: /Rotinas/ })).toHaveAttribute(
      'href',
      '/management/modules/rotinas-de-atendimento',
    )
    expect(within(stretch('Setor')).getByText('Nenhum módulo neste trecho ainda.')).toBeInTheDocument()
  })

  it('reorders modules inside a stretch', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Subir Matemática' }))

    const names = within(stretch('Base'))
      .getAllByRole('link')
      .map((link) => link.textContent)
    expect(names[0]).toContain('Matemática')
  })

  it('adds a Base module from the Nivela library', async () => {
    render(<JourneysShow />)

    await userEvent.click(within(stretch('Base')).getByRole('button', { name: /Adicionar módulo/ }))
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Adicionar' }))

    expect(within(stretch('Base')).getByText('Escrita no Trabalho')).toBeInTheDocument()
  })

  it('changes who receives the journey', async () => {
    render(<JourneysShow />)

    await userEvent.click(screen.getByRole('button', { name: 'Alterar' }))
    await userEvent.click(screen.getByRole('checkbox', { name: /Novatos automaticamente/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByText('Novatos')).toBeInTheDocument()
    expect(screen.getByText('Setor Atendimento')).toBeInTheDocument()
  })

  it('sends AI and manual creation to their screens', async () => {
    render(<JourneysShow />)

    await userEvent.click(within(stretch('Empresa')).getByRole('button', { name: /Adicionar módulo/ }))
    await userEvent.click(screen.getByRole('button', { name: /Criar com IA/ }))
    expect(router.visit).toHaveBeenCalledWith('/management/modules/new?journey=onboarding-atendimento')

    await userEvent.click(within(stretch('Empresa')).getByRole('button', { name: /Adicionar módulo/ }))
    await userEvent.click(screen.getByRole('button', { name: /Criar manualmente/ }))
    expect(router.visit).toHaveBeenCalledWith(
      '/management/modules/new?journey=onboarding-atendimento&mode=manual',
    )
  })
})

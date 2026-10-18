import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { manager } from '@/test/managementFixtures'
import { page, router } from '@/test/inertiaMock'
import LearningModulesNew from './new'

vi.mock('@inertiajs/react', async () => (await import('@/test/inertiaMock')).inertiaMock)

const journey = { id: 'atendimento-na-pratica', name: 'Atendimento na prática' }

function renderForm(props: { journey?: typeof journey | null } = {}) {
  page.props = {
    journey: props.journey ?? null,
    generated: { lessons: 8, review_path: '/management/lesson_reviews/1' },
    company_rule: { teacher_salary: 4400, learner_salary: 2200, reward_share: 0.4 },
    competency_groups: [
      { label: 'Atendimento', competencies: ['Comunicação', 'Reclamações'] },
      { label: 'Staff (grupo)', competencies: ['Colaboração'] },
      { label: 'Outras da Biblioteca', competencies: ['Rotinas'] },
    ],
    manager,
  }
  render(<LearningModulesNew />)
}

const writeLessons = () => userEvent.click(screen.getByRole('radio', { name: /Escrever as lições/ }))
const typeName = (name: string) => userEvent.type(screen.getByLabelText('Nome do conteúdo'), name)
const pickCompetency = (name: string) => userEvent.selectOptions(screen.getByLabelText('Competência'), name)
const typeHours = (hours: string) =>
  userEvent.type(screen.getByLabelText('Quanto tempo levaria para treinar isso pessoalmente? (h)'), hours)

// A complete written lesson: title, question, three options and the right one
async function writeLessonOne() {
  await userEvent.type(screen.getByLabelText('Título da lição 1'), 'Quando aceitar a troca')
  await userEvent.type(
    screen.getByLabelText('Pergunta da lição 1'),
    'O cliente quer trocar após 10 dias. O que fazer?',
  )
  await userEvent.type(
    screen.getByLabelText('Alternativa A da lição 1'),
    'Aceitar se tiver nota e estiver lacrado',
  )
  await userEvent.type(screen.getByLabelText('Alternativa B da lição 1'), 'Recusar sempre')
  await userEvent.type(screen.getByLabelText('Alternativa C da lição 1'), 'Trocar sem olhar nada')
  await userEvent.click(screen.getByLabelText('Correta: alternativa A da lição 1'))
}

describe('LearningModulesNew', () => {
  beforeEach(() => {
    page.url = '/management/modules/new'
    router.visit.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is a single form that goes back to the library', () => {
    renderForm()

    expect(screen.getByRole('heading', { name: 'Novo conteúdo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar para Biblioteca' })).toHaveAttribute(
      'href',
      '/management/library',
    )
    expect(screen.queryByRole('list', { name: 'Etapas' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Conteúdo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'De onde vem' })).toBeInTheDocument()
  })

  it('goes back to the journey it was opened from', () => {
    renderForm({ journey })

    expect(screen.getByRole('link', { name: 'Voltar para Atendimento na prática' })).toHaveAttribute(
      'href',
      '/management/journeys/atendimento-na-pratica',
    )
  })

  it('reminds that Nivela products already come ready in the library', () => {
    renderForm()

    expect(screen.getByText(/Produtos Nivela já vêm prontos na Biblioteca/)).toBeInTheDocument()
  })

  it('offers the goal competencies grouped by sector, then the others of the library', () => {
    renderForm()

    const select = within(screen.getByLabelText('Competência'))
    expect(
      within(select.getByRole('group', { name: 'Atendimento' }))
        .getAllByRole('option')
        .map((o) => o.textContent),
    ).toEqual(['Comunicação', 'Reclamações'])
    expect(
      within(select.getByRole('group', { name: 'Outras da Biblioteca' })).getByRole('option', {
        name: 'Rotinas',
      }),
    ).toBeInTheDocument()
    expect(select.getByRole('option', { name: '+ Nova competência' })).toBeInTheDocument()
  })

  it('needs the competency before saving', async () => {
    renderForm()
    await writeLessons()
    await typeName('Trocas')
    await writeLessonOne()
    await typeHours('4')

    const save = screen.getByRole('button', { name: /Salvar na Biblioteca/ })
    expect(save).toBeDisabled()
    await pickCompetency('Comunicação')
    expect(save).toBeEnabled()
  })

  it('creates a new competency in a single word', async () => {
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: /Usar o arquivo de exemplo/ }))
    await pickCompetency('+ Nova competência')

    const create = screen.getByRole('button', { name: /Criar lições com IA/ })
    expect(create).toBeDisabled()
    await userEvent.type(screen.getByLabelText('Nova competência'), 'Boa vontade')
    expect(screen.getByText('Use uma palavra só, ex.: Pontualidade.')).toBeInTheDocument()
    expect(create).toBeDisabled()

    await userEvent.clear(screen.getByLabelText('Nova competência'))
    await userEvent.type(screen.getByLabelText('Nova competência'), 'Pontualidade')
    expect(create).toBeEnabled()
  })

  it('starts by sending a file to the AI, which needs a name and a file', async () => {
    renderForm()

    expect(screen.getByRole('radio', { name: /Enviar arquivo/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: /Gerado por IA/ })).toBeChecked()
    expect(screen.getByRole('button', { name: /Criar lições com IA/ })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: /Usar o arquivo de exemplo/ }))
    expect(screen.getByText('Manual de SAC.pdf')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do conteúdo')).toHaveValue('Rotinas de atendimento')
    expect(screen.getByLabelText('Competência')).toHaveValue('Rotinas')
    expect(screen.getByRole('button', { name: /Criar lições com IA/ })).toBeEnabled()

    await userEvent.clear(screen.getByLabelText('Nome do conteúdo'))
    expect(screen.getByRole('button', { name: /Criar lições com IA/ })).toBeDisabled()
  })

  it('shows the AI working and then sends the reviewer to the lessons', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: /Usar o arquivo de exemplo/ }))
    await userEvent.click(screen.getByRole('button', { name: /Criar lições com IA/ }))
    expect(screen.getByRole('status')).toHaveTextContent('A IA está criando 8 lições…')

    act(() => vi.runAllTimers())
    expect(screen.getByText('8 lições criadas!')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Revisar lições/ })).toHaveAttribute(
      'href',
      '/management/lesson_reviews/1',
    )
  })

  it('writing the lessons picks the company origin and adds lessons', async () => {
    renderForm()

    await writeLessons()
    expect(screen.getByRole('radio', { name: /Produto da empresa/ })).toBeChecked()
    expect(screen.queryByRole('button', { name: /Usar o arquivo de exemplo/ })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Adicionar lição/ }))
    expect(screen.getByLabelText('Título da lição 2')).toBeInTheDocument()
  })

  it('saves written lessons in the library once there is a name and a lesson title', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    renderForm()
    await writeLessons()

    const save = screen.getByRole('button', { name: /Salvar na Biblioteca/ })
    await typeName('Trocas')
    await pickCompetency('Comunicação')
    await typeHours('4')
    expect(save).toBeDisabled()
    await writeLessonOne()
    await userEvent.click(save)

    expect(screen.getByRole('status')).toHaveTextContent('Conteúdo salvo na Biblioteca (simulação).')
    act(() => vi.runAllTimers())
    expect(router.visit).toHaveBeenCalledWith('/management/library')
  })

  it('goes back to the journey after saving when opened from one', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    renderForm({ journey })
    await writeLessons()

    await typeName('Trocas')
    await pickCompetency('Comunicação')
    await typeHours('4')
    await writeLessonOne()
    await userEvent.click(screen.getByRole('button', { name: /Salvar na Biblioteca/ }))

    act(() => vi.runAllTimers())
    expect(router.visit).toHaveBeenCalledWith('/management/journeys/atendimento-na-pratica')
  })

  it('lets the manager keep a sent file as a company product', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('radio', { name: /Produto da empresa/ }))
    await typeName('Trocas')
    await pickCompetency('Comunicação')
    await typeHours('4')
    expect(screen.getByRole('button', { name: /Salvar na Biblioteca/ })).toBeDisabled()

    await userEvent.upload(
      screen.getByLabelText('Arquivo do conteúdo'),
      new File(['x'], 'Política.pdf', { type: 'application/pdf' }),
    )
    expect(screen.getByRole('button', { name: /Salvar na Biblioteca/ })).toBeEnabled()
  })

  it('explains that the AI needs a file when the lessons are written', async () => {
    renderForm()
    await writeLessons()

    await userEvent.click(screen.getByRole('radio', { name: /Gerado por IA/ }))
    await typeName('Trocas')
    await writeLessonOne()

    expect(screen.getByRole('button', { name: /Criar lições com IA/ })).toBeDisabled()
    expect(screen.getByText('A IA precisa de um arquivo para criar as lições.')).toBeInTheDocument()
  })

  it('asks how long the in-person training would take and who would give it', async () => {
    renderForm()

    const training = within(
      screen.getByRole('region', { name: 'Treino presencial que este conteúdo substitui' }),
    )
    expect(training.getByLabelText('Salário de quem daria esse treino (R$)')).toHaveValue(4400)
    expect(training.getByText('= R$ 20/h')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Usar o arquivo de exemplo/ }))

    expect(training.getByLabelText('Quanto tempo levaria para treinar isso pessoalmente? (h)')).toHaveValue(6)
    expect(training.getByLabelText('Salário de quem daria esse treino (R$)')).toHaveValue(5500)
    expect(
      training.getByText('Cada pessoa que estudar isto economiza 6 h × (R$ 25 + R$ 10)/h = R$ 210 de treino'),
    ).toBeInTheDocument()
  })

  it('needs the hours before saving', async () => {
    renderForm()
    await writeLessons()
    await typeName('Trocas')
    await pickCompetency('Comunicação')
    await writeLessonOne()

    const save = screen.getByRole('button', { name: /Salvar na Biblioteca/ })
    expect(save).toBeDisabled()
    await typeHours('4')
    expect(save).toBeEnabled()
  })

  it('asks a question with three options and the right one in each written lesson', async () => {
    renderForm()
    await writeLessons()
    await typeName('Trocas')
    await pickCompetency('Comunicação')
    await typeHours('4')
    await userEvent.type(screen.getByLabelText('Título da lição 1'), 'Quando aceitar a troca')

    const save = screen.getByRole('button', { name: /Salvar na Biblioteca/ })
    expect(save).toBeDisabled()
    expect(screen.getByText('Escreva a pergunta da lição 1.')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Pergunta da lição 1'), 'O que fazer?')
    await userEvent.type(screen.getByLabelText('Alternativa A da lição 1'), 'Aceitar')
    await userEvent.type(screen.getByLabelText('Alternativa B da lição 1'), 'Recusar')
    await userEvent.type(screen.getByLabelText('Alternativa C da lição 1'), 'Ignorar')
    expect(screen.getByText('Marque a resposta correta da lição 1.')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Correta: alternativa A da lição 1'))
    expect(save).toBeEnabled()
    expect(screen.getByLabelText('Explicação ao errar (opcional) da lição 1')).toBeInTheDocument()
  })
  it('lets each written lesson be a video, audio or image, asking for its file', async () => {
    renderForm()
    await writeLessons()
    await typeName('Trocas')
    await pickCompetency('Comunicação')
    await typeHours('4')
    await writeLessonOne()

    const format = screen.getByLabelText('Formato da lição 1')
    expect(format).toHaveValue('text')
    expect(
      within(format)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['Texto', 'Vídeo', 'Áudio', 'Imagem'])
    await userEvent.selectOptions(format, 'video')

    const save = screen.getByRole('button', { name: /Salvar na Biblioteca/ })
    expect(save).toBeDisabled()
    expect(screen.getByText('Envie o vídeo da lição 1.')).toBeInTheDocument()

    const video = new File(['x'], 'boas-vindas.mp4', { type: 'video/mp4' })
    await userEvent.upload(screen.getByLabelText('Enviar o vídeo da lição 1'), video)
    expect(screen.getByText('boas-vindas.mp4')).toBeInTheDocument()
    expect(save).toBeEnabled()
  })
})

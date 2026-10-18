import type {
  ContributionForm,
  ContributionsPage,
  DiagnosticQuestion,
  DiagnosticResult,
  Journey,
  MicroLesson,
  Profile,
  Progress,
  RewardsPage,
  Viewer,
} from '@/types/collaborator'

export const viewer: Viewer = {
  name: 'Maria Souza',
  first_name: 'Maria',
  sector: 'Atendimento',
  company: 'Distribuidora Sul',
  avatar_url: '/mocks/maria-souza.jpg',
}

export const journey: Journey = {
  today: { minutes: 5, owner: 'Distribuidora Sul' },
  step: { current: 2, total: 3 },
  sections: [
    { title: '1. Base', lessons: [{ module_id: 'conversa-clara', title: 'Conversa Clara', status: 'done' }] },
    {
      title: '2. Empresa',
      lessons: [
        {
          id: 'rotinas',
          title: 'Rotinas',
          status: 'current',
          minutes: 5,
          description: 'Fluxo de mercadorias.',
        },
      ],
    },
    { title: '3. Setor', lessons: [{ title: 'Uso do Sistema', status: 'locked' }] },
  ],
  badge: { title: 'Selo: Nivelado', description: 'Complete tudo.' },
  summary: { completed: 1, percent: 33 },
}

export const progress: Progress = {
  badges: [
    { title: '5 Dias Seguidos', icon: 'local_fire_department', earned: true },
    { title: 'Nivelado no Setor', icon: 'lock', earned: false },
  ],
  evolution: {
    completed: 1,
    total: 3,
    stretches: [
      { name: 'Base', completed: 1, total: 1 },
      { name: 'Empresa', completed: 0, total: 1 },
      { name: 'Setor', completed: 0, total: 1 },
    ],
  },
}

export const profile: Profile = {
  reminder_time: '09:00',
  reminder_options: ['08:00', '09:00'],
}

export const diagnosticQuestions: DiagnosticQuestion[] = [
  { stretch: 'Base', kind: 'objective', prompt: 'Quanto é 25% de R$ 80?', options: ['R$ 20', 'R$ 25'] },
  {
    stretch: 'Setor',
    kind: 'scenario',
    prompt: 'Cliente irritado. O que você faz?',
    options: ['Escuto', 'Ignoro'],
  },
]

export const diagnosticResult: DiagnosticResult = {
  known: ['Conversa clara'],
  to_learn: ['Porcentagem'],
  modules: 6,
  minutes_per_day: 5,
}

export const microLesson: MicroLesson = {
  id: 'rotinas-da-distribuidora',
  title: 'Rotinas da Distribuidora',
  module_name: 'Rotinas da Distribuidora',
  minutes: 5,
  points: 20,
  video: { title: 'Do caminhão à prateleira', duration: '1:45' },
  explanation: ['Toda mercadoria passa pela conferência.'],
  question: {
    prompt: 'Chegou uma caixa amassada. Qual é o primeiro passo?',
    options: [
      { text: 'Guardar no estoque.', correct: false, feedback: 'Quase! Confira antes.' },
      { text: 'Anotar e avisar.', correct: true, feedback: 'Isso mesmo!' },
    ],
  },
  badge: 'Rotinas da Distribuidora',
}

// Balance 30: enough for the Caneca (25), short of the cinema (40); the Vale-lanche is sold out
export const rewardsPage: RewardsPage = {
  balance: 30,
  rewards: [
    { id: 'caneca-nivela', name: 'Caneca Nivela', icon: 'coffee', category: 'Brinde', points: 25, stock: 20 },
    {
      id: 'ingresso-de-cinema',
      name: 'Ingresso de cinema',
      icon: 'movie',
      category: 'Experiência',
      points: 40,
      stock: 10,
    },
    { id: 'vale-lanche', name: 'Vale-lanche', icon: 'lunch_dining', category: 'Vale', points: 30, stock: 0 },
  ],
  redeemed: [{ name: 'Caneca Nivela', date: '02/10', points: 25 }],
}

const contributionLesson = (title: string) => ({
  title,
  question: {
    prompt: 'Qual o primeiro passo?',
    options: [
      { text: 'Ouvir', correct: true },
      { text: 'Interromper', correct: false },
      { text: 'Ignorar', correct: false },
    ],
  },
})

export const contributionsPage: ContributionsPage = {
  earned: 8,
  contributions: [
    {
      id: 'clientes-dificeis',
      author: 'Maria Souza',
      title: 'Clientes difíceis: o que funciona',
      sector: 'Atendimento',
      hours: 2,
      sent_on: '28/09',
      status: 'approved',
      awarded_points: 8,
      suggested_points: 8,
      lessons: [contributionLesson('Ouvir sem interromper')],
    },
    {
      id: 'planilha-de-rotas',
      author: 'Maria Souza',
      title: 'Planilha de rotas',
      sector: 'Logística',
      hours: 1.5,
      sent_on: '16/10',
      status: 'pending',
      awarded_points: null,
      suggested_points: 6,
      lessons: [contributionLesson('Ler a planilha')],
    },
    {
      id: 'etiquetas',
      author: 'Maria Souza',
      title: 'Etiquetas de envio',
      sector: 'Logística',
      hours: 1,
      sent_on: '10/10',
      status: 'changes_requested',
      awarded_points: null,
      suggested_points: 4,
      lessons: [contributionLesson('Imprimir a etiqueta')],
    },
  ],
}

export const contributionForm: ContributionForm = {
  sectors: ['Atendimento', 'Comercial', 'Logística'],
  points_per_hour: 3.8,
}

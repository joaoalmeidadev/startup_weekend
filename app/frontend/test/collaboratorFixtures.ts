import type {
  ContributionForm,
  ContributionsPage,
  DiagnosticQuestion,
  DiagnosticResult,
  Learner,
  MicroLesson,
  Profile,
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
  points: 23,
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

// Maria as Collaborator::Learner sends her: Base done, the company journey active, the sector one queued
export const learner: Learner = {
  name: 'Maria Souza',
  journeys: [
    {
      id: 'base-nivela',
      name: 'Base Nivela',
      kind: 'base',
      badge: 'Base Nivela concluída',
      status: 'done',
      steps: [
        {
          module_id: 'conversa-clara',
          name: 'Conversa Clara',
          hours: 3,
          lessons: 4,
          points: 11,
          status: 'done',
        },
        {
          module_id: 'matematica',
          name: 'Matemática do Dia a Dia',
          hours: 3,
          lessons: 5,
          points: 11,
          status: 'done',
        },
      ],
      points_total: 22,
      points_earned: 22,
    },
    {
      id: 'jeito-distribuidora-sul',
      name: 'Jeito Distribuidora Sul',
      kind: 'company',
      badge: 'Jeito Distribuidora Sul',
      status: 'active',
      steps: [
        {
          module_id: 'historia',
          name: 'Nossa História e Valores',
          hours: 2,
          lessons: 3,
          points: 8,
          status: 'done',
        },
        {
          module_id: 'rotinas',
          name: 'Rotinas de atendimento',
          hours: 6,
          lessons: 8,
          points: 23,
          status: 'current',
        },
      ],
      points_total: 31,
      points_earned: 8,
    },
    {
      id: 'atendimento-na-pratica',
      name: 'Atendimento na prática',
      kind: 'sector',
      badge: 'Nivelado em Atendimento',
      status: 'queued',
      steps: [
        {
          module_id: 'reclamacoes',
          name: 'Tratamento de Reclamações',
          hours: 5,
          lessons: 6,
          points: 19,
          status: 'locked',
        },
        { module_id: 'sistema', name: 'Uso do Sistema', hours: 4, lessons: 5, points: 15, status: 'locked' },
      ],
      points_total: 34,
      points_earned: 0,
    },
  ],
  next_step: {
    journey: 'Jeito Distribuidora Sul',
    module_id: 'rotinas',
    name: 'Rotinas de atendimento',
    points: 23,
  },
  points: { study: 30, sharing: 8, total: 38, balance: 13 },
  streak_days: 3,
  badges: [
    { title: 'Base concluída', icon: 'verified', earned: true },
    { title: '3 dias seguidos', icon: 'local_fire_department', earned: true },
    { title: 'Compartilhou conhecimento', icon: 'volunteer_activism', earned: true },
    { title: 'Nivelado em Atendimento', icon: 'military_tech', earned: false },
  ],
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

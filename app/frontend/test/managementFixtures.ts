import type {
  CatalogGroup,
  Dashboard,
  Journey,
  JourneyGoal,
  JourneySummary,
  LearningModule,
  LessonReview,
  LibraryModule,
  Manager,
  ModuleSummary,
  PeopleProps,
  PersonDetail,
  Publication,
  SectorGoal,
  TeamDashboard,
} from '@/types/management'

export const manager: Manager = {
  name: 'Ana Lima',
  role_label: 'Administradora',
  company: 'Distribuidora Sul',
}

export const peopleProps: PeopleProps = {
  summary: {
    leveled: { count: 21, percent: 50 },
    learning: { count: 14, percent: 33 },
    attention: { count: 7, percent: 17 },
  },
  sectors: [
    { name: 'Atendimento', count: 14 },
    { name: 'Logística', count: 12 },
  ],
  total: 42,
  people: [
    {
      id: 'marcos-oliveira',
      name: 'Marcos Oliveira',
      sector: 'Logística',
      status: 'attention',
      avatar_url: '/m.jpg',
      alert: { icon: 'error', text: 'Parado há 32 dias' },
    },
    {
      id: 'maria-souza',
      name: 'Maria Souza',
      sector: 'Atendimento',
      status: 'learning',
      avatar_url: '/ms.jpg',
      progress: { step: 'Passo 4 de 6', percent: 80, label: '80% na Base' },
    },
  ],
}

export const sectorGoal: SectorGoal = {
  sector: 'Atendimento',
  sectors: ['Atendimento', 'Comercial'],
  experts_count: 5,
  competencies: [
    {
      name: 'Comunicação',
      icon: 'record_voice_over',
      experts_average: 88,
      goal: 80,
      reached: { count: 8, of: 10, text: 'atingiram esta meta.' },
    },
  ],
}

export function lessonReview(overrides: Partial<LessonReview> = {}): LessonReview {
  return {
    position: 2,
    total: 8,
    approved: 1,
    final: false,
    breadcrumb: [
      { label: 'Conteúdos', href: '/management/journeys' },
      { label: 'Módulo: Rotinas de atendimento', href: '/management/modules/rotinas-de-atendimento' },
    ],
    module_name: 'Rotinas de atendimento',
    publish_path: '/management/modules/rotinas-de-atendimento/publish',
    team: 'atendimento',
    manual: { before: 'Antes', highlight: 'destaque', after: '.', note: 'Nota', source: 'Manual · p. 14' },
    lesson: {
      minutes: 5,
      title: 'Como acolher uma reclamação',
      intro: 'Introdução.',
      steps: [{ title: 'Acolha com calma:', body: 'diga', quote: 'Compreendo.' }],
    },
    question: { prompt: 'O que fazer?', options: [{ text: 'B) Acolher', correct: true }] },
    other_questions: 1,
    ...overrides,
  }
}

export const journeySummaries: JourneySummary[] = [
  {
    id: 'onboarding-atendimento',
    name: 'Onboarding Atendimento',
    status: 'active',
    audience: ['Setor Atendimento', 'Novatos'],
    people_in_progress: 14,
    badge: 'Nivelado em Atendimento',
    modules_per_stretch: { base: 2, company: 2, sector: 2 },
  },
  {
    id: 'promocao-para-lider',
    name: 'Promoção para líder',
    status: 'draft',
    audience: ['3 pessoas selecionadas'],
    people_in_progress: 0,
    badge: 'Nivelado em Liderança',
    modules_per_stretch: { base: 2, company: 0, sector: 0 },
  },
]

type ModuleOverrides = Partial<Omit<ModuleSummary, 'id' | 'name'>>

const mod = (id: string, name: string, overrides: ModuleOverrides = {}): ModuleSummary => ({
  id,
  name,
  competency: `Competência ${name}`,
  lessons: 4,
  status: 'published',
  source: 'nivela',
  stretch: 'base',
  teaching_hours: 3,
  covers: `Competência ${name}`,
  ...overrides,
})

export const journey: Journey = {
  id: 'onboarding-atendimento',
  name: 'Onboarding Atendimento',
  status: 'active',
  audience: ['Setor Atendimento'],
  people_in_progress: 14,
  badge: 'Nivelado em Atendimento',
  stretches: [
    {
      key: 'base',
      title: 'Base',
      modules: [
        mod('conversa-clara', 'Conversa Clara', { covers: 'Comunicação' }),
        mod('matematica', 'Matemática'),
      ],
    },
    {
      key: 'company',
      title: 'Empresa',
      modules: [
        mod('rotinas-de-atendimento', 'Rotinas', {
          status: 'in_review',
          source: 'ai',
          stretch: 'company',
          lessons: 8,
          teaching_hours: 6,
          covers: 'Rotinas da Distribuidora',
        }),
      ],
    },
    { key: 'sector', title: 'Setor', modules: [] },
  ],
}

export const learningModule: LearningModule = {
  id: 'rotinas-de-atendimento',
  name: 'Rotinas de atendimento',
  competency: 'Rotinas da Distribuidora',
  status: 'in_review',
  source: 'ai',
  material: 'Manual de SAC.pdf',
  stretch: 'Empresa',
  used_in: [{ id: 'onboarding-atendimento', name: 'Onboarding Atendimento' }],
  lessons: [
    { position: 1, title: 'Boas-vindas', status: 'approved' },
    { position: 2, title: 'Como acolher', status: 'pending' },
  ],
  assessment: { questions: 10 },
  review_from: 2,
}

export const personDetail: PersonDetail = {
  id: 'maria-souza',
  name: 'Maria Souza',
  sector: 'Atendimento',
  role: 'Atendente',
  tenure: '1 mês de casa',
  status: 'learning',
  avatar_url: '/ms.jpg',
  journey: {
    id: 'onboarding-atendimento',
    name: 'Onboarding Atendimento',
    stretches: [
      { title: 'Base', modules: [{ name: 'Conversa Clara', status: 'done' }] },
      { title: 'Empresa', modules: [{ name: 'Rotinas', status: 'current' }] },
      { title: 'Setor', modules: [] },
    ],
  },
  knows: ['Comunicação clara'],
  learning: ['Rotinas da Distribuidora'],
  feedback: ['Explica as coisas com clareza.'],
}

export const teamDashboard: TeamDashboard = {
  sector: 'Atendimento',
  period: '6m',
  periods: [
    { key: '30d', label: 'Últimos 30 dias' },
    { key: '6m', label: 'Últimos 6 meses' },
  ],
  leveled: { count: 8, total: 14, change: 43, change_label: 'em 6 meses' },
  days_to_level: 38,
  leveled_over_time: [
    { label: 'set', percent: 45 },
    { label: 'out', percent: 57 },
  ],
  company_target: 80,
  competencies: [{ name: 'Reclamações de Entrega', team_average: 71, goal: 85 }],
  engagement: [{ label: 'Ativos na semana', value: '11 de 14' }],
  funnel: [
    { stage: 'Começaram a jornada', count: 14 },
    { stage: 'Nivelados (selo)', count: 8 },
  ],
}

export const dashboard: Dashboard = {
  ...teamDashboard,
  attention: [
    {
      icon: 'rate_review',
      text: '7 lições da IA esperando sua revisão',
      action: 'Revisar',
      href: '/management/lesson_reviews',
    },
  ],
}

export const publication: Publication = {
  module_name: 'Rotinas de atendimento',
  lessons: 8,
  sector: 'Atendimento',
  audience_count: 32,
  default_audiences: ['sector', 'newcomers'],
  journey_outline: [
    { title: '1. Base (Soft skills)', status: 'done' },
    { title: '2. Trecho Empresa: Rotinas de atendimento', status: 'new' },
  ],
  done_path: '/management/journeys',
}

// Content area: library, journey builder catalog and goal
const aiModule = (id: string, name: string, overrides: ModuleOverrides = {}) =>
  mod(id, name, { source: 'ai', stretch: 'company', teaching_hours: 4, ...overrides })
const companyModule = (id: string, name: string, overrides: ModuleOverrides = {}) =>
  mod(id, name, { source: 'company', stretch: 'sector', teaching_hours: 5, ...overrides })

export const catalog: CatalogGroup[] = [
  {
    source: 'ai',
    title: 'Gerado por IA',
    modules: [
      journey.stretches[1].modules[0],
      aiModule('seguranca-no-armazem', 'Segurança no Armazém', { lessons: 5 }),
    ],
  },
  {
    source: 'nivela',
    title: 'Produtos Nivela',
    modules: [
      ...journey.stretches[0].modules,
      mod('postura-e-empatia', 'Postura e Empatia', { lessons: 3, covers: 'Postura' }),
    ],
  },
  {
    source: 'company',
    title: 'Produtos da empresa',
    modules: [companyModule('tratamento-de-reclamacoes', 'Tratamento de Reclamações', { lessons: 6 })],
  },
]

export const journeyGoal: JourneyGoal = {
  sector: 'Atendimento',
  competencies: ['Comunicação', 'Postura', 'Rotinas da Distribuidora', 'Reclamações'],
}

const inJourneys = (module: ModuleSummary, journeys_count: number): LibraryModule => ({
  ...module,
  journeys_count,
})

export const contentLibrary: LibraryModule[] = [
  inJourneys(journey.stretches[1].modules[0], 1),
  inJourneys(journey.stretches[0].modules[0], 2),
  inJourneys(companyModule('uso-do-sistema', 'Uso do Sistema'), 0),
]

export const nivelaProducts: ModuleSummary[] = catalog[1].modules

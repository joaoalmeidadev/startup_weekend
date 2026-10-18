import type {
  CatalogGroup,
  Journey,
  JourneyGoal,
  JourneySummary,
  LearningModule,
  LessonReview,
  Manager,
  ModuleSummary,
  PeopleProps,
  Person,
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

const person = (overrides: Partial<Person> & Pick<Person, 'id' | 'name' | 'sector' | 'status'>): Person => ({
  avatar_url: null,
  score: 68,
  goal: 75,
  progress: { percent: 50, current_module: 'Rotinas de atendimento' },
  activity: 'há 2 dias · 35 min nesta semana',
  forecast: 'Nivela em ~12 dias',
  ...overrides,
})

export const peopleProps: PeopleProps = {
  summary: { leveled: 1, on_track: 1, late: 1 },
  sectors: [
    { name: 'Atendimento', count: 2, journey: 'Onboarding Atendimento' },
    { name: 'Comercial', count: 0, journey: null },
    { name: 'Logística', count: 1, journey: 'Onboarding Logística' },
  ],
  people: [
    person({
      id: 'marcos-oliveira',
      name: 'Marcos Oliveira',
      sector: 'Logística',
      status: 'late',
      avatar_url: '/m.jpg',
      score: 41,
      goal: null,
      progress: { percent: 0, current_module: 'Matemática do Dia a Dia' },
      activity: 'há 32 dias · sem estudo nesta semana',
      forecast: 'Atrasado 21 dias',
    }),
    person({
      id: 'maria-souza',
      name: 'Maria Souza',
      sector: 'Atendimento',
      status: 'on_track',
      avatar_url: '/ms.jpg',
    }),
    person({
      id: 'diego-fernandes',
      name: 'Diego Fernandes',
      sector: 'Atendimento',
      status: 'leveled',
      score: 81,
      progress: { percent: 100, current_module: null },
      activity: 'há 3 dias · 15 min nesta semana',
      forecast: 'Nivelado ✓',
    }),
  ],
}

export const sectorGoal: SectorGoal = {
  sector: 'Atendimento',
  sectors: ['Atendimento', 'Comercial'],
  levels: [
    { key: 'easy', label: 'Fácil', target: 60, hint: 'Funções de entrada.' },
    { key: 'medium', label: 'Médio', target: 75, hint: 'O padrão do mercado.' },
    { key: 'hard', label: 'Difícil', target: 90, hint: 'Clientes exigentes.' },
  ],
  level: 'medium',
  experts_count: 5,
  competencies: [
    {
      name: 'Comunicação',
      icon: 'record_voice_over',
      experts_average: 88,
      goal: 75,
      reached: { count: 12, of: 14 },
    },
    {
      name: 'Sistema de Pedidos',
      icon: 'terminal',
      experts_average: 85,
      goal: 75,
      reached: { count: 8, of: 14 },
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
      { label: 'Jornadas', href: '/management/journeys' },
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
  research_share: null,
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
  ...peopleProps.people[1],
  role: 'Atendente',
  tenure: '1 mês de casa',
  journey: {
    id: 'onboarding-atendimento',
    name: 'Onboarding Atendimento',
    stretches: [
      { title: 'Base', modules: [{ name: 'Conversa Clara', status: 'done' }] },
      { title: 'Empresa', modules: [{ name: 'Rotinas', status: 'current' }] },
      { title: 'Setor', modules: [] },
    ],
  },
  study: { weekly_minutes: 35, streak_days: 3, lessons_done: 12, review_accuracy: 82 },
  competencies: [
    { name: 'Comunicação clara', before: 40, now: 70, goal: 75 },
    { name: 'Rotinas da Distribuidora', before: 41, now: 53, goal: 75 },
  ],
  badge: { label: 'Nivelado em Atendimento', earned: false, date: null, forecast: 'Nivela em ~12 dias' },
  milestones: ['Concluiu o trecho Base', '3 dias seguidos de estudo'],
  rewards: {
    points: 240,
    balance: 90,
    redeemed: [{ name: 'Vale-lanche R$ 30', date: '02/10', points: 150 }],
  },
}

export const teamDashboard: TeamDashboard = {
  sector: 'Atendimento',
  period: '6m',
  periods: [
    { key: '30d', label: 'Últimos 30 dias' },
    { key: '6m', label: 'Últimos 6 meses' },
  ],
  leveled: { count: 8, total: 14, change: 43, change_label: 'em 6 meses' },
  leveled_over_time: [
    { label: 'set', percent: 45 },
    { label: 'out', percent: 57 },
  ],
  company_target: 80,
  knowledge_gain: { before: 48, now: 79 },
  time_to_level: { days: 46, before_days: 90 },
  savings: { new_hires: 9, hours: 207, amount: 8280 },
  retention: { review_accuracy: 86, active_weekly: '9 de 14', minutes_per_day: 5 },
  competencies: [{ name: 'Reclamações de Entrega', before: 42, now: 71, goal: 75 }],
  on_the_job: {
    source: 'Avaliação do gestor aos 30 dias',
    items: [{ label: 'Retrabalho por novato', before: 2.6, now: 1.6, unit: 'por mês' }],
  },
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
  done_path: '/management/library',
}

export const sectorWithoutGoal: SectorGoal = {
  ...sectorGoal,
  sector: 'Logística',
  level: null,
  experts_count: 0,
  competencies: [
    { name: 'Conferência', icon: 'inventory_2', experts_average: null, goal: null, reached: null },
  ],
}

// Content area: library, journey builder catalog and goal
const aiModule = (id: string, name: string, overrides: ModuleOverrides = {}) =>
  mod(id, name, { source: 'ai', stretch: 'company', teaching_hours: 4, ...overrides })
const companyModule = (id: string, name: string, overrides: ModuleOverrides = {}) =>
  mod(id, name, { source: 'company', stretch: 'sector', teaching_hours: 5, ...overrides })

export const catalog: CatalogGroup[] = [
  {
    source: 'nivela',
    title: 'Produtos Nivela',
    modules: [
      ...journey.stretches[0].modules,
      mod('postura-e-empatia', 'Postura e Empatia', { lessons: 3, covers: 'Postura' }),
      mod('atendimento-ao-cliente', 'Atendimento ao Cliente', {
        stretch: 'sector',
        lessons: 5,
        teaching_hours: 4,
      }),
    ],
  },
  {
    source: 'ai',
    title: 'Gerado por IA',
    modules: [
      journey.stretches[1].modules[0],
      aiModule('seguranca-no-armazem', 'Segurança no Armazém', { lessons: 5 }),
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

export const contentLibrary: ModuleSummary[] = [
  journey.stretches[1].modules[0],
  journey.stretches[0].modules[0],
  companyModule('uso-do-sistema', 'Uso do Sistema'),
  mod('raciocinio-logico', 'Raciocínio Lógico', { lessons: 5, research_share: 56 }),
]

export const nivelaProducts: ModuleSummary[] = catalog[0].modules

export const readyJourney: Journey['stretches'] = [
  { key: 'base', title: 'Base', modules: journey.stretches[0].modules },
  { key: 'company', title: 'Empresa', modules: [] },
  { key: 'sector', title: 'Setor', modules: [catalog[0].modules[3]] },
]

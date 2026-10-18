import type {
  HomeProps,
  Journey,
  JourneySummary,
  LearningModule,
  LessonReview,
  Manager,
  ModuleSummary,
  PeopleProps,
  PersonDetail,
  SectorGoal,
  TeamDashboard,
} from '@/types/management'

export const manager: Manager = { name: 'Ana Lima', role_label: 'RH', company: 'Distribuidora Sul' }

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
      { label: 'Jornadas', href: '/management/journeys' },
      { label: 'Módulo: Rotinas de atendimento', href: '/management/modules/rotinas-de-atendimento' },
    ],
    module_name: 'Rotinas de atendimento',
    journey_path: '/management/journeys/onboarding-atendimento',
    team: 'atendimento',
    audience_count: 32,
    manual: { before: 'Antes', highlight: 'destaque', after: '.', note: 'Nota', source: 'Manual · p. 14' },
    lesson: {
      minutes: 5,
      title: 'Como acolher uma reclamação',
      intro: 'Introdução.',
      steps: [{ title: 'Acolha com calma:', body: 'diga', quote: 'Compreendo.' }],
    },
    question: { prompt: 'O que fazer?', options: [{ text: 'B) Acolher', correct: true }] },
    other_questions: 1,
    journey_outline: [{ title: '1. Base', status: 'done' }],
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

const mod = (id: string, name: string, status: ModuleSummary['status'] = 'published'): ModuleSummary => ({
  id,
  name,
  competency: `Competência ${name}`,
  lessons: 4,
  status,
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
      modules: [mod('conversa-clara', 'Conversa Clara'), mod('matematica', 'Matemática')],
    },
    { key: 'company', title: 'Empresa', modules: [mod('rotinas-de-atendimento', 'Rotinas', 'in_review')] },
    { key: 'sector', title: 'Setor', modules: [] },
  ],
}

export const library: ModuleSummary[] = [mod('escrita-no-trabalho', 'Escrita no Trabalho')]

export const learningModule: LearningModule = {
  id: 'rotinas-de-atendimento',
  name: 'Rotinas de atendimento',
  competency: 'Rotinas da Distribuidora',
  status: 'in_review',
  source: 'Manual de SAC.pdf',
  stretch: 'Empresa',
  used_in: [{ id: 'onboarding-atendimento', name: 'Onboarding Atendimento' }],
  lessons: [
    { position: 1, title: 'Boas-vindas', status: 'approved' },
    { position: 2, title: 'Como acolher', status: 'pending' },
  ],
  assessment: { questions: 10 },
  review_from: 2,
}

export const home: HomeProps = {
  setup: { done: 2, total: 4, href: '/management/setup' },
  numbers: [
    { label: 'Nivelados', value: '62%', icon: 'verified', tone: 'leveled' },
    { label: 'Precisam de atenção', value: '5', icon: 'priority_high', tone: 'attention' },
  ],
  attention: [
    {
      icon: 'rate_review',
      text: '7 lições da IA esperando sua revisão',
      action: 'Revisar',
      href: '/management/modules/rotinas-de-atendimento',
    },
  ],
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

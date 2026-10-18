import type {
  PointsRule,
  RewardsProps,
  AudienceOption,
  CatalogGroup,
  Journey,
  JourneyGoal,
  JourneySummary,
  LearningModule,
  LessonReview,
  Manager,
  ModuleSummary,
  NewSectorProps,
  InviteSector,
  Person,
  PersonDetail,
  SectorDetail,
  SectorMember,
  SectorSummary,
  TeamDashboard,
} from '@/types/management'
import type { SectorTrainingCost, SectorTrainingCostProps, SectorsIndexProps } from '@/types/management'

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

export const peopleProps: { sectors: InviteSector[]; people: Person[] } = {
  sectors: [
    {
      name: 'Atendimento',
      count: 2,
      journeys: ['Base Nivela', 'Jeito Distribuidora Sul', 'Atendimento na prática'],
    },
    { name: 'Comercial', count: 0, journeys: [] },
    { name: 'Logística', count: 1, journeys: ['Logística na prática'] },
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
    done_path: '/management/library',
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
    id: 'atendimento-na-pratica',
    name: 'Atendimento na prática',
    kind: 'sector',
    status: 'active',
    audience: { type: 'sectors', names: ['Atendimento'] },
    people_in_progress: 5,
    badge: 'Nivelado em Atendimento',
    modules_count: 2,
  },
  {
    id: 'promocao-para-lider',
    name: 'Promoção para líder',
    kind: 'company',
    status: 'draft',
    audience: { type: 'sectors', names: ['Staff'] },
    people_in_progress: 0,
    badge: 'Pronto para liderar',
    modules_count: 3,
  },
  {
    id: 'mentoria',
    name: 'Mentoria',
    kind: 'base',
    status: 'active',
    audience: { type: 'people', names: ['Maria Souza', 'Rafael Lima', 'Bruna Costa'] },
    people_in_progress: 3,
    badge: 'Mentoria concluída',
    modules_count: 1,
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
  research_share: null,
  ...overrides,
})

const conversaClara = mod('conversa-clara', 'Conversa Clara', {
  competency: 'Comunicação',
  research_share: 44,
})
const matematica = mod('matematica', 'Matemática')
const rotinas = mod('rotinas-de-atendimento', 'Rotinas', {
  status: 'in_review',
  source: 'ai',
  stretch: 'company',
  lessons: 8,
  teaching_hours: 6,
  competency: 'Rotinas',
})

export const journey: Journey = {
  id: 'base-nivela',
  name: 'Base Nivela',
  kind: 'base',
  status: 'active',
  audience: { type: 'sectors', names: ['Atendimento', 'Staff'] },
  people_in_progress: 9,
  badge: 'Base Nivela concluída',
  modules: [conversaClara, matematica, rotinas],
}

export const learningModule: LearningModule = {
  id: 'rotinas-de-atendimento',
  name: 'Rotinas de atendimento',
  competency: 'Rotinas',
  status: 'in_review',
  source: 'ai',
  material: 'Manual de SAC.pdf',
  stretch: 'Empresa',
  used_in: [{ id: 'jeito-distribuidora-sul', name: 'Jeito Distribuidora Sul' }],
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
  path: [
    { title: 'Base', journeys: ['Base Nivela'], modules: [{ name: 'Conversa Clara', status: 'done' }] },
    {
      title: 'Empresa',
      journeys: ['Jeito Distribuidora Sul'],
      modules: [{ name: 'Rotinas', status: 'current' }],
    },
    { title: 'Setor', journeys: [], modules: [] },
  ],
  study: { weekly_minutes: 35, streak_days: 3, lessons_done: 12, hours_done: 8, review_accuracy: 82 },
  competencies: [
    { name: 'Comunicação', before: 40, now: 70, goal: 75 },
    { name: 'Rotinas', before: 41, now: 53, goal: 75 },
  ],
  badge: { label: 'Nivelado em Atendimento', earned: false, date: null, forecast: 'Nivela em ~12 dias' },
  milestones: ['Concluiu a jornada Base Nivela', '3 dias seguidos de estudo'],
  rewards: {
    points: 96,
    balance: 66,
    redeemed: [{ name: 'Vale-lanche', date: '02/10', points: 30 }],
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
  savings: { new_hires: 9, hours: 207, amount: 6210 },
  retention: { review_accuracy: 86, active_weekly: '9 de 14', minutes_per_day: 5 },
  competencies: [{ name: 'Reclamações', before: 42, now: 71, goal: 75 }],
  on_the_job: {
    source: 'Avaliação do gestor aos 30 dias',
    items: [{ label: 'Retrabalho por novato', before: 2.6, now: 1.6, unit: 'por mês' }],
  },
  study_share: {
    by_sector: [
      { label: 'Atendimento', hours: 74 },
      { label: 'Comercial', hours: 23 },
      { label: 'Logística', hours: 6 },
    ],
    by_person: [
      { label: 'Carla', hours: 23 },
      { label: 'Diego', hours: 23 },
      { label: 'Rafael', hours: 14 },
      { label: 'Lucas', hours: 14 },
      { label: 'Outros', hours: 29 },
    ],
  },
}

// Content area: library, journey builder catalog and goal
const aiModule = (id: string, name: string, overrides: ModuleOverrides = {}) =>
  mod(id, name, { source: 'ai', stretch: 'company', teaching_hours: 4, ...overrides })
const companyModule = (id: string, name: string, overrides: ModuleOverrides = {}) =>
  mod(id, name, { source: 'company', stretch: 'sector', teaching_hours: 5, ...overrides })

const tratamentoDeReclamacoes = companyModule('tratamento-de-reclamacoes', 'Tratamento de Reclamações', {
  lessons: 6,
  competency: 'Reclamações',
})
const usoDoSistema = companyModule('uso-do-sistema', 'Uso do Sistema', {
  teaching_hours: 4,
  competency: 'Sistema',
})

export const catalog: CatalogGroup[] = [
  {
    source: 'nivela',
    title: 'Produtos Nivela',
    modules: [
      conversaClara,
      matematica,
      mod('postura-e-empatia', 'Postura e Empatia', { lessons: 3, competency: 'Empatia' }),
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
    modules: [rotinas, aiModule('seguranca-no-armazem', 'Segurança no Armazém', { lessons: 5 })],
  },
  {
    source: 'company',
    title: 'Produtos da empresa',
    modules: [tratamentoDeReclamacoes],
  },
]

// Atendimento na prática as the seeds have it: 5 h + 4 h of in-person training replaced
export const serviceJourney: Journey = {
  ...journey,
  id: 'atendimento-na-pratica',
  name: 'Atendimento na prática',
  kind: 'sector',
  audience: { type: 'sectors', names: ['Atendimento'] },
  badge: 'Nivelado em Atendimento',
  modules: [tratamentoDeReclamacoes, usoDoSistema],
}

// Where the points rule of a journey to Atendimento comes from, as JourneyMock sends it
export const pointsRuleSource = 'Atendimento · padrão da empresa'

export const journeyGoal: JourneyGoal = {
  sector: 'Atendimento',
  slug: 'atendimento',
  competencies: ['Comunicação', 'Empatia', 'Rotinas', 'Reclamações'],
}

export const contentLibrary: ModuleSummary[] = [
  rotinas,
  conversaClara,
  usoDoSistema,
  mod('raciocinio-logico', 'Raciocínio Lógico', { lessons: 5, research_share: 56 }),
]

// The ready-made Base Nivela: Nivela base products only
export const readyJourney: ModuleSummary[] = [conversaClara, matematica, catalog[0].modules[2]]

export const audienceOptions: AudienceOption[] = [
  { name: 'Atendimento', kind: 'sector', people_count: 5 },
  { name: 'Comercial', kind: 'sector', people_count: 3 },
  { name: 'Logística', kind: 'sector', people_count: 2 },
  { name: 'Staff', kind: 'group', people_count: 4 },
]

// Sectors and groups: list, one sector (with and without goal), a group and the creation form
const goalLevels: SectorDetail['levels'] = [
  { key: 'easy', label: 'Fácil', target: 60, hint: 'Funções de entrada.' },
  { key: 'medium', label: 'Médio', target: 75, hint: 'O padrão do mercado.' },
  { key: 'hard', label: 'Difícil', target: 90, hint: 'Clientes exigentes.' },
]

const member = (
  overrides: Partial<SectorMember> & Pick<SectorMember, 'id' | 'name' | 'sector' | 'status'>,
) => ({
  ...person(overrides),
  role: 'Atendente',
  ...overrides,
})

export const sectorSummaries: SectorSummary[] = [
  {
    name: 'Atendimento',
    slug: 'atendimento',
    kind: 'sector',
    people_count: 5,
    level: { label: 'Médio', target: 75 },
    people: [
      { id: 'maria-souza', name: 'Maria Souza', avatar_url: '/ms.jpg' },
      { id: 'diego-fernandes', name: 'Diego Fernandes', avatar_url: null },
    ],
  },
  { name: 'Logística', slug: 'logistica', kind: 'sector', people_count: 1, level: null, people: [] },
  {
    name: 'Staff',
    slug: 'staff',
    kind: 'group',
    people_count: 4,
    level: { label: 'Fácil', target: 60 },
    people: [{ id: 'lucas-pereira', name: 'Lucas Pereira', avatar_url: null }],
  },
]

export const sectorDetail: SectorDetail = {
  name: 'Atendimento',
  slug: 'atendimento',
  kind: 'sector',
  people: [
    member({ id: 'maria-souza', name: 'Maria Souza', sector: 'Atendimento', status: 'on_track' }),
    member({
      id: 'diego-fernandes',
      name: 'Diego Fernandes',
      sector: 'Atendimento',
      status: 'leveled',
      score: 81,
      progress: { percent: 100, current_module: null },
      forecast: 'Nivelado ✓',
    }),
    member({
      id: 'bruna-costa',
      name: 'Bruna Costa',
      sector: 'Atendimento',
      status: 'late',
      score: 58,
      activity: 'há 9 dias · 10 min nesta semana',
      forecast: 'Atrasado 8 dias',
    }),
  ],
  levels: goalLevels,
  level: 'medium',
  experts_count: 2,
  competencies: [
    {
      name: 'Comunicação',
      icon: 'record_voice_over',
      experts_average: 88,
      goal: 75,
      reached: { count: 2, of: 2 },
    },
    {
      name: 'Sistema',
      icon: 'terminal',
      experts_average: 85,
      goal: 75,
      reached: { count: 1, of: 2 },
    },
  ],
}

export const sectorWithoutGoal: SectorDetail = {
  ...sectorDetail,
  name: 'Logística',
  slug: 'logistica',
  people: [member({ id: 'marcos-oliveira', name: 'Marcos Oliveira', sector: 'Logística', status: 'late' })],
  level: null,
  experts_count: 0,
  competencies: [
    { name: 'Conferência', icon: 'inventory_2', experts_average: null, goal: null, reached: null },
  ],
}

export const groupDetail: SectorDetail = {
  ...sectorDetail,
  name: 'Staff',
  slug: 'staff',
  kind: 'group',
  people: [
    member({ id: 'diego-fernandes', name: 'Diego Fernandes', sector: 'Atendimento', status: 'leveled' }),
    member({
      id: 'lucas-pereira',
      name: 'Lucas Pereira',
      sector: 'Comercial',
      status: 'leveled',
      role: 'Vendedor interno',
    }),
  ],
  level: 'easy',
  experts_count: 0,
  competencies: [
    { name: 'Comunicação', icon: 'record_voice_over', experts_average: null, goal: 60, reached: null },
  ],
}

export const newSectorProps: NewSectorProps = {
  library_competencies: ['Cultura', 'Rotinas'],
  people: [
    { id: 'maria-souza', name: 'Maria Souza', sector: 'Atendimento', avatar_url: '/ms.jpg' },
    { id: 'lucas-pereira', name: 'Lucas Pereira', sector: 'Comercial', avatar_url: null },
    { id: 'marcos-oliveira', name: 'Marcos Oliveira', sector: 'Logística', avatar_url: null },
  ],
  levels: goalLevels,
  competencies: [
    {
      name: 'Comunicação',
      icon: 'record_voice_over',
      experts_average: null,
      goal: null,
      reached: null,
    },
    { name: 'Raciocínio', icon: 'psychology', experts_average: null, goal: null, reached: null },
  ],
}

const reward = (id: string, name: string, icon: string, category: string, cost: number, points: number) => ({
  id,
  name,
  icon,
  category,
  cost,
  points,
  stock: null,
  redeemed: 0,
})

export const rewardsProps: RewardsProps = {
  points_rule: { teacher_salary: 4400, learner_salary: 2200, reward_share: 0.4 },
  rewards: [
    { ...reward('caneca-nivela', 'Caneca Nivela', 'coffee', 'Brinde', 25, 25), stock: 17, redeemed: 3 },
    {
      ...reward('ingresso-de-cinema', 'Ingresso de cinema', 'movie', 'Experiência', 40, 40),
      stock: 0,
      redeemed: 10,
    },
    reward('escolher-a-escala-da-semana', 'Escolher a escala da semana', 'calendar_month', 'Folga', 0, 40),
    reward('dia-de-folga', 'Dia de folga', 'beach_access', 'Folga', 150, 150),
  ],
  ideas: [reward('almoco-com-o-gestor', 'Almoço com o gestor', 'restaurant', 'Experiência', 60, 60)],
  redemptions: [
    {
      person: { id: 'maria-souza', name: 'Maria Souza', avatar_url: null },
      reward: 'Vale-lanche',
      date: '02/10',
      points: 30,
    },
  ],
  month: { spent: 120, saved: 1020 },
}

export const pointsRule: PointsRule = { teacher_salary: 4400, learner_salary: 2200, reward_share: 0.4 }

export const libraryCompetencies = ['Comunicação', 'Cultura', 'Rotinas', 'Sistema']

// Training cost on the Setores tab: the company rule, Logística with its own salaries and Staff (a group) with none
const companyCost: SectorTrainingCost = { own: false, teacher_salary: 4400, learner_salary: 2200 }

export const logisticsTrainingCost: SectorTrainingCost = {
  own: true,
  teacher_salary: 3960,
  learner_salary: 1980,
}

export const sectorsIndexProps: SectorsIndexProps = {
  company_rule: pointsRule,
  sectors: sectorSummaries.map((sector) => ({
    ...sector,
    training_cost: { Atendimento: companyCost, Logística: logisticsTrainingCost }[sector.name] ?? null,
  })),
}

export const sectorTrainingCostProps: SectorTrainingCostProps = {
  company_rule: pointsRule,
  training_cost: companyCost,
}

export type Manager = {
  name: string
  role_label: string
  company: string
}

export type PersonStatus = 'leveled' | 'on_track' | 'late'

export type Person = {
  id: string
  name: string
  sector: string
  status: PersonStatus
  avatar_url: string | null
  score: number
  goal: number | null
  progress: { percent: number; current_module: string | null }
  activity: string
  forecast: string
}

// A work sector someone can be invited into, with the journeys they would receive
export type InviteSector = { name: string; count: number; journeys: string[] }

export type Competency = {
  name: string
  icon: string
  experts_average: number | null
  goal: number | null
  reached: { count: number; of: number } | null
}

export type LessonStep = { title: string; body: string; quote?: string }

export type LessonReview = {
  position: number
  total: number
  approved: number
  final: boolean
  breadcrumb: { label: string; href: string }[]
  module_name: string
  done_path: string
  team: string
  manual: { before: string; highlight: string; after: string; note: string; source: string }
  lesson: { minutes: number; title: string; intro: string; steps: LessonStep[] }
  question: { prompt: string; options: { text: string; correct: boolean }[] }
  other_questions: number
}

export type JourneyStatus = 'active' | 'draft'
export type StretchKey = 'base' | 'company' | 'sector'
export type ModuleStatus = 'published' | 'in_review' | 'draft'

// Base: general skills; company: culture and processes; sector: the day-to-day of one sector
export type JourneyKind = 'base' | 'company' | 'sector'

// Who receives a journey: sectors and groups by name, or specific people by name
export type JourneyAudience = { type: 'sectors' | 'people'; names: string[] }

export type JourneySummary = {
  id: string
  name: string
  kind: JourneyKind
  status: JourneyStatus
  audience: JourneyAudience
  people_in_progress: number
  badge: string
  modules_count: number
}

export type ModuleSummary = {
  id: string
  name: string
  competency: string
  lessons: number
  status: ModuleStatus
  source: ContentSource
  stretch: StretchKey
  teaching_hours: number
  research_share: number | null
}

export type Journey = Omit<JourneySummary, 'modules_count'> & { modules: ModuleSummary[] }

export type LessonStatus = 'approved' | 'pending' | 'draft'

export type LearningModule = {
  id: string
  name: string
  competency: string
  status: ModuleStatus
  source: ContentSource
  material: string
  stretch: string
  used_in: { id: string; name: string }[]
  lessons: { position: number; title: string; status: LessonStatus }[]
  assessment: { questions: number }
  review_from: number | null
}

export type PersonDetail = Person & {
  role: string
  tenure: string
  // Base, Empresa and Setor, each named after the journeys the person receives of that kind
  path: {
    title: string
    journeys: string[]
    modules: { name: string; status: 'done' | 'current' | 'locked' }[]
  }[]
  study: {
    weekly_minutes: number
    streak_days: number
    lessons_done: number
    hours_done: number
    review_accuracy: number
  }
  competencies: { name: string; before: number; now: number; goal: number | null }[]
  badge: { label: string; earned: boolean; date: string | null; forecast: string }
  milestones: string[]
  rewards: { points: number; balance: number; redeemed: { name: string; date: string; points: number }[] }
}

export type NewModuleProps = {
  journey: { id: string; name: string } | null
  generated: { lessons: number; review_path: string }
  competency_groups: CompetencyGroup[]
}

export type CompetencyGroup = { label: string; competencies: string[] }

export type TeamDashboard = {
  sector: string
  period: string
  periods: { key: string; label: string }[]
  leveled: { count: number; total: number; change: number; change_label: string }
  leveled_over_time: { label: string; percent: number }[]
  company_target: number
  knowledge_gain: { before: number; now: number }
  time_to_level: { days: number; before_days: number }
  savings: { new_hires: number; hours: number; amount: number }
  retention: { review_accuracy: number; active_weekly: string; minutes_per_day: number }
  competencies: { name: string; before: number; now: number; goal: number }[]
  on_the_job: { source: string; items: { label: string; before: number; now: number; unit: string }[] }
}

export type GoalLevelKey = 'easy' | 'medium' | 'hard'

export type GoalLevel = { key: GoalLevelKey; label: string; target: number; hint: string }

// Where a content comes from: AI from company material, the Nivela library or written by the company
export type ContentSource = 'ai' | 'nivela' | 'company'

export type CatalogGroup = { source: ContentSource; title: string; modules: ModuleSummary[] }

export type JourneyGoal = { sector: string | null; slug: string | null; competencies: string[] }

export type JourneyBuilderProps = {
  journey: Journey
  catalog: CatalogGroup[]
  goal: JourneyGoal
  ready_journey: ModuleSummary[] | null
  start_ready: boolean
  audience_options: AudienceOption[]
  people: string[]
  points_rule: PointsRule
}

export type NewJourneyProps = { audience_options: AudienceOption[]; people: string[] }

// A work sector or a custom group of people (e.g. Staff), as offered when choosing who receives a journey
export type SectorKind = 'sector' | 'group'

export type AudienceOption = { name: string; kind: SectorKind; people_count: number }

export type SectorSummary = {
  name: string
  slug: string
  kind: SectorKind
  people_count: number
  level: Pick<GoalLevel, 'label' | 'target'> | null
  people: Pick<Person, 'id' | 'name' | 'avatar_url'>[]
}

export type SectorMember = Person & { role: string }

export type SectorDetail = {
  name: string
  slug: string
  kind: SectorKind
  people: SectorMember[]
  levels: GoalLevel[]
  level: GoalLevelKey | null
  experts_count: number
  competencies: Competency[]
}

export type SectorCandidate = Pick<Person, 'id' | 'name' | 'sector' | 'avatar_url'>

export type NewSectorProps = {
  people: SectorCandidate[]
  levels: GoalLevel[]
  competencies: Competency[]
  library_competencies: string[]
}

// Rewards: 1 point = R$ 1, so a reward costs at least as many points as reais
export type Reward = {
  id: string
  name: string
  icon: string
  category: string
  cost: number
  points: number
  // What is left after the redemptions; null = unlimited
  stock: number | null
  redeemed: number
}

export type Redemption = {
  person: { id: string; name: string; avatar_url: string | null }
  reward: string
  date: string
  points: number
}

export type RewardsProps = {
  points_rule: PointsRule
  rewards: Reward[]
  ideas: Reward[]
  redemptions: Redemption[]
  month: { spent: number; saved: number }
}

// What one hour of in-person training costs (monthly salaries of who teaches and who learns) and how much of
// the saving becomes points
export type PointsRule = { teacher_salary: number; learner_salary: number; reward_share: number }

// Training cost of a work sector: its own salaries, or the company's ones when own is false. Groups have none.
export type SectorTrainingCost = { own: boolean; teacher_salary: number; learner_salary: number }

export type SectorRow = SectorSummary & { training_cost: SectorTrainingCost | null }

export type SectorsIndexProps = { company_rule: PointsRule; sectors: SectorRow[] }

export type SectorTrainingCostProps = { company_rule: PointsRule; training_cost: SectorTrainingCost | null }

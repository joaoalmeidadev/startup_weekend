export type Manager = {
  name: string
  role_label: string
  company: string
}

export type PersonStatus = 'attention' | 'learning' | 'leveled'

export type Person = {
  id: string
  name: string
  sector: string
  status: PersonStatus
  avatar_url: string
  alert?: { icon: string; text: string }
  progress?: { step: string; percent: number; label: string }
  achievement?: string
}

export type SummaryEntry = { count: number; percent: number }

export type PeopleProps = {
  team?: boolean
  summary: Record<PersonStatus, SummaryEntry>
  sectors: { name: string; count: number }[]
  people: Person[]
  total: number
}

export type Competency = {
  name: string
  icon: string
  experts_average: number
  goal: number
  reached: { count: number; of: number; text: string }
}

export type SectorGoal = {
  sector: string
  sectors: string[]
  experts_count: number
  competencies: Competency[]
}

export type LessonStep = { title: string; body: string; quote?: string }

export type LessonReview = {
  position: number
  total: number
  approved: number
  final: boolean
  breadcrumb: { label: string; href: string }[]
  module_name: string
  journey_path: string
  team: string
  audience_count: number
  manual: { before: string; highlight: string; after: string; note: string; source: string }
  lesson: { minutes: number; title: string; intro: string; steps: LessonStep[] }
  question: { prompt: string; options: { text: string; correct: boolean }[] }
  other_questions: number
  journey_outline: { title: string; status: 'done' | 'new' | 'upcoming' }[]
}

export type JourneyStatus = 'active' | 'draft'
export type StretchKey = 'base' | 'company' | 'sector'
export type ModuleStatus = 'published' | 'in_review' | 'draft'

export type JourneySummary = {
  id: string
  name: string
  status: JourneyStatus
  audience: string[]
  people_in_progress: number
  badge: string
  modules_per_stretch: Record<StretchKey, number>
}

export type ModuleSummary = {
  id: string
  name: string
  competency: string
  lessons: number
  status: ModuleStatus
}

export type Stretch = { key: StretchKey; title: string; modules: ModuleSummary[] }

export type Journey = Omit<JourneySummary, 'modules_per_stretch'> & { stretches: Stretch[] }

export type LessonStatus = 'approved' | 'pending' | 'draft'

export type LearningModule = {
  id: string
  name: string
  competency: string
  status: ModuleStatus
  source: string
  stretch: string
  used_in: { id: string; name: string }[]
  lessons: { position: number; title: string; status: LessonStatus }[]
  assessment: { questions: number }
  review_from: number | null
}

export type HomeProps = {
  numbers: { label: string; value: string; icon: string; tone: PersonStatus | 'leveled' }[]
  attention: { icon: string; text: string; action: string; href: string }[]
  setup: { done: number; total: number; href: string }
}

export type PersonDetail = {
  id: string
  name: string
  sector: string
  role: string
  tenure: string
  status: PersonStatus
  avatar_url: string
  alert?: { icon: string; text: string }
  achievement?: string
  journey: {
    id: string
    name: string
    stretches: { title: string; modules: { name: string; status: 'done' | 'current' | 'locked' }[] }[]
  }
  knows: string[]
  learning: string[]
  feedback: string[]
}

export type NewModuleProps = {
  journey: { id: string; name: string } | null
  generated: { lessons: number; review_path: string }
}

export type Settings = {
  alert_days: number
  alert_options: number[]
  ranking_enabled: boolean
  badges: { name: string; enabled: boolean }[]
}

export type SetupStep = {
  title: string
  icon: string
  done: boolean
  fields: { label: string; value: string }[]
}

export type RoleChange = {
  person: { id: string; name: string; role: string; sector: string }
  roles: { title: string; missing: string[]; weeks: number }[]
}

export type ManagerReview = {
  person: { id: string; name: string }
  statements: string[]
  scale: string[]
}

export type Company = {
  name: string
  plan: string
  people: number
  leveled: number
  status: 'active' | 'trial'
  next_charge: string
}

export type LibraryModule = ModuleSummary & { lesson_titles: string[] }

export type TeamDashboard = {
  sector: string
  period: string
  periods: { key: string; label: string }[]
  leveled: { count: number; total: number; change: number; change_label: string }
  days_to_level: number
  leveled_over_time: { label: string; percent: number }[]
  company_target: number
  competencies: { name: string; team_average: number; goal: number }[]
  engagement: { label: string; value: string }[]
  funnel: { stage: string; count: number }[]
}

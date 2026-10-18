export type Viewer = {
  name: string
  first_name: string
  sector: string
  company: string
  avatar_url: string
}

export type LessonStatus = 'done' | 'current' | 'locked'

export type Lesson = {
  id?: string
  module_id?: string
  title: string
  status: LessonStatus
  minutes?: number
  description?: string
}

export type JourneySection = {
  title: string
  lessons: Lesson[]
}

export type Journey = {
  today: { minutes: number; owner: string }
  step: { current: number; total: number }
  sections: JourneySection[]
  badge: { title: string; description: string }
  summary: { completed: number; percent: number }
}

export type Badge = {
  title: string
  icon: string
  earned: boolean
}

export type StretchProgress = {
  name: string
  completed: number
  total: number
}

export type Progress = {
  badges: Badge[]
  evolution: { completed: number; total: number; stretches: StretchProgress[] }
}

export type Profile = {
  reminder_time: string
  reminder_options: string[]
}

export type DiagnosticQuestion = {
  stretch: string
  kind: 'objective' | 'scenario'
  prompt: string
  options: string[]
}

export type DiagnosticResult = {
  known: string[]
  to_learn: string[]
  modules: number
  minutes_per_day: number
}

export type MicroLesson = {
  id: string
  title: string
  module_name: string
  minutes: number
  points: number
  video: { title: string; duration: string }
  explanation: string[]
  question: { prompt: string; options: { text: string; correct: boolean; feedback: string }[] }
  badge: string
}

export type CollaboratorModule = {
  name: string
  done: number
  lessons: { title: string; status: LessonStatus }[]
  continue_path: string | null
}

// A reward as the collaborator sees it: only points, never the R$ cost (stock null = unlimited)
export type CollaboratorReward = {
  id: string
  name: string
  icon: string
  category: string
  points: number
  stock: number | null
}

export type RedeemedReward = { name: string; date: string; points: number }

export type RewardsPage = { balance: number; rewards: CollaboratorReward[]; redeemed: RedeemedReward[] }

export type ContributionStatus = 'pending' | 'approved' | 'changes_requested'

export type ContributionLesson = {
  title: string
  question: { prompt: string; options: { text: string; correct: boolean }[] }
}

// A journey the collaborator proposed to share what she knows; the admin approves it and decides the points
export type Contribution = {
  id: string
  author: string
  title: string
  sector: string
  hours: number
  sent_on: string
  status: ContributionStatus
  awarded_points: number | null
  suggested_points: number
  lessons: ContributionLesson[]
}

export type ContributionsPage = { contributions: Contribution[]; earned: number }

export type ContributionForm = { sectors: string[]; points_per_hour: number }

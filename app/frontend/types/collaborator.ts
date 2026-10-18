export type Viewer = {
  name: string
  first_name: string
  sector: string
  company: string
  avatar_url: string
}

export type LessonStatus = 'done' | 'current' | 'locked'

export type Badge = {
  title: string
  icon: string
  earned: boolean
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

export type LearnerStep = {
  module_id: string
  name: string
  hours: number
  lessons: number
  points: number
  status: LessonStatus
}

export type LearnerJourneyStatus = 'done' | 'active' | 'queued'

export type LearnerJourney = {
  id: string
  name: string
  kind: 'base' | 'company' | 'sector'
  badge: string
  status: LearnerJourneyStatus
  steps: LearnerStep[]
  points_total: number
  points_earned: number
}

export type NextStep = {
  journey: string
  module_id: string
  name: string
  points: number
}

export type LearnerPoints = {
  study: number
  sharing: number
  total: number
  balance: number
}

export type Learner = {
  name: string
  journeys: LearnerJourney[]
  next_step: NextStep | null
  points: LearnerPoints
  streak_days: number
  badges: Badge[]
}

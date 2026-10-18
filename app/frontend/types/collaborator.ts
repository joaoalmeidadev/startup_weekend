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

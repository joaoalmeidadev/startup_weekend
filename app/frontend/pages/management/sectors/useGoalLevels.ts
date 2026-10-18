import { useState } from 'react'
import type { Competency, GoalLevel, GoalLevelKey } from '@/types/management'

type GoalSource = { levels: GoalLevel[]; level: GoalLevelKey | null; competencies: Competency[] }

// Level picked plus one goal per competency; "adjusted" when any ruler left the level target
export function useGoalLevels({ levels, level: initialLevel, competencies }: GoalSource) {
  const [levelKey, setLevelKey] = useState(initialLevel)
  const [goals, setGoals] = useState(competencies.map((competency) => competency.goal ?? 0))
  const level = levels.find((candidate) => candidate.key === levelKey) ?? null
  const adjusted = level !== null && goals.some((goal) => goal !== level.target)

  const pickLevel = (picked: GoalLevel) => {
    setLevelKey(picked.key)
    setGoals((current) => current.map(() => picked.target))
  }
  const setGoal = (index: number, goal: number) =>
    setGoals((current) => current.map((g, i) => (i === index ? goal : g)))

  return { level, goals, adjusted, pickLevel, setGoal }
}

export type GoalLevels = ReturnType<typeof useGoalLevels>

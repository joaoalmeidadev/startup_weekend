import { useState } from 'react'
import type { Competency, GoalLevel, GoalLevelKey } from '@/types/management'

type GoalSource = { levels: GoalLevel[]; level: GoalLevelKey | null; competencies: Competency[] }

// Level picked, the goal competencies and one goal each; "adjusted" when any ruler left the level target
export function useGoalLevels({ levels, level: initialLevel, competencies }: GoalSource) {
  const [levelKey, setLevelKey] = useState(initialLevel)
  const [list, setList] = useState(competencies)
  const [goals, setGoals] = useState(competencies.map((competency) => competency.goal ?? 0))
  const level = levels.find((candidate) => candidate.key === levelKey) ?? null
  const adjusted = level !== null && goals.some((goal) => goal !== level.target)

  const pickLevel = (picked: GoalLevel) => {
    setLevelKey(picked.key)
    setGoals((current) => current.map(() => picked.target))
  }
  const setGoal = (index: number, goal: number) =>
    setGoals((current) => current.map((g, i) => (i === index ? goal : g)))

  // A competency added later starts at the level target, with no veterans reference yet
  const addCompetency = (name: string) => {
    setList((current) => [
      ...current,
      { name, icon: 'school', experts_average: null, goal: null, reached: null },
    ])
    setGoals((current) => [...current, level?.target ?? 0])
  }

  return { level, goals, adjusted, pickLevel, setGoal, competencies: list, addCompetency }
}

export type GoalLevels = ReturnType<typeof useGoalLevels>

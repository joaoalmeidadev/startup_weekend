import { useState } from 'react'
import { CHART } from './colors'
import { useWidth } from './useWidth'

type Point = { label: string; value: number }

type LineChartProps = {
  points: Point[]
  target?: { value: number; label: string }
  unit?: string
  max?: number
  height?: number
}

const PAD = { top: 16, right: 56, bottom: 28, left: 40 }
const TICKS = [0, 25, 50, 75, 100]

// One series over time with an optional target line; hover snaps to the nearest point
export function LineChart({ points, target, unit = '%', max = 100, height = 220 }: LineChartProps) {
  const { ref, width } = useWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const plotW = width - PAD.left - PAD.right
  const plotH = height - PAD.top - PAD.bottom
  const x = (index: number) =>
    PAD.left + (points.length === 1 ? plotW / 2 : (index / (points.length - 1)) * plotW)
  const y = (value: number) => PAD.top + plotH - (value / max) * plotH
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.value)}`).join(' ')
  const area = `${path} L${x(points.length - 1)},${y(0)} L${x(0)},${y(0)} Z`
  const last = points[points.length - 1]
  const band = plotW / Math.max(points.length - 1, 1)
  const shown = active ?? null

  return (
    <div ref={ref} className="relative w-full">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`Evolução: ${points.map((p) => `${p.label} ${p.value}${unit}`).join(', ')}`}
      >
        {TICKS.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={PAD.left + plotW}
              y1={y(tick)}
              y2={y(tick)}
              stroke={CHART.grid}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={y(tick)}
              dy="0.32em"
              textAnchor="end"
              fontSize={11}
              fill={CHART.axis}
              className="tabular-nums"
            >
              {tick}
              {unit}
            </text>
          </g>
        ))}
        {target && (
          <g>
            <line
              x1={PAD.left}
              x2={PAD.left + plotW}
              y1={y(target.value)}
              y2={y(target.value)}
              stroke={CHART.goal}
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            <text
              x={PAD.left + plotW}
              y={y(target.value) - 6}
              textAnchor="end"
              fontSize={11}
              fontWeight={600}
              fill="#5f4100"
            >
              {target.label}
            </text>
          </g>
        )}
        <path d={area} fill={CHART.team} opacity={0.1} />
        <path
          d={path}
          fill="none"
          stroke={CHART.team}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <text key={p.label} x={x(i)} y={height - 8} textAnchor="middle" fontSize={11} fill={CHART.axis}>
            {p.label}
          </text>
        ))}
        {shown !== null && (
          <line
            x1={x(shown)}
            x2={x(shown)}
            y1={PAD.top}
            y2={PAD.top + plotH}
            stroke={CHART.axis}
            strokeWidth={1}
          />
        )}
        <circle
          cx={x(points.length - 1)}
          cy={y(last.value)}
          r={5}
          fill={CHART.team}
          stroke="#fff"
          strokeWidth={2}
        />
        <text
          x={x(points.length - 1) + 10}
          y={y(last.value)}
          dy="0.32em"
          fontSize={13}
          fontWeight={700}
          fill="#0a1f21"
        >
          {last.value}
          {unit}
        </text>
        {shown !== null && shown !== points.length - 1 && (
          <circle
            cx={x(shown)}
            cy={y(points[shown].value)}
            r={5}
            fill={CHART.team}
            stroke="#fff"
            strokeWidth={2}
          />
        )}
        {points.map((p, i) => (
          <rect
            key={p.label}
            x={x(i) - band / 2}
            y={PAD.top}
            width={band}
            height={plotH}
            fill="transparent"
            tabIndex={0}
            aria-label={`${p.label}: ${p.value}${unit}`}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          />
        ))}
      </svg>
      {shown !== null && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg bg-inverse-surface px-space-sm py-1 text-inverse-on-surface shadow-lg"
          style={{ left: x(shown), top: Math.max(y(points[shown].value) - 52, 0) }}
        >
          <span className="block text-label-md font-bold">
            {points[shown].value}
            {unit}
          </span>
          <span className="block text-label-sm">{points[shown].label}</span>
        </div>
      )}
    </div>
  )
}

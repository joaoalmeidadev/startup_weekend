import { useState } from 'react'
import { CHART } from './colors'

export type DonutSlice = { label: string; value: number }

type DonutChartProps = { label: string; slices: DonutSlice[]; unit: string }

export const OTHERS_LABEL = 'Outros'

const SIZE = { width: 400, height: 240 }
const CENTER = { x: SIZE.width / 2, y: SIZE.height / 2 }
const RING = { outer: 84, inner: 66 }
const HIT = { outer: RING.outer + 8, inner: RING.inner - 8 }
const LABEL_RADIUS = RING.outer + 14

// Fixed categorical order by position; "Outros" always recedes in neutral gray
export function sliceColor(label: string, index: number) {
  if (label === OTHERS_LABEL) return CHART.others
  return CHART.slices[index % CHART.slices.length]
}

export const sharePercent = (value: number, total: number) => (total ? Math.round((value / total) * 100) : 0)

// Clockwise from 12 o'clock, so angle 0 is the top of the ring
function pointAt(angle: number, radius: number) {
  return { x: CENTER.x + radius * Math.sin(angle), y: CENTER.y - radius * Math.cos(angle) }
}

// A full turn can't be a single arc, so a lone slice stops just short of it
function arcPath(start: number, end: number, outer: number, inner: number) {
  const stop = Math.min(end, start + Math.PI * 2 - 0.0001)
  const large = stop - start > Math.PI ? 1 : 0
  const [o1, o2, i1, i2] = [
    pointAt(start, outer),
    pointAt(stop, outer),
    pointAt(stop, inner),
    pointAt(start, inner),
  ]
  return [
    `M${o1.x},${o1.y}`,
    `A${outer},${outer} 0 ${large} 1 ${o2.x},${o2.y}`,
    `L${i1.x},${i1.y}`,
    `A${inner},${inner} 0 ${large} 0 ${i2.x},${i2.y}`,
    'Z',
  ].join(' ')
}

function layout(slices: DonutSlice[]) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  let start = 0
  const arcs = slices.map((slice, index) => {
    const end = start + (slice.value / (total || 1)) * Math.PI * 2
    const arc = { ...slice, color: sliceColor(slice.label, index), start, end, mid: (start + end) / 2 }
    start = end
    return arc
  })
  return { total, arcs: arcs.filter((arc) => arc.value > 0) }
}

// A thin ring for a part-to-whole of a few slices: total in the center, a direct label per slice
// and the exact value on hover or focus. Slices are split by a 2px surface gap.
export function DonutChart({ label, slices, unit }: DonutChartProps) {
  const [active, setActive] = useState<number | null>(null)
  const { total, arcs } = layout(slices)
  const describe = (slice: DonutSlice) =>
    `${slice.label}: ${slice.value} ${unit} (${sharePercent(slice.value, total)}%)`
  const shown = active === null ? null : arcs[active]

  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      <svg viewBox={`0 0 ${SIZE.width} ${SIZE.height}`} className="w-full" role="group" aria-label={label}>
        {arcs.map((arc, index) => (
          <path
            key={arc.label}
            d={arcPath(arc.start, arc.end, RING.outer, RING.inner)}
            fill={arc.color}
            stroke="#fff"
            strokeWidth={2}
            opacity={active === null || active === index ? 1 : 0.45}
          />
        ))}
        {arcs.map((arc) => (
          <SliceLabel
            key={arc.label}
            angle={arc.mid}
            text={`${arc.label} ${sharePercent(arc.value, total)}%`}
          />
        ))}
        <text x={CENTER.x} y={CENTER.y - 4} textAnchor="middle" fontSize={24} fontWeight={700} fill="#0a1f21">
          {total} {unit}
        </text>
        <text x={CENTER.x} y={CENTER.y + 16} textAnchor="middle" fontSize={11} fill={CHART.axis}>
          no total
        </text>
        {arcs.map((arc, index) => (
          <path
            key={arc.label}
            d={arcPath(arc.start, arc.end, HIT.outer, HIT.inner)}
            fill="transparent"
            tabIndex={0}
            aria-label={describe(arc)}
            className="outline-none focus-visible:stroke-primary"
            onPointerEnter={() => setActive(index)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
          />
        ))}
      </svg>
      {shown && <SliceTooltip angle={shown.mid} text={describe(shown)} />}
    </div>
  )
}

function SliceLabel({ angle, text }: { angle: number; text: string }) {
  const at = pointAt(angle, LABEL_RADIUS)
  const anchor = Math.abs(at.x - CENTER.x) < 8 ? 'middle' : at.x > CENTER.x ? 'start' : 'end'
  return (
    <text x={at.x} y={at.y} dy="0.32em" textAnchor={anchor} fontSize={12} fill="#3f4949">
      {text}
    </text>
  )
}

// Placed over the hovered slice, in percent of the chart so it follows the responsive SVG
function SliceTooltip({ angle, text }: { angle: number; text: string }) {
  const at = pointAt(angle, (RING.outer + RING.inner) / 2)
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-lg bg-inverse-surface px-space-sm py-1 text-label-md font-bold whitespace-nowrap text-inverse-on-surface shadow-lg"
      style={{ left: `${(at.x / SIZE.width) * 100}%`, top: `${(at.y / SIZE.height) * 100}%` }}
    >
      {text}
    </div>
  )
}

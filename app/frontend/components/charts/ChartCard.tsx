import { useState, type ReactNode } from 'react'
import { Icon } from '@/components/Icon'

type ChartCardProps = {
  title: string
  subtitle?: string
  legend?: ReactNode
  table: { headers: string[]; rows: (string | number)[][] }
  children: ReactNode
  className?: string
}

// Every chart has a table twin, so no value depends on color or hover alone
export function ChartCard({ title, subtitle, legend, table, children, className = '' }: ChartCardProps) {
  const [asTable, setAsTable] = useState(false)

  return (
    <section
      className={`flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex flex-col">
          <h2 className="text-headline-sm text-on-surface">{title}</h2>
          {subtitle && <p className="text-body-sm text-on-surface-variant">{subtitle}</p>}
        </div>
        <button
          type="button"
          aria-pressed={asTable}
          onClick={() => setAsTable(!asTable)}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-space-sm py-1 text-label-sm text-primary hover:bg-surface-container"
        >
          <Icon name={asTable ? 'monitoring' : 'table_rows'} className="text-[1rem]" />
          {asTable ? 'Ver gráfico' : 'Ver tabela'}
        </button>
      </div>
      {legend && !asTable && (
        <div className="flex flex-wrap gap-space-md text-label-sm text-on-surface-variant">{legend}</div>
      )}
      {asTable ? (
        <table className="w-full text-left text-body-sm">
          <thead>
            <tr className="border-b border-surface-container-high text-on-surface-variant">
              {table.headers.map((header) => (
                <th key={header} className="py-1 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {table.rows.map((row) => (
              <tr key={String(row[0])} className="border-b border-surface-container">
                {row.map((cell, index) => (
                  <td key={index} className="py-1 text-on-surface">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        children
      )}
    </section>
  )
}

export function LegendKey({
  color,
  label,
  shape = 'rect',
}: {
  color: string
  label: string
  shape?: 'rect' | 'line' | 'tick'
}) {
  const mark =
    shape === 'line' ? 'h-0.5 w-4' : shape === 'tick' ? 'h-3.5 w-1 rounded-full' : 'h-2.5 w-3.5 rounded-sm'
  return (
    <span className="inline-flex items-center gap-space-xs">
      <span className={`inline-block ${mark}`} style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

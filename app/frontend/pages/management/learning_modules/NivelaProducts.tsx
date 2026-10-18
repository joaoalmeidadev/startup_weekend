import { Link } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { SourceBadge } from '@/components/SourceBadge'
import type { ModuleSummary, NewModuleProps } from '@/types/management'

type NivelaProductsProps = { products: ModuleSummary[]; journey: NewModuleProps['journey'] }

// Ready-made Nivela library: adding is simulated and the product lands in its suggested stretch
export function NivelaProducts({ products, journey }: NivelaProductsProps) {
  const notify = useMockNotice()
  const [added, setAdded] = useState<string[]>([])
  const add = (product: ModuleSummary) => {
    const stretch = product.stretch === 'sector' ? 'no Setor' : 'na Base'
    const target = journey ? `${stretch} de ${journey.name}` : `${stretch} da jornada`
    setAdded((ids) => [...ids, product.id])
    notify(`"${product.name}" entrou ${target} (simulação).`)
  }

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex flex-wrap items-center gap-space-sm">
        <SourceBadge source="nivela" />
        <span className="text-body-sm text-on-surface-variant">
          Prontos para usar, mesmo sem material da empresa. Entram na Base ou no Setor.
        </span>
      </div>
      <ul aria-label="Produtos Nivela" className="flex flex-col divide-y divide-surface-container">
        {products.map((product) => {
          const done = added.includes(product.id)
          return (
            <li key={product.id} className="flex items-center justify-between gap-space-sm py-space-sm">
              <span className="flex min-w-0 flex-col">
                <span className="text-label-lg text-on-surface">{product.name}</span>
                <span className="text-body-sm text-on-surface-variant">
                  {product.competency} · {product.lessons} lições
                </span>
              </span>
              <button
                type="button"
                disabled={done}
                aria-label={done ? `${product.name} adicionado` : `Adicionar ${product.name} à jornada`}
                onClick={() => add(product)}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-space-md py-1.5 text-label-md text-on-primary hover:bg-primary-container disabled:bg-surface-container disabled:text-on-surface-variant"
              >
                <Icon name={done ? 'check' : 'add'} className="text-[1rem]" />
                {done ? 'Adicionado' : 'Adicionar à jornada'}
              </button>
            </li>
          )
        })}
      </ul>
      <Link
        href={journey ? `/management/journeys/${journey.id}` : '/management/journeys'}
        className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
      >
        Ver a jornada
        <Icon name="arrow_forward" className="text-[1.125rem]" />
      </Link>
    </div>
  )
}

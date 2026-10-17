import { useState } from 'react'
import { Icon } from '@/components/Icon'
import type { RankingVisibility } from '@/types/collaborator'

type Option = { value: RankingVisibility; title: string; hint: string }

type VisibilityPickerProps = { initial: RankingVisibility; firstName: string }

// Choice is local for now; persisting it comes with the real ranking
export function VisibilityPicker({ initial, firstName }: VisibilityPickerProps) {
  const [selected, setSelected] = useState(initial)
  const options: Option[] = [
    {
      value: 'name',
      title: `Mostrar meu nome: ${firstName}`,
      hint: 'Todos verão suas conquistas com seu nome',
    },
    { value: 'anonymous', title: 'Colaborador anônimo', hint: 'Seus pontos aparecem sem mostrar seu nome' },
    { value: 'hidden', title: 'Não aparecer na lista', hint: 'Apenas você acompanha seu progresso' },
  ]

  return (
    <div role="radiogroup" aria-label="Como apareço no ranking" className="flex flex-col gap-space-sm">
      {options.map((option) => {
        const active = option.value === selected
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setSelected(option.value)}
            className={`flex min-h-[4rem] w-full items-center justify-between rounded-xl p-space-md text-left text-on-surface shadow-sm transition-all ${active ? 'bg-surface-container-low' : 'bg-surface-container-lowest'}`}
          >
            <div className="flex items-center gap-space-md">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full ${active ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-transparent'}`}
              >
                <Icon name="check" className="text-[1.375rem]" />
              </div>
              <div className="flex flex-col">
                <span className="text-body-lg-bold text-on-surface">{option.title}</span>
                <span className="text-label-md text-on-surface-variant">{option.hint}</span>
              </div>
            </div>
            {active && <span className="text-label-md font-bold text-primary">Ativado</span>}
          </button>
        )
      })}
    </div>
  )
}

import { Icon } from '@/components/Icon'
import { SOURCES } from '@/components/SourceBadge'
import type { CompetencyGroup } from '@/types/management'
import { CompetencyField } from './CompetencyField'
import { FormBlock } from './FormBlock'
import type { ContentDraft, Origin } from './contentDraft'

const ORIGINS: { value: Origin; title: string; hint: string }[] = [
  {
    value: 'ai',
    title: 'Gerado por IA',
    hint: 'A IA cria as lições a partir do arquivo; passa pela sua revisão.',
  },
  { value: 'company', title: 'Produto da empresa', hint: 'As lições são escritas pela empresa.' },
]

type OriginBlockProps = {
  draft: ContentDraft
  competencyGroups: CompetencyGroup[]
  onChange: (draft: ContentDraft) => void
}

function OriginCard({
  origin,
  checked,
  onPick,
}: {
  origin: (typeof ORIGINS)[number]
  checked: boolean
  onPick: () => void
}) {
  const source = SOURCES[origin.value]
  return (
    <label
      className={`flex cursor-pointer items-start gap-space-sm rounded-xl border-2 p-space-md ${checked ? 'border-primary bg-surface-container-low' : 'border-surface-container-high hover:bg-surface-container-low'}`}
    >
      <input
        type="radio"
        name="origin"
        checked={checked}
        onChange={onPick}
        className="mt-1 size-5 text-primary-container focus:ring-primary-container"
      />
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${source.className}`}>
        <Icon name={source.icon} className="text-[1.5rem]" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-label-lg text-on-surface">{origin.title}</span>
        <span className="text-body-sm text-on-surface-variant">{origin.hint}</span>
      </span>
    </label>
  )
}

// Where the content comes from and which competency it trains
export function OriginBlock({ draft, competencyGroups, onChange }: OriginBlockProps) {
  return (
    <FormBlock id="origin-block" title="De onde vem">
      <div role="radiogroup" aria-label="Origem" className="grid grid-cols-1 gap-space-md md:grid-cols-2">
        {ORIGINS.map((origin) => (
          <OriginCard
            key={origin.value}
            origin={origin}
            checked={draft.origin === origin.value}
            onPick={() => onChange({ ...draft, origin: origin.value })}
          />
        ))}
      </div>
      <CompetencyField draft={draft} groups={competencyGroups} onChange={onChange} />
      <p className="flex items-center gap-space-xs text-body-sm text-on-surface-variant">
        <Icon name={SOURCES.nivela.icon} className="text-[1.125rem] text-primary" />
        Produtos Nivela já vêm prontos na Biblioteca — não precisa cadastrar.
      </p>
    </FormBlock>
  )
}

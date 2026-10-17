import type { RankingEntry } from '@/types/collaborator'

function PositionBubble({ position }: { position: number }) {
  const podium =
    position === 1
      ? 'bg-secondary-fixed text-on-secondary-fixed'
      : 'bg-surface-container-highest text-on-surface'
  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-full text-headline-md ${podium}`}
    >
      {position}º
    </span>
  )
}

function ColleagueRow({ entry }: { entry: RankingEntry }) {
  return (
    <li className="flex min-h-[4rem] items-center justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex items-center gap-space-md">
        <PositionBubble position={entry.position} />
        <div className="flex flex-col">
          <span
            className={`text-body-lg-bold ${entry.anonymous ? 'text-on-surface-variant' : 'text-on-surface'}`}
          >
            {entry.name}
          </span>
          <span className={`text-label-md ${entry.anonymous ? 'text-outline' : 'text-on-surface-variant'}`}>
            {entry.anonymous ? 'Perfil reservado' : 'Colega de equipe'}
          </span>
        </div>
      </div>
      <span className="text-body-lg-bold text-secondary">{entry.points} pts</span>
    </li>
  )
}

function OwnRow({ entry }: { entry: RankingEntry }) {
  return (
    <li className="mt-space-xs flex min-h-[4.5rem] items-center justify-between rounded-xl bg-primary-container p-space-md text-on-primary shadow-md">
      <div className="flex items-center gap-space-md">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-on-primary text-headline-md font-bold text-primary">
          {entry.position}º
        </span>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-headline-md text-on-primary">Você ({entry.name})</span>
            <span className="rounded bg-primary px-2 py-0.5 text-[0.875rem] font-semibold tracking-wide text-on-primary-container uppercase">
              Sua Posição
            </span>
          </div>
          <span className="text-label-md text-on-primary-container">Muito bem! Continue estudando hoje.</span>
        </div>
      </div>
      <span className="text-headline-md text-secondary-fixed">{entry.points} pts</span>
    </li>
  )
}

export function RankingList({ ranking }: { ranking: RankingEntry[] }) {
  return (
    <ol className="flex flex-col gap-space-sm pt-space-xs">
      {ranking.map((entry) =>
        entry.current ? (
          <OwnRow key={entry.position} entry={entry} />
        ) : (
          <ColleagueRow key={entry.position} entry={entry} />
        ),
      )}
    </ol>
  )
}

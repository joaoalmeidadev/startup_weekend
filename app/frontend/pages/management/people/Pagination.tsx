import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'

const PAGES = ['1', '2', '3', '…', '9']
const BUTTON = 'flex size-10 items-center justify-center rounded-lg text-label-md transition-colors'

export function Pagination({ shown, total }: { shown: number; total: number }) {
  const notify = useMockNotice()
  const otherPage = () => notify('A paginação chega em breve.')

  return (
    <footer className="flex flex-col items-center justify-between gap-space-md pt-space-sm sm:flex-row">
      <span className="text-body-md text-on-surface-variant">
        Mostrando <span className="font-semibold text-on-surface">{shown}</span> de{' '}
        <span className="font-semibold text-on-surface">{total}</span> pessoas
      </span>
      <div className="flex items-center gap-space-xs">
        <button
          type="button"
          disabled
          aria-label="Página anterior"
          className={`${BUTTON} cursor-not-allowed bg-surface-container text-outline`}
        >
          <Icon name="chevron_left" className="text-[1.25rem]" />
        </button>
        {PAGES.map((page) =>
          page === '…' ? (
            <span key={page} className="px-space-xs text-outline">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              aria-current={page === '1' ? 'page' : undefined}
              onClick={page === '1' ? undefined : otherPage}
              className={`${BUTTON} ${page === '1' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}`}
            >
              {page}
            </button>
          ),
        )}
        <button
          type="button"
          aria-label="Próxima página"
          onClick={otherPage}
          className={`${BUTTON} bg-surface-container text-on-surface hover:bg-surface-container-high`}
        >
          <Icon name="chevron_right" className="text-[1.25rem]" />
        </button>
      </div>
    </footer>
  )
}

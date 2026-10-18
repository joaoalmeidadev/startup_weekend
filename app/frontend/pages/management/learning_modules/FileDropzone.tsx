import { Icon } from '@/components/Icon'

export const SAMPLE_FILE = 'Manual de SAC.pdf'

type FileDropzoneProps = {
  fileName: string | null
  onPick: (name: string | null) => void
  onSample: () => void
}

export function FileDropzone({ fileName, onPick, onSample }: FileDropzoneProps) {
  return (
    <div className="flex flex-col gap-space-sm">
      <label className="flex cursor-pointer flex-col items-center gap-space-sm rounded-xl border-2 border-dashed border-primary-fixed-dim bg-surface-container-low p-space-xl text-center hover:bg-surface-container">
        <Icon name="upload_file" className="text-[3rem] text-primary" />
        <span className="text-label-lg text-on-surface">
          {fileName ?? 'Arraste aqui ou clique para escolher'}
        </span>
        <span className="text-body-sm text-on-surface-variant">
          PDF, DOC, DOCX ou vídeo — manuais, apresentações, procedimentos
        </span>
        <input
          type="file"
          accept=".pdf,.doc,.docx,video/*"
          className="sr-only"
          aria-label="Arquivo do conteúdo"
          onChange={(event) => onPick(event.target.files?.[0]?.name ?? null)}
        />
      </label>
      {!fileName && (
        <button type="button" onClick={onSample} className="w-fit text-label-md text-primary underline">
          Usar o arquivo de exemplo ({SAMPLE_FILE})
        </button>
      )}
    </div>
  )
}

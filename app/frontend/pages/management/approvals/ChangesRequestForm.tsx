import { useState } from 'react'

// The note the author gets back when the proposal needs another round
export function ChangesRequestForm({ onSend }: { onSend: (note: string) => void }) {
  const [note, setNote] = useState('')
  return (
    <form
      className="flex flex-col gap-space-sm"
      onSubmit={(event) => {
        event.preventDefault()
        onSend(note)
      }}
    >
      <label htmlFor="changes-note" className="text-label-lg text-on-surface">
        O que precisa mudar?
      </label>
      <textarea
        id="changes-note"
        rows={3}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        className="rounded-xl bg-surface-container-low p-space-md text-body-md text-on-surface ring-1 ring-outline-variant focus:ring-2 focus:ring-primary focus:outline-none"
      />
      <button
        type="submit"
        disabled={note.trim() === ''}
        className="inline-flex h-12 w-fit items-center justify-center rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-md hover:bg-primary-container disabled:opacity-50"
      >
        Enviar pedido
      </button>
    </form>
  )
}

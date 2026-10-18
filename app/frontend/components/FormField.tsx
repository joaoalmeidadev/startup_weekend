import type { InputHTMLAttributes } from 'react'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  error?: string | string[]
}

export function FormField({ label, name, error, ...inputProps }: FormFieldProps) {
  const errorMessage = Array.isArray(error) ? error.join(', ') : error
  const errorId = `${name}-error`

  return (
    <div className="space-y-space-xs">
      <label htmlFor={name} className="block text-label-lg text-on-surface">
        {label}
      </label>
      <input
        className="block h-11 w-full rounded-xl bg-surface-container-lowest shadow-sm px-space-md text-body-md text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container aria-invalid:border-error"
        {...inputProps}
        id={name}
        name={name}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? errorId : undefined}
      />
      {errorMessage && (
        <p id={errorId} className="text-body-md text-error">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

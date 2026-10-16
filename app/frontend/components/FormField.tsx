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
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        {...inputProps}
        id={name}
        name={name}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? errorId : undefined}
      />
      {errorMessage && (
        <p id={errorId} className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

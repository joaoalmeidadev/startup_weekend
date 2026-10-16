import { Head, Link, useForm } from '@inertiajs/react'
import type { FormEvent } from 'react'
import { FormField } from '@/components/FormField'
import { AppLayout } from '@/layouts/AppLayout'

export default function RegistrationsNew() {
  const form = useForm({ email: '', password: '', password_confirmation: '' })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    form.transform((data) => ({ user: data }))
    form.post('/users')
  }

  return (
    <AppLayout>
      <Head title="Criar conta" />
      <form onSubmit={submit} className="mx-auto max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <FormField
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          value={form.data.email}
          error={form.errors.email}
          onChange={(event) => form.setData('email', event.target.value)}
        />
        <FormField
          label="Senha"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.data.password}
          error={form.errors.password}
          onChange={(event) => form.setData('password', event.target.value)}
        />
        <FormField
          label="Confirmar senha"
          name="password_confirmation"
          type="password"
          autoComplete="new-password"
          value={form.data.password_confirmation}
          error={form.errors.password_confirmation}
          onChange={(event) => form.setData('password_confirmation', event.target.value)}
        />
        <button
          type="submit"
          disabled={form.processing}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Criar conta
        </button>
        <p className="text-sm">
          Já tem conta?{' '}
          <Link href="/users/sign_in" className="underline">
            Entrar
          </Link>
        </p>
      </form>
    </AppLayout>
  )
}

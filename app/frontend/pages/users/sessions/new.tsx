import { Head, Link, useForm } from '@inertiajs/react'
import type { FormEvent } from 'react'
import { FormField } from '@/components/FormField'
import { AppLayout } from '@/layouts/AppLayout'

export default function SessionsNew() {
  const form = useForm({ email: '', password: '' })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    form.transform((data) => ({ user: data }))
    form.post('/users/sign_in')
  }

  return (
    <AppLayout>
      <Head title="Entrar" />
      <form onSubmit={submit} className="mx-auto max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <FormField
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          value={form.data.email}
          onChange={(event) => form.setData('email', event.target.value)}
        />
        <FormField
          label="Senha"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.data.password}
          onChange={(event) => form.setData('password', event.target.value)}
        />
        <button
          type="submit"
          disabled={form.processing}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Entrar
        </button>
        <p className="text-sm">
          Não tem conta?{' '}
          <Link href="/users/sign_up" className="underline">
            Criar conta
          </Link>
        </p>
      </form>
    </AppLayout>
  )
}

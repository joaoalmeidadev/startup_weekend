import { Head, useForm, usePage } from '@inertiajs/react'
import type { FormEvent } from 'react'
import { FormField } from '@/components/FormField'
import { Icon } from '@/components/Icon'
import { JourneyPreview } from './JourneyPreview'

export default function SessionsNew() {
  const { flash } = usePage().props
  const form = useForm({ email: '', password: '' })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    form.transform((data) => ({ user: data }))
    form.post('/users/sign_in')
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-gutter py-space-xl">
      <Head title="Entrar" />
      <div className="w-full max-w-[33.75rem] space-y-space-lg">
        <div className="flex items-center gap-space-sm">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-headline-md text-on-primary">
            N
          </span>
          <span className="text-headline-md font-bold text-primary">Nivela</span>
        </div>

        <section className="space-y-space-lg rounded-2xl border-[1.5px] border-slate-200 bg-surface-container-lowest p-space-lg shadow-[0_2px_4px_rgba(15,23,42,0.05)]">
          <div className="space-y-space-xs">
            <h1 className="text-headline-lg text-on-surface">Que bom ver você!</h1>
            <p className="text-body-xl text-on-surface-variant">Entre para continuar sua jornada.</p>
          </div>

          {flash.alert && (
            <p
              role="alert"
              className="flex items-center gap-space-sm rounded-2xl bg-error-container p-space-md text-on-error-container"
            >
              <Icon name="error" />
              {flash.alert}
            </p>
          )}

          <form onSubmit={submit} className="space-y-space-lg">
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
              className="flex h-16 w-full items-center justify-center gap-space-sm rounded-2xl bg-primary-container text-headline-md text-on-primary shadow-[0_4px_0_#0A4349] transition hover:brightness-110 active:translate-y-0.5 active:shadow-[0_2px_0_#0A4349] disabled:opacity-60"
            >
              Entrar
              <Icon name="arrow_forward" />
            </button>
          </form>
        </section>

        <section className="space-y-space-md rounded-2xl bg-surface-container-low p-space-lg">
          <p className="text-center text-label-lg text-on-surface">Sua jornada até o selo Nivelado</p>
          <JourneyPreview />
        </section>

        <p className="text-center text-body-lg text-on-surface-variant">
          Esqueceu a senha? Fale com o RH da sua empresa.
        </p>
      </div>
    </main>
  )
}

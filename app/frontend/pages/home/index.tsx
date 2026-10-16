import { Head, usePage } from '@inertiajs/react'
import { AppLayout } from '@/layouts/AppLayout'

export default function HomeIndex() {
  const { current_user } = usePage().props

  return (
    <AppLayout>
      <Head title="Início" />
      <h1 className="text-3xl font-bold">{current_user ? `Olá, ${current_user.email}` : 'Bem-vindo'}</h1>
      <p className="text-gray-600">Rails + Inertia + React está funcionando.</p>
    </AppLayout>
  )
}

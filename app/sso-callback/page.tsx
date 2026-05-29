import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

// Página de redirección post-login: lee el rol del JWT y manda al lugar correcto.
export default async function SSOCallbackPage() {
  const { userId, sessionClaims } = await auth()

  if (!userId) redirect('/sign-in')

  const roles = ((sessionClaims as { roles?: string[] })?.roles) ?? []

  if (roles.includes('super_admin')) redirect('/admin')
  if (roles.includes('logistics')) redirect('/dashboard')

  // Usuario sin rol asignado
  redirect('/')
}

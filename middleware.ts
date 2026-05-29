import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sso-callback',
  '/api/webhooks/clerk',
  '/api/mock/(.*)',
  '/api/envios/(.*)',
])

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return

  // Require authentication for all non-public routes
  await auth.protect()

  // Role-based route protection
  const { sessionClaims } = await auth()
  const roles = ((sessionClaims as Record<string, unknown>)?.roles as string[]) ?? []

  if (isDashboardRoute(request) && !roles.includes('logistics')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isAdminRoute(request) && !roles.includes('super_admin')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}

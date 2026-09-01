import { NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'

const protectedRoutes = ['/', '/create', '/edit', '/admin']
const publicRoutes = ['/login', '/aanmelden']

export default async function proxy(req) {
  const path = req.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  )
  const isPublicRoute = publicRoutes.includes(path)

  const sessionCookie = req.cookies.get('session')?.value
  const session = await decrypt(sessionCookie)

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
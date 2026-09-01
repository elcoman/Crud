import 'server-only'

import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decrypt } from '@/app/lib/session'

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  return await decrypt(session)
}

export const verifySession = cache(async () => {
  const session = await getSession()

  if (!session?.userId) {
    redirect('/login')
  }

  return {
    userId: session.userId,
    role: session.role,
  }
})
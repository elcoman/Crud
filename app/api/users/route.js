import getDb from '@/app/lib/db'
import { usersTable } from '@/app/lib/schema'
import { getSession } from '@/app/lib/dal'

export async function GET() {
  const session = await getSession()

  if (!session?.userId) {
    return new Response(JSON.stringify({ error: 'Niet ingelogd' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (session.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Geen toegang' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const db = getDb()
  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
    })
    .from(usersTable)

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
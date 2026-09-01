import { eq } from 'drizzle-orm'
import getDb from '@/app/lib/db'
import { tasksTable } from '@/app/lib/schema'
import { getSession } from '@/app/lib/dal'

export async function GET(request) {
  const session = await getSession()

  if (!session?.userId) {
    return new Response(JSON.stringify({ error: 'Niet ingelogd' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { searchParams } = new URL(request.url)
  const filterUserId = searchParams.get('userId')
  const db = getDb()

  let tasks

if (filterUserId && session.role === 'admin') {
  tasks = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.userId, parseInt(filterUserId)))
} else {
  tasks = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.userId, session.userId))
}

  return new Response(JSON.stringify(tasks), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(request) {
  const session = await getSession()

  if (!session?.userId) {
    return new Response(JSON.stringify({ error: 'Niet ingelogd' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { title } = await request.json()
  const db = getDb()

  if (!title) {
    return new Response(JSON.stringify({ error: 'Titel is verplicht' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const [newTask] = await db
    .insert(tasksTable)
    .values({
      title,
      userId: session.userId,
    })
    .returning()

  return new Response(JSON.stringify(newTask), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
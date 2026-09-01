import { eq, and } from 'drizzle-orm'
import getDb from '@/app/lib/db'
import { tasksTable } from '@/app/lib/schema'
import { getSession } from '@/app/lib/dal'

async function getAuthorizedTask(id, session) {
  const taskId = parseInt(id)
  const db = getDb()

  if (session.role === 'admin') {
    const [task] = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, taskId))
    return task ?? null
  }

  const [task] = await db
    .select()
    .from(tasksTable)
    .where(
      and(
        eq(tasksTable.id, taskId),
        eq(tasksTable.userId, session.userId)
      )
    )

  return task ?? null
}

export async function GET(request, { params }) {
  const session = await getSession()

  if (!session?.userId) {
    return new Response(JSON.stringify({ error: 'Niet ingelogd' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { id } = await params
  const task = await getAuthorizedTask(id, session)

  if (!task) {
    return new Response(JSON.stringify({ error: 'Taak niet gevonden' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(task), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function PUT(request, { params }) {
  const session = await getSession()

  if (!session?.userId) {
    return new Response(JSON.stringify({ error: 'Niet ingelogd' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { id } = await params
  const task = await getAuthorizedTask(id, session)

  if (!task) {
    return new Response(JSON.stringify({ error: 'Taak niet gevonden' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { title } = await request.json()
  const db = getDb()

  const [updatedTask] = await db
    .update(tasksTable)
    .set({ title })
    .where(eq(tasksTable.id, task.id))
    .returning()

  return new Response(JSON.stringify(updatedTask), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function DELETE(request, { params }) {
  const session = await getSession()

  if (!session?.userId) {
    return new Response(JSON.stringify({ error: 'Niet ingelogd' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { id } = await params
  const task = await getAuthorizedTask(id, session)

  if (!task) {
    return new Response(JSON.stringify({ error: 'Taak niet gevonden' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const db = getDb()
  await db.delete(tasksTable).where(eq(tasksTable.id, task.id))

  return new Response(null, { status: 204 })
}
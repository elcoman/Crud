import { sql } from 'drizzle-orm'
import getDb from '@/app/lib/db'

export async function GET() {
  const checks = {
    databaseUrlSet: Boolean(process.env.DATABASE_URL),
    sessionSecretSet: Boolean(process.env.SESSION_SECRET),
    db: 'unknown',
  }

  if (!checks.databaseUrlSet) {
    return Response.json({ ...checks, db: 'fail', error: 'DATABASE_URL missing' }, { status: 500 })
  }

  try {
    const db = getDb()
    await db.execute(sql`SELECT 1`)
    checks.db = 'ok'
    return Response.json(checks)
  } catch (error) {
    return Response.json(
      {
        ...checks,
        db: 'fail',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

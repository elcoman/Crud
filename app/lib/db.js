import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

export default function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    maxUses: 1,
    ssl: false,
    connectionTimeoutMillis: 10000,
  })

  return drizzle({ client: pool })
}

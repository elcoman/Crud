import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { cache } from 'react'

export default cache(function getDb() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    maxUses: 1,
  })
  return drizzle({ client: pool })
})

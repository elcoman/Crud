import dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

dotenv.config({ path: '.env.local' })

export default defineConfig({
  out: './drizzle',
  schema: './app/lib/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 20 }).notNull().default('user'),
})

export const tasksTable = pgTable('tasks', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp().defaultNow().notNull(),
})
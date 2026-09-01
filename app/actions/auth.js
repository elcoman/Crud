'use server'

import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import getDb from '@/app/lib/db'
import { usersTable } from '@/app/lib/schema'
import { SignupFormSchema } from '@/app/lib/definitions'
import { createSession } from '@/app/lib/session'
import { LoginFormSchema } from '@/app/lib/definitions'
import { deleteSession } from '@/app/lib/session'

export async function signup(state, formData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)
  const db = getDb()

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))

  if (existingUser.length > 0) {
    return { message: 'Dit e-mailadres is al in gebruik.' }
  }

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    })
    .returning({ id: usersTable.id, role: usersTable.role })

  await createSession(user.id, user.role)
  redirect('/')
}

export async function login(state, formData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data
  const db = getDb()

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))

  if (!user) {
    return { message: 'Onjuiste email of wachtwoord.' }
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return { message: 'Onjuiste email of wachtwoord.' }
  }

  await createSession(user.id, user.role)
  redirect('/')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
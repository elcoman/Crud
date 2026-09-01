'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'

function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <form action={action}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" />
        {state?.errors?.email && <p>{state.errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
        {state?.errors?.password && <p>{state.errors.password}</p>}
      </div>

      {state?.message && <p>{state.message}</p>}

      <button type="submit" disabled={pending}>
        {pending ? 'Bezig...' : 'Inloggen'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div>
      <h1>Inloggen</h1>
      <LoginForm />
      <p>
        Nog geen account? <Link href="/aanmelden">Aanmelden</Link>
      </p>
    </div>
  )
}
'use client'

import { useActionState } from 'react'
import { signup } from '@/app/actions/auth'

function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
        {state?.errors?.name && <p>{state.errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" />
        {state?.errors?.email && <p>{state.errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
        {state?.errors?.password && <p>{state.errors.password.join(', ')}</p>}
      </div>

      {state?.message && <p>{state.message}</p>}

      <button type="submit" disabled={pending}>
        {pending ? 'Bezig...' : 'Sign Up'}
      </button>
    </form>
  )
}

export default function AanmeldenPage() {
  return (
    <div>
      <h1>Aanmelden</h1>
      <SignupForm />
    </div>
  )
}
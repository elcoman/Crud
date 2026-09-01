import Link from 'next/link'
import { getSession } from '@/app/lib/dal'
import { logout } from '@/app/actions/auth'

export default async function Nav() {
  const session = await getSession()

  if (!session?.userId) {
    return (
      <nav>
        <Link href="/login">Inloggen</Link> | <Link href="/aanmelden">Aanmelden</Link>
      </nav>
    )
  }

  return (
    <nav>
      <Link href="/">Home</Link> | <Link href="/create">Taak aanmaken</Link>
      {session.role === 'admin' && (
        <>
          {' '}
          | <Link href="/admin">Admin</Link>
        </>
      )}
      {' '}
      |{' '}
      <form action={logout} style={{ display: 'inline' }}>
        <button type="submit" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>
          Uitloggen
        </button>
      </form>
    </nav>
  )
}

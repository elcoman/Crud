'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) throw new Error('Geen admin toegang')
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err.message)
      }
    }

    loadUsers()
  }, [])

  useEffect(() => {
    async function loadTasks() {
      setLoading(true)
      try {
        const url = selectedUserId
          ? `/api/tasks?userId=${selectedUserId}`
          : '/api/tasks'

        const response = await fetch(url, { cache: 'no-store' })
        if (!response.ok) throw new Error('Taken ophalen mislukt')
        const data = await response.json()
        setTasks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [selectedUserId])

  if (error) {
    return <p>Fout: {error}</p>
  }

  return (
    <div>
      <h1>Admin — Alle taken</h1>

      <label htmlFor="userFilter">Filter op gebruiker:</label>
      <select
        id="userFilter"
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        <option value="">Alle gebruikers</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      {loading ? (
        <p>Laden...</p>
      ) : (
        <ul>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task.id}>
                {task.title} — user #{task.userId}{' '}
                <Link href={`/edit/${task.id}`}>Aanpassen</Link>
              </li>
            ))
          ) : (
            <li>Geen taken gevonden</li>
          )}
        </ul>
      )}
    </div>
  )
}
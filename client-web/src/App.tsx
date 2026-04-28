import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Role = 'customer' | 'provider' | 'admin' | 'support'

type User = {
  id: string
  full_name: string
  email: string | null
  phone: string
  role: Role
  is_active: boolean
}

type Tokens = {
  access_token: string
  refresh_token: string
  expires_in: number
}

type ApiSuccess<T> = {
  data: T
  meta: Record<string, unknown>
}

type ApiError = {
  error: {
    code: string
    message: string
    details: unknown
  }
}

const defaultApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'

function App() {
  const [apiBaseUrl, setApiBaseUrl] = useState(defaultApiBaseUrl)
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access_token') || '')
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refresh_token') || '')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [adminUsers, setAdminUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [busyAction, setBusyAction] = useState('')
  const [lastResponse, setLastResponse] = useState<unknown>(null)
  const [message, setMessage] = useState('Ready')

  const [registerForm, setRegisterForm] = useState({
    full_name: 'Test Customer',
    email: 'customer@example.com',
    phone: '9000000001',
    password: 'StrongPass123'
  })
  const [loginForm, setLoginForm] = useState({
    phone: '9999999999',
    password: 'AdminPass123'
  })
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: ''
  })

  const tokenPreview = useMemo(() => {
    if (!accessToken) return 'No access token'
    return `${accessToken.slice(0, 24)}...${accessToken.slice(-12)}`
  }, [accessToken])

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken)
    } else {
      localStorage.removeItem('access_token')
    }

    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    } else {
      localStorage.removeItem('refresh_token')
    }
  }, [accessToken, refreshToken])

  async function callApi<T>(path: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers)
    headers.set('content-type', 'application/json')

    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`)
    }

    setBusyAction(path)
    setMessage(`Calling ${path}`)

    try {
      const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers
      })
      const payload = (await response.json()) as ApiSuccess<T> | ApiError
      setLastResponse(payload)

      if (!response.ok || 'error' in payload) {
        const errorPayload = payload as ApiError
        throw new Error(`${errorPayload.error.code}: ${errorPayload.error.message}`)
      }

      setMessage(`Success: ${path}`)
      return (payload as ApiSuccess<T>).data
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Request failed')
      throw error
    } finally {
      setBusyAction('')
    }
  }

  function storeAuth(data: { user: User; tokens: Tokens }) {
    setCurrentUser(data.user)
    setAccessToken(data.tokens.access_token)
    setRefreshToken(data.tokens.refresh_token)
    setProfileForm({
      full_name: data.user.full_name,
      email: data.user.email ?? ''
    })
  }

  async function register(event: FormEvent) {
    event.preventDefault()
    const data = await callApi<{ user: User; tokens: Tokens }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerForm)
    })
    storeAuth(data)
  }

  async function login(event: FormEvent) {
    event.preventDefault()
    const data = await callApi<{ user: User; tokens: Tokens }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginForm)
    })
    storeAuth(data)
  }

  async function loadAuthMe() {
    const data = await callApi<{ user: User }>('/auth/me')
    setCurrentUser(data.user)
    setProfileForm({
      full_name: data.user.full_name,
      email: data.user.email ?? ''
    })
  }

  async function loadUsersMe() {
    const data = await callApi<{ user: User }>('/users/me')
    setCurrentUser(data.user)
  }

  async function updateProfile(event: FormEvent) {
    event.preventDefault()
    const data = await callApi<{ user: User }>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify({
        full_name: profileForm.full_name,
        email: profileForm.email || null
      })
    })
    setCurrentUser(data.user)
  }

  async function refreshSession() {
    const data = await callApi<{ user: User; tokens: Tokens }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken })
    })
    storeAuth(data)
  }

  async function logout() {
    await callApi<{ revoked: boolean }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken })
    })
    setAccessToken('')
    setRefreshToken('')
    setCurrentUser(null)
    setAdminUsers([])
  }

  async function loadAdminUsers() {
    const data = await callApi<{ users: User[] }>('/admin/users')
    setAdminUsers(data.users)
    setSelectedUserId(data.users[0]?.id ?? '')
  }

  async function updateSelectedUserStatus(isActive: boolean) {
    if (!selectedUserId) return

    const data = await callApi<{ user: User }>(`/admin/users/${selectedUserId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive })
    })
    setAdminUsers((users) => users.map((user) => (user.id === data.user.id ? data.user : user)))
  }

  async function checkHealth() {
    await callApi<{ status: string; service: string }>('/health')
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">CleaningApp Phase 2</p>
          <h1>Auth Flow Checker</h1>
        </div>
        <div className="status-pill">{message}</div>
      </header>

      <section className="toolbar">
        <label>
          API Base URL
          <input value={apiBaseUrl} onChange={(event) => setApiBaseUrl(event.target.value)} />
        </label>
        <button type="button" onClick={checkHealth} disabled={busyAction === '/health'}>
          Health
        </button>
      </section>

      <section className="grid">
        <form className="panel" onSubmit={register}>
          <h2>Register Customer</h2>
          <label>
            Full name
            <input
              value={registerForm.full_name}
              onChange={(event) => setRegisterForm({ ...registerForm, full_name: event.target.value })}
            />
          </label>
          <label>
            Email
            <input
              value={registerForm.email}
              onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
            />
          </label>
          <label>
            Phone
            <input
              value={registerForm.phone}
              onChange={(event) => setRegisterForm({ ...registerForm, phone: event.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={registerForm.password}
              onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
            />
          </label>
          <button type="submit">Register</button>
        </form>

        <form className="panel" onSubmit={login}>
          <h2>Login</h2>
          <label>
            Phone
            <input value={loginForm.phone} onChange={(event) => setLoginForm({ ...loginForm, phone: event.target.value })} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
            />
          </label>
          <button type="submit">Login</button>
          <p className="hint">Default admin seed: 9999999999 / AdminPass123</p>
        </form>

        <section className="panel">
          <h2>Session</h2>
          <dl className="facts">
            <div>
              <dt>Access</dt>
              <dd>{tokenPreview}</dd>
            </div>
            <div>
              <dt>Refresh</dt>
              <dd>{refreshToken ? `${refreshToken.slice(0, 18)}...` : 'No refresh token'}</dd>
            </div>
          </dl>
          <div className="button-row">
            <button type="button" onClick={loadAuthMe} disabled={!accessToken}>
              Auth Me
            </button>
            <button type="button" onClick={loadUsersMe} disabled={!accessToken}>
              Users Me
            </button>
            <button type="button" onClick={refreshSession} disabled={!refreshToken}>
              Refresh
            </button>
            <button type="button" onClick={logout} disabled={!refreshToken}>
              Logout
            </button>
          </div>
        </section>

        <form className="panel" onSubmit={updateProfile}>
          <h2>Profile</h2>
          <label>
            Full name
            <input
              value={profileForm.full_name}
              onChange={(event) => setProfileForm({ ...profileForm, full_name: event.target.value })}
            />
          </label>
          <label>
            Email
            <input value={profileForm.email} onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })} />
          </label>
          <button type="submit" disabled={!accessToken}>
            Update Me
          </button>
        </form>
      </section>

      <section className="split">
        <section className="panel">
          <div className="panel-header">
            <h2>Current User</h2>
          </div>
          <JsonBlock data={currentUser ?? { status: 'No user loaded' }} />
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Admin Users</h2>
            <button type="button" onClick={loadAdminUsers} disabled={!accessToken}>
              Load Users
            </button>
          </div>
          <div className="admin-controls">
            <select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
              <option value="">Select user</option>
              {adminUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name} - {user.role} - {user.is_active ? 'active' : 'inactive'}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => updateSelectedUserStatus(true)} disabled={!selectedUserId}>
              Activate
            </button>
            <button type="button" onClick={() => updateSelectedUserStatus(false)} disabled={!selectedUserId}>
              Deactivate
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.full_name}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>{user.is_active ? 'active' : 'inactive'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <section className="panel response-panel">
        <h2>Last API Response</h2>
        <JsonBlock data={lastResponse ?? { status: 'No request yet' }} />
      </section>
    </main>
  )
}

function JsonBlock({ data }: { data: unknown }) {
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default App

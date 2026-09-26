import type {
  AttendanceResponse,
  LoginResponse,
} from '../types/attendance'

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json()

    return data.error || 'An unexpected error occurred.'
  } catch {
    return 'An unexpected error occurred.'
  }
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch('/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: username,
      password,
    }),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return response.json()
}

export async function logout(): Promise<AttendanceResponse> {
  const response = await fetch('/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return response.json()
}

export async function getEntries(): Promise<AttendanceResponse> {
  const response = await fetch('/data', {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return response.json()
}

export async function submitTime(
  date: string,
  time: string,
  clockIn: boolean,
): Promise<AttendanceResponse> {
  const response = await fetch('/submit', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date,
      time,
      clockIn,
    }),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return response.json()
}

export async function editEntry(
  id: string,
  date: string,
  time: string,
  clockIn: boolean,
): Promise<AttendanceResponse> {
  const response = await fetch('/edit', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      date,
      time,
      clockIn,
    }),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return response.json()
}

export async function deleteEntry(
  id: string,
): Promise<AttendanceResponse> {
  const response = await fetch(`/data/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return response.json()
}

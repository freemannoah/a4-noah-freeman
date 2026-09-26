export interface AttendanceEntry {
  _id: string
  user: string
  date: string
  day: string
  time: string
  clockIn: boolean
}

export interface LoginResponse {
  success: boolean
  user: string
  entries: AttendanceEntry[]
}

export interface AttendanceResponse {
  success: boolean
  user: string | null
  entries: AttendanceEntry[]
}

export interface ApiError {
  error: string
}

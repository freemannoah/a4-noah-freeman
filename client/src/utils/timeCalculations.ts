import type { AttendanceEntry } from '../types/attendance'


export function parseEntryDecimalTime(entry: AttendanceEntry,): number | null {
    const timeString = entry.time.trim()

    const timeMatch = timeString.match(
        /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
    )

    if (!timeMatch) {return null}

    let hour = parseInt(timeMatch[1], 10)
    const minute = parseInt(timeMatch[2], 10)
    const period = timeMatch[3].toUpperCase()

    // Validate the parsed values.
    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {return null}

    if (period === 'PM' && hour !== 12) {hour += 12}

    if (period === 'AM' && hour === 12) {hour = 0}

    const decimalHour = hour + minute / 60

    // Round to the nearest tenth of an hour.
    return Math.round(decimalHour * 10) / 10
}


export function parseEntryDateTime(entry: AttendanceEntry,): Date | null {
    const dateParts = entry.date.split('/')

    if (dateParts.length !== 3) {return null}

    const month = parseInt(dateParts[0], 10)
    const day = parseInt(dateParts[1], 10)
    const year = parseInt(dateParts[2], 10)

    if (!Number.isInteger(month) || !Number.isInteger(day) || !Number.isInteger(year)) {return null}

    const timeString = entry.time.trim()

    const timeMatch = timeString.match(
        /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
    )

    if (!timeMatch) {return null}

    let hour = parseInt(timeMatch[1], 10)
    const minute = parseInt(timeMatch[2], 10)
    const period = timeMatch[3].toUpperCase()

    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {return null}

    if (period === 'PM' && hour !== 12) {hour += 12}

    if (period === 'AM' && hour === 12) {hour = 0}

    const date = new Date(year, month - 1, day, hour, minute)

    // JavaScript Date normalizes invalid dates. For example,
    // February 31 becomes a date in March. Verify that the
    // resulting date still matches the original input.
    if (date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day ||
        date.getHours() !== hour ||
        date.getMinutes() !== minute
    ) {
        return null
    }

    return date
}


export function groupEntriesByUser(
    entries: AttendanceEntry[],
): Record<string, AttendanceEntry[]> {
    const users: Record<string, AttendanceEntry[]> = {}

    entries.forEach((entry) => {
        if (!users[entry.user]) {
            users[entry.user] = []
        }

        users[entry.user].push(entry)

    })

    return users
}


export function sortEntries(entries: AttendanceEntry[]): AttendanceEntry[] {
    return [...entries].sort((a, b) => {
        const dateA = parseEntryDateTime(a)
        const dateB = parseEntryDateTime(b)

        if (dateA === null) {return 1}

        if (dateB === null) {return -1}

        return dateA.getTime() - dateB.getTime()
    })
}


export function calculateTotalHours(entries: AttendanceEntry[]): number {
    const users = groupEntriesByUser(entries)

    let totalHours = 0

    Object.values(users).forEach((userEntries) => {
        const sortedEntries = sortEntries(userEntries)

        let clockInTime: number | null = null

        sortedEntries.forEach((entry) => {
            const entryTime = parseEntryDecimalTime(entry)

            if (entryTime === null) {return}

            if (entry.clockIn) {
                clockInTime = entryTime
            } else if (clockInTime !== null) {
                const difference = entryTime - clockInTime

                if (difference >= 0) {totalHours += difference}

                clockInTime = null
            }
        })

    })

    return Math.round(totalHours * 10) / 10
}


export function calculateWeeklyHours(entries: AttendanceEntry[]): number {
    const users = groupEntriesByUser(entries)

    const now = new Date()

    const startOfWeek = new Date(now)
    startOfWeek.setHours(0, 0, 0, 0)


    startOfWeek.setDate(now.getDate() - now.getDay())

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)

    let weeklyHours = 0

    Object.values(users).forEach((userEntries) => {
        const sortedEntries = sortEntries(userEntries)

        let clockInTime: {date: Date, decimalTime: number} | null = null

        sortedEntries.forEach((entry) => {
            const entryDate = parseEntryDateTime(entry)
            const entryDecimalTime = parseEntryDecimalTime(entry)

            if (entryDate === null || entryDecimalTime === null) {return}

            if (entry.clockIn) {
                clockInTime = {date: entryDate, decimalTime: entryDecimalTime}
            } else if (clockInTime !== null) {
                const clockOutDate = entryDate
                const clockOutDecimalTime = entryDecimalTime

                if (
                    clockInTime.date >= startOfWeek &&
                    clockOutDate < endOfWeek
                ) {
                    const difference = clockOutDecimalTime - clockInTime.decimalTime

                    if (difference >= 0) {weeklyHours += difference}
                }

                clockInTime = null
            }
        })


    })

    return Math.round(weeklyHours * 10) / 10
}


export function formatHours(hours: number): string {
    return `${ hours.toFixed(1) } hours`
}
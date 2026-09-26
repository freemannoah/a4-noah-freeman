import { useEffect, useState } from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import LoginCard from './components/LoginCard'
import TimeSummary from './components/TimeSummary'
import TimeEntryForm from './components/TimeEntryForm'
import AttendanceTable from './components/AttendanceTable'
import { login, logout, getEntries, submitTime, editEntry, deleteEntry } from './api/attendanceApi'
import type { AttendanceEntry } from './types/attendance'

export default function App() {
    const [currentUser, setCurrentUser] = useState<string | null>(null)

    const [entries, setEntries] = useState<AttendanceEntry[]>([])

    const [editingEntry, setEditingEntry] = useState<AttendanceEntry | null>(null)

    const [loginStatus, setLoginStatus] = useState('No user logged in')

    const [timeStatus, setTimeStatus] = useState('')

    const [tableStatus, setTableStatus] = useState('')

    useEffect(() => {
        const loadSession = async () => {
            try {
                const data = await getEntries()

                setCurrentUser(data.user)
                setEntries(data.entries)

                if (data.user) {setLoginStatus(`Logged in as ${data.user}`)}

            } catch (error) {
                console.error('Unable to load session:', error)
            }
        }

        loadSession()
    }, [])


    const handleLogin = async (username: string, password: string) => {
        try {
            setLoginStatus('Logging in...')
            setTimeStatus('')
            setTableStatus('')
            setEditingEntry(null)

            const data = await login(username, password)

            setCurrentUser(data.user)
            setEntries(data.entries)

            setLoginStatus(`Logged in as ${data.user}`)

            setTimeStatus('')
        } catch (error) {
            console.error('Login error:', error)

            setLoginStatus(error instanceof Error ? error.message : 'Unable to log in.')

            throw error
        }
    }

    const handleLogout = async () => {
        try {
            setLoginStatus('Logging out...')

            const data = await logout()

            setCurrentUser(null)
            setEntries(data.entries)
            setEditingEntry(null)

            setLoginStatus('No user logged in')

            setTimeStatus('')
            setTableStatus('')
        } catch (error) {
            console.error('Logout error:', error)

            setLoginStatus(error instanceof Error ? error.message : 'Unable to log out.')

            throw error
        }
    }


    const handleSubmitTime = async (date: string, time: string, clockIn: boolean) => {
        if (!currentUser) {
            setTimeStatus('Please log in before entering time.')
            return
        }

        try {
            setTimeStatus('Saving...')
            setTableStatus('')

            const data = await submitTime(date, time, clockIn)

            setEntries(data.entries)

            setTimeStatus(`${clockIn ? 'Clock in' : 'Clock out'} recorded for ${currentUser}.`)
        } catch (error) {
            console.error('Time submission error:', error)

            setTimeStatus(error instanceof Error ? error.message : 'Unable to submit time.')

            throw error
        }
    }


    const handleEdit = (entry: AttendanceEntry) => {
        setEditingEntry(entry)
        setTimeStatus(`Editing ${entry.date} ${entry.time} (${entry.clockIn ? 'Clock In' : 'Clock Out'})`)
    }

    const handleConfirmEdit = async (id: string, date: string, time: string, clockIn: boolean) => {
        if (!currentUser) {
            setTimeStatus('Please log in before editing an entry.')
            return
        }

        try {
            setTimeStatus('Saving...')
            setTableStatus('')

            const data = await editEntry(id, date, time, clockIn)

            setEntries(data.entries)
            setEditingEntry(null)

            setTimeStatus('Entry updated successfully.')
        } catch (error) {
            console.error('Edit error:', error)

            setTimeStatus(error instanceof Error ? error.message : 'Unable to edit entry.')

            throw error
        }
    }

    const handleCancelEdit = () => {
        setEditingEntry(null)
        setTimeStatus('')
    }


    const handleDelete = async (entry: AttendanceEntry) => {
        if (!currentUser) {
            setTableStatus('Please log in before deleting an entry.')
            return
        }

        const confirmed = window.confirm('Are you sure you want to delete this attendance entry?')

        if (!confirmed) { return }

        try {
            setTableStatus('Deleting...')

            if (editingEntry?._id === entry._id) { setEditingEntry(null) }

            const data = await deleteEntry(entry._id)

            setEntries(data.entries)

            setTableStatus('Entry deleted successfully.')

            setTimeStatus('')
        } catch (error) {
            console.error('Delete error:', error)

            setTableStatus(error instanceof Error ? error.message : 'Unable to delete entry.')
        }
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box component="header" sx={{ mb: 3 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
                    ATAssist
                </Typography>

                <Typography variant="subtitle1" color="text.secondary">
                    Automated Time & Attendance helper
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <LoginCard
                        currentUser={currentUser}
                        loginStatus={loginStatus}
                        onLogin={handleLogin}
                        onLogout={handleLogout}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <TimeSummary
                        currentUser={currentUser}
                        entries={entries}
                    />
                </Grid>
            </Grid>

            <Box sx={{ mb: 3 }}>
                <TimeEntryForm
                    currentUser={currentUser}
                    editingEntry={editingEntry}
                    status={timeStatus}
                    onSubmitTime={handleSubmitTime}
                    onConfirmEdit={handleConfirmEdit}
                    onCancelEdit={handleCancelEdit}
                />
            </Box>

            <AttendanceTable
                entries={entries}
                isLoggedIn={currentUser !== null}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {tableStatus && (
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {tableStatus}
                </Typography>
            )}
        </Container>
    )
}
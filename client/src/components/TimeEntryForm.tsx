import { AccessTime, Cancel, Check, Login, Logout } from '@mui/icons-material'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import type { AttendanceEntry } from '../types/attendance'

interface TimeEntryFormProps {
    currentUser: string | null
    editingEntry: AttendanceEntry | null
    status: string
    onSubmitTime: (
        date: string,
        time: string,
        clockIn: boolean,
    ) => Promise<void>
    onConfirmEdit: (
        id: string,
        date: string,
        time: string,
        clockIn: boolean,
    ) => Promise<void>
    onCancelEdit: () => void
}

export default function TimeEntryForm({ currentUser, editingEntry, status, onSubmitTime, onConfirmEdit, onCancelEdit }: TimeEntryFormProps) {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [loading, setLoading] = useState(false)

    const isEditing = editingEntry !== null

    useEffect(() => {
        if (editingEntry) {
            setDate(editingEntry.date)
            setTime(editingEntry.time)
        } else {
            setDate('')
            setTime('')
        }
    }, [editingEntry])

    const handleTimeSubmit = async (
        clockIn: boolean,
    ) => {
        if (!currentUser) { return }

        if (!date.trim() || !time.trim()) { return }

        try {
            setLoading(true)

            await onSubmitTime(
                date.trim(),
                time.trim(),
                clockIn,
            )

            setDate('')
            setTime('')
        } finally {
            setLoading(false)
        }

    }

    const handleConfirmEdit = async () => {
        if (!editingEntry) { return }

        if (!date.trim() || !time.trim()) { return }

        try {
            setLoading(true)

            await onConfirmEdit(
                editingEntry._id,
                date.trim(),
                time.trim(),
                editingEntry.clockIn,
            )

            setDate('')
            setTime('')
        } finally {
            setLoading(false)
        }


    }

    const handleCancelEdit = () => {
        setDate('')
        setTime('')
        onCancelEdit()
    }

    return (
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                Time Entry
            </Typography>

            {isEditing && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Editing {editingEntry.date}{' '}
                    {editingEntry.time} (
                    {editingEntry.clockIn
                        ? 'Clock In'
                        : 'Clock Out'}
                    )
                </Alert>
            )}

            <Box>
                <Stack spacing={2}>
                    <TextField
                        label="Date"
                        placeholder="mm/dd/yyyy"
                        value={date}
                        onChange={(event) =>
                            setDate(event.target.value)
                        }
                        fullWidth
                        required
                        disabled={!currentUser || loading}
                        helperText="Format: mm/dd/yyyy"
                    />

                    <TextField
                        label="Time"
                        placeholder="hh:mm AM/PM"
                        value={time}
                        onChange={(event) =>
                            setTime(event.target.value)
                        }
                        fullWidth
                        required
                        disabled={!currentUser || loading}
                        helperText="Format: hh:mm AM/PM"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <AccessTime sx={{ mr: 1 }} />
                                ),
                            },
                        }}
                    />

                    {!isEditing ? (
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<Login />}
                                onClick={() =>
                                    handleTimeSubmit(true)
                                }
                                disabled={
                                    !currentUser ||
                                    loading ||
                                    !date.trim() ||
                                    !time.trim()
                                }
                            >
                                Clock In
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<Logout />}
                                onClick={() =>
                                    handleTimeSubmit(false)
                                }
                                disabled={
                                    !currentUser ||
                                    loading ||
                                    !date.trim() ||
                                    !time.trim()
                                }
                            >
                                Clock Out
                            </Button>
                        </Stack>
                    ) : (
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                startIcon={<Check />}
                                onClick={handleConfirmEdit}
                                disabled={
                                    loading ||
                                    !date.trim() ||
                                    !time.trim()
                                }
                            >
                                Confirm Edit
                            </Button>

                            <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancelEdit} disabled={loading}>
                                Cancel
                            </Button>
                        </Stack>
                    )}

                    {status && (
                        <Alert severity="info">
                            {status}
                        </Alert>
                    )}
                </Stack>
            </Box>
        </Paper>

    )
}
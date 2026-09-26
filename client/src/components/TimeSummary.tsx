import { AccessTime, Assignment, Person, Timer } from '@mui/icons-material'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { calculateTotalHours, calculateWeeklyHours, formatHours } from '../utils/timeCalculations'
import type { AttendanceEntry } from '../types/attendance'
import type { ReactNode } from 'react'


interface TimeSummaryProps {
    currentUser: string | null
    entries: AttendanceEntry[]
}

interface SummaryItemProps {
    icon: ReactNode
    label: string
    value: string
}

function SummaryItem({ icon, label, value }: SummaryItemProps) {
    return (
        <Box sx={{ flex: 1, minWidth: 180, p: 2, borderRadius: 2, backgroundColor: 'action.hover' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }} >
                {icon}

                <Typography variant="subtitle2" color="text.secondary">
                    {label}
                </Typography>
            </Stack>

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {value}
            </Typography>
        </Box>


    )
}

export default function TimeSummary({ currentUser, entries }: TimeSummaryProps) {
    const weeklyHours = calculateWeeklyHours(entries)

    const totalHours = calculateTotalHours(entries)

    return (
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                Time Summary
            </Typography>

            <Stack direction="row" spacing={2} useFlexGap sx={{display: 'flex'}}>
                <SummaryItem
                    icon={<Person color="primary" />}
                    label="Current User"
                    value={currentUser ?? 'Logged Out'}
                />

                <SummaryItem
                    icon={<AccessTime color="primary" />}
                    label="Time Clocked In This Week"
                    value={formatHours(weeklyHours)}
                />

                <SummaryItem
                    icon={<Timer color="primary" />}
                    label="Total Time Clocked In"
                    value={formatHours(totalHours)}
                />

                <SummaryItem
                    icon={<Assignment color="primary" />}
                    label="Number of Entries"
                    value={entries.length.toString()}
                />
            </Stack>
        </Paper>

    )
}
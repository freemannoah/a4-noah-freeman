import { Delete, Edit } from '@mui/icons-material'
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import type { AttendanceEntry } from '../types/attendance'

interface AttendanceTableProps {
    entries: AttendanceEntry[]
    isLoggedIn: boolean
    onEdit: (entry: AttendanceEntry) => void
    onDelete: (entry: AttendanceEntry) => void
}

export default function AttendanceTable({ entries, isLoggedIn, onEdit, onDelete }: AttendanceTableProps) {
    return (
        <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                Attendance Records
            </Typography>

            {entries.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 3 }}>
                    No attendance records found.
                </Typography>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Day</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Action</TableCell>

                                {isLoggedIn && (
                                    <>
                                        <TableCell align="center">
                                            Edit
                                        </TableCell>
                                        <TableCell align="center">
                                            Delete
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {entries.map((entry) => (
                                <TableRow
                                    key={entry._id}
                                    hover
                                >
                                    <TableCell>
                                        {entry.user}
                                    </TableCell>

                                    <TableCell>
                                        {entry.date}
                                    </TableCell>

                                    <TableCell>
                                        {entry.day}
                                    </TableCell>

                                    <TableCell>
                                        {entry.time}
                                    </TableCell>

                                    <TableCell>
                                        {entry.clockIn
                                            ? 'Clock In'
                                            : 'Clock Out'}
                                    </TableCell>

                                    {isLoggedIn && (
                                        <>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="primary"
                                                    aria-label={`Edit entry from ${entry.date} ${entry.time}`}
                                                    onClick={() => onEdit(entry)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </TableCell>

                                            <TableCell align="center">
                                                <IconButton
                                                    color="error"
                                                    aria-label={`Delete entry from ${entry.date} ${entry.time}`}
                                                    onClick={() => onDelete(entry)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>

    )
}
import { Lock, Logout, Person } from '@mui/icons-material'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

interface LoginCardProps {
    currentUser: string | null
    loginStatus: string
    onLogin: (
        username: string,
        password: string,
    ) => Promise<void>
    onLogout: () => Promise<void>
}

export default function LoginCard({currentUser, loginStatus, onLogin, onLogout}: LoginCardProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault()

        if (!username.trim() || !password) {
            return
        }

        try {
            setLoading(true)

            await onLogin(
                username.trim(),
                password,
            )

            setPassword('')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true)
            await onLogout()

            setUsername('')
            setPassword('')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                height: '100%',
            }}
        >
            <Typography
                variant="h5"
                component="h2"
                sx={{ mb: 2 }}
            >
                User Login
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                <Stack spacing={2}>
                    <TextField
                        label="Username"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        autoComplete="username"
                        fullWidth
                        required
                        slotProps={{
                            input: {
                                startAdornment: <Person sx={{ mr: 1 }} />,
                            },
                        }}
                    />

                    <TextField
                        label="Password"
                        placeholder="Enter Password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        autoComplete="current-password"
                        fullWidth
                        required
                        slotProps={{
                            input: {
                                startAdornment: <Lock sx={{ mr: 1 }} />,
                            },
                        }}
                    />

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                loading ||
                                !username.trim() ||
                                !password
                            }
                        >
                            Login
                        </Button>

                        <Button
                            type="button"
                            variant="outlined"
                            color="secondary"
                            startIcon={<Logout />}
                            onClick={handleLogout}
                            disabled={loading || !currentUser}
                        >
                            Logout
                        </Button>
                    </Stack>

                    {loginStatus && (
                        <Alert
                            severity={
                                currentUser
                                    ? 'success'
                                    : 'info'
                            }
                        >
                            {loginStatus}
                        </Alert>
                    )}
                </Stack>
            </Box>
        </Paper>

    )
}
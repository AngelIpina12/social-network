import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useForm } from '../../hooks/useForm'
import { useLazyFetchUserProfileQuery, useLoginUserMutation } from '../../store';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    CircularProgress,
} from '@mui/material';

export const Login = () => {
    const { form, changed } = useForm({});
    const auth = useSelector((state) => state.authData);
    const [loginUser, { isLoading, error }] = useLoginUserMutation();
    const [fetchUserProfile] = useLazyFetchUserProfileQuery();
    const navigate = useNavigate();

    // Iniciar sesión
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loginResponse = await loginUser({ userLogged: form }).unwrap();
            const userId = loginResponse.user.id;
            await fetchUserProfile({ userId }).unwrap();
            navigate('/social/feed');
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>

                {auth.user && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        User logged successfully!
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        An error has occurred. Try again.
                    </Alert>
                )}

                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        variant="outlined"
                        onChange={changed}
                        sx={{ mb: 2 }}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        variant="outlined"
                        onChange={changed}
                        sx={{ mb: 2 }}
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Log in'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

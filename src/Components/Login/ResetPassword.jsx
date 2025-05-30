import React, { useState } from 'react';
import axios from "axios";
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    TextField,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const userId = localStorage.getItem('userId');
const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_RESET_PASSWORD_URL = `${api_url}/users/${userId}`;

function ResetPasswordScreen() {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState(null); // For displaying errors directly related to the form fields or process
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null); // Clear previous form errors

        if (!password.trim() || !confirmPassword.trim()) {
            setSnackbar({ open: true, message: 'Por favor, preencha ambos os campos de senha.', severity: 'error' });
            return;
        }

        if (password !== confirmPassword) {
            setSnackbar({ open: true, message: 'As senhas não coincidem. Tente novamente.', severity: 'error' });
            setConfirmPassword(''); // Clear confirm password field
            return;
        }

        setIsLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            if (!userId || !token) {
                setSnackbar({ open: true, message: 'Erro de autenticação. Por favor, faça login novamente.', severity: 'error' });
                setIsLoading(false);
                navigate('/Login');
                return;
            }

            await axios.put(API_RESET_PASSWORD_URL,
                { password: password },
                {
                    headers: {
                        'userId': userId,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSnackbar({ open: true, message: 'Senha atualizada com sucesso! Você será redirecionado.', severity: 'success' });

            // Clear sensitive fields after successful submission
            setPassword('');
            setConfirmPassword('');

            setTimeout(() => {
                navigate('/Dashboard'); // Redirect to the home page
            }, 2500); // Delay for user to read the success message

        } catch (err) {
            console.error("Failed to reset password:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Não foi possível atualizar a senha. Tente novamente.';
            // Display error in snackbar for immediate feedback
            setSnackbar({ open: true, message: `Erro: ${errorMessage}`, severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
            <Paper elevation={3} sx={{ padding: { xs: 2, sm: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    Alterar Senha
                </Typography>

                {/* Display general form error if any (e.g., if snackbar is not sufficient) */}
                {formError && !isLoading && (
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }} onClose={() => setFormError(null)}>
                        {formError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Nova Senha"
                        type="password"
                        id="password"
                        autoComplete="new-password" // Important for password managers
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        autoFocus // Focus on the first field
                        error={!!(formError && formError.toLowerCase().includes("senha"))} // Example of field-specific error indication
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirmar Nova Senha"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        error={!!(formError && formError.toLowerCase().includes("senha"))}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2, py: 1.5 }} // Added some padding for better look
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Nova Senha'}
                    </Button>
                </Box>
            </Paper>

            {/* Snackbar for feedback messages */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default ResetPasswordScreen;
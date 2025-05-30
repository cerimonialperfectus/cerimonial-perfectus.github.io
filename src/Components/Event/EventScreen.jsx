import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    CircularProgress,
    Alert,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000"
const API_BASE_URL = `${api_url}/events`;

const formatDateTimeForInput = (date) => {
    if (!date) return '';
    try {
        const d = new Date(date);
        const timezoneOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = new Date(d.getTime() - timezoneOffset).toISOString().slice(0, 16);
        return localISOTime;
    } catch (error) {
        console.error("Error formatting date for input:", date, error);
        return '';
    }
};

const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        console.error("Error formatting date for display:", dateString, error);
        return 'Invalid Date';
    }
};

const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'confirmado': return 'success';
        case 'pendente': return 'warning';
        case 'cancelado': return 'error';
        default: return 'default';
    }
};

const initialEventState = {
    id: null,
    name: '',
    start_date: '',
    end_date: '',
    local: '',
    status: 'Pendente',
};

function EventScreen() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(initialEventState);
    const [isSaving, setIsSaving] = useState(false);

    const fetchEvents = useCallback(async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: {
                    'userId': localStorage.getItem('userId'),
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setEvents(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Failed to load events:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Could not fetch events.';
            setError(errorMessage);
            setEvents([]);
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setCurrentEvent(initialEventState);
        setIsModalOpen(true);
        setError(null);
    };

    const handleOpenEditModal = (eventToEdit) => {
        setIsEditing(true);
        setCurrentEvent({
            ...eventToEdit,
            start_date: formatDateTimeForInput(eventToEdit.start_date),
            end_date: formatDateTimeForInput(eventToEdit.end_date),
        });
        setIsModalOpen(true);
        setError(null);
    };

    const handleModalClose = () => {
        if (isSaving) return;
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleModalSave = async () => {
        setIsSaving(true);
        setError(null);

        if (!currentEvent.name?.trim()) {
            setSnackbar({ open: true, message: 'Erro: Nome do evento é obrigatório.', severity: 'error' });
            setIsSaving(false);
            return;
        }

        let eventDataToSend = {
            ...currentEvent,
            start_date: currentEvent.start_date ? new Date(currentEvent.start_date).toISOString() : null,
            end_date: currentEvent.end_date ? new Date(currentEvent.end_date).toISOString() : null,
        };

        if (!isEditing) {
            const { ...rest } = eventDataToSend; // Destructure to remove id
            eventDataToSend = rest;
        }

        try {
            if (isEditing) {
                await axios.put(`${API_BASE_URL}/${currentEvent.id}`, eventDataToSend, {
                    headers: {
                        'userId': localStorage.getItem('userId'),
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSnackbar({ open: true, message: 'Evento atualizado com sucesso!', severity: 'success' });
            } else {
                await axios.post(API_BASE_URL, eventDataToSend, {
                    headers: {
                        'userId': localStorage.getItem('userId'),
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSnackbar({ open: true, message: 'Evento criado com sucesso!', severity: 'success' });
            }
            handleModalClose();
            await fetchEvents(false);
        } catch (err) {
            console.error("Failed to save event:", err);
            const errorMessage = err.response?.data?.message || `Could not ${isEditing ? 'update' : 'create'} event.`;
            setSnackbar({ open: true, message: `Erro: ${errorMessage}`, severity: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteEvent = async (id) => {
        const eventToDelete = events.find(event => event.id === id);
        const eventName = eventToDelete ? eventToDelete.name : `ID ${id}`;

        if (window.confirm(`Tem certeza que deseja deletar o evento "${eventName}"? Esta ação não pode ser desfeita.`)) {
            try {
                await axios.delete(`${API_BASE_URL}/${id}`, {
                    headers: {
                        'userId': localStorage.getItem('userId'),
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSnackbar({ open: true, message: 'Evento deletado com sucesso!', severity: 'success' });
                setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
            } catch (err) {
                console.error(`Failed to delete event ${id}:`, err);
                const errorMessage = err.response?.data?.message || 'Could not delete event.';
                setError(errorMessage);
                setSnackbar({ open: true, message: `Erro ao deletar: ${errorMessage}`, severity: 'error' });
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Eventos
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateModal}
                    disabled={isLoading}
                >
                    Novo Evento
                </Button>
            </Box>

            {/* Loading State */}
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Event Table - Only show if not loading */}
            {!isLoading && (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 650 }}>
                        <Table stickyHeader aria-label="sticky event table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Início</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Fim</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Local</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Aões</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Show message only if not loading AND no events AND no error */}
                                {!error && events.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                            Nenhum evento encontrado. Crie um para começar!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    events.map((event) => (
                                        <TableRow
                                            hover
                                            key={event.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">{event.name}</TableCell>
                                            <TableCell>{formatDateForDisplay(event.start_date)}</TableCell>
                                            <TableCell>{formatDateForDisplay(event.end_date)}</TableCell>
                                            <TableCell>{event.local}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={event.status || 'Desconhecido'}
                                                    color={getStatusChipColor(event.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    aria-label={`editar evento ${event.name}`}
                                                    size="small"
                                                    onClick={() => handleOpenEditModal(event)}
                                                    sx={{ mr: 0.5 }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    aria-label={`deletar evento ${event.name}`}
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* --- Event Create/Edit Modal --- */}
            <Dialog open={isModalOpen} onClose={handleModalClose} aria-labelledby="event-dialog-title" maxWidth="sm" fullWidth>
                <DialogTitle id="event-dialog-title">
                    {isEditing ? 'Editar Evento' : 'Criar Novo Evento'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Nome do Evento"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentEvent.name}
                        onChange={handleInputChange}
                        required
                        disabled={isSaving}
                    />
                    <TextField
                        margin="dense"
                        id="start_date"
                        name="start_date"
                        label="Data e Hora de Início"
                        type="datetime-local"
                        fullWidth
                        variant="outlined"
                        value={currentEvent.start_date}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled={isSaving}
                    />
                    <TextField
                        margin="dense"
                        id="end_date"
                        name="end_date"
                        label="Data e Hora de Fim"
                        type="datetime-local"
                        fullWidth
                        variant="outlined"
                        value={currentEvent.end_date}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled={isSaving}
                    />
                    <TextField
                        margin="dense"
                        id="local"
                        name="local"
                        label="Local"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentEvent.local}
                        onChange={handleInputChange}
                        disabled={isSaving}
                    />
                    {/* Status Dropdown */}
                    <FormControl margin="dense" fullWidth variant="outlined" disabled={isSaving}>
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status"
                            name="status"
                            value={currentEvent.status}
                            onChange={handleInputChange}
                            label="Status"
                        >
                            {/* Define possible statuses */}
                            <MenuItem value="Pendente">Pendente</MenuItem>
                            <MenuItem value="Confirmado">Confirmado</MenuItem>
                            <MenuItem value="Cancelado">Cancelado</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}> {/* Add some padding to actions */}
                    <Button onClick={handleModalClose} color="secondary" disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleModalSave}
                        variant="contained"
                        color="primary"
                        disabled={isSaving}
                        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Evento')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for feedback */}
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

export default EventScreen;
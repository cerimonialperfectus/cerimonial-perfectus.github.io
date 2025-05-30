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
const API_BASE_URL = `${api_url}/suppliers`;

const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'ativo': return 'success';
        case 'inativo': return 'error';
        default: return 'default';
    }
};

const initialSupplierState = {
    id: null,
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    status: 'Ativo'
};

function SupplierScreen() {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(initialSupplierState);
    const [isSaving, setIsSaving] = useState(false); // Loading state for modal save button

    const fetchSuppliers = useCallback(async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_BASE_URL, {
                 headers: {
                     'userId': localStorage.getItem('userId'),
                     'Authorization': `Bearer ${localStorage.getItem('token')}`
                 }
            });
            setSuppliers(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Failed to load suppliers:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Could not fetch suppliers.';
            setError(errorMessage);
            setSuppliers([]);
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setCurrentSupplier(initialSupplierState);
        setIsModalOpen(true);
        setError(null);
    };

    const handleOpenEditModal = (supplierToEdit) => {
        setIsEditing(true);
        setCurrentSupplier(supplierToEdit);
        setIsModalOpen(true);
        setError(null);
    };

    const handleModalClose = () => {
        if (isSaving) return;
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentSupplier(prev => ({ ...prev, [name]: value }));
    };

    const validateSupplier = (supplierData) => {
        if (!supplierData.name?.trim()) return 'Nome do fornecedor é obrigatório.';
        if (!supplierData.cnpj?.trim()) return 'CNPJ é obrigatório.';
        if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(supplierData.cnpj) && !/^\d{14}$/.test(supplierData.cnpj)) {
            return 'Formato de CNPJ inválido. Use XX.XXX.XXX/XXXX-XX ou 14 dígitos.';
        }
        if (!supplierData.email?.trim()) return 'Email é obrigatório.';
        if (!/\S+@\S+\.\S+/.test(supplierData.email)) return 'Formato de email inválido.';
        if (!supplierData.status) return 'Status é obrigatório.';

        return null; // No errors
    };


    const handleModalSave = async () => {
        setIsSaving(true);
        setError(null);

        const validationError = validateSupplier(currentSupplier);
        if (validationError) {
            setSnackbar({ open: true, message: `Erro: ${validationError}`, severity: 'error' });
            setIsSaving(false);
            return;
        }

        const dataToSend = {
            name: currentSupplier.name.trim(),
            cnpj: currentSupplier.cnpj.replace(/[^\d]/g, ''),
            email: currentSupplier.email.trim(),
            phone: currentSupplier.phone?.trim() || null,
            address: currentSupplier.address?.trim() || null,
            status: currentSupplier.status,
        };

        try {
            const config = {
                headers: {
                    'userId': localStorage.getItem('userId'),
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };

            if (isEditing) {
                await axios.put(`${API_BASE_URL}/${currentSupplier.id}`, dataToSend, config);
                setSnackbar({ open: true, message: 'Fornecedor atualizado com sucesso!', severity: 'success' });
            } else {
                await axios.post(API_BASE_URL, dataToSend, config);
                setSnackbar({ open: true, message: 'Fornecedor criado com sucesso!', severity: 'success' });
            }
            handleModalClose();
            await fetchSuppliers(false);
        } catch (err) {
            console.error("Failed to save supplier:", err);
            const errorMessage = err.response?.data?.message || `Could not ${isEditing ? 'update' : 'create'} supplier.`;
            setSnackbar({ open: true, message: `Erro: ${errorMessage}`, severity: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSupplier = async (id) => {
        const supplierToDelete = suppliers.find(supplier => supplier.id === id);
        const supplierName = supplierToDelete ? supplierToDelete.name : `ID ${id}`;

        if (window.confirm(`Tem certeza que deseja deletar o fornecedor "${supplierName}"? Esta ação não pode ser desfeita.`)) {
            try {
                const config = {
                    headers: {
                        'userId': localStorage.getItem('userId'),
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                };
                await axios.delete(`${API_BASE_URL}/${id}`, config);
                setSnackbar({ open: true, message: 'Fornecedor deletado com sucesso!', severity: 'success' });
                setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier.id !== id));
            } catch (err) {
                console.error(`Failed to delete supplier ${id}:`, err);
                const errorMessage = err.response?.data?.message || 'Could not delete supplier.';
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
                    Fornecedores
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateModal}
                    disabled={isLoading}
                >
                    Novo Fornecedor
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

            {/* Supplier Table - Only show if not loading */}
            {!isLoading && (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 650 }}>
                        <Table stickyHeader aria-label="sticky supplier table">
                            <TableHead>
                                <TableRow>
                                    {/* Adjust Table Headers */}
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>CNPJ</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Endereço</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!error && suppliers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                            Nenhum fornecedor encontrado. Crie um para começar!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    suppliers.map((supplier) => (
                                        <TableRow
                                            hover
                                            key={supplier.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {/* Adjust Table Cells */}
                                            <TableCell component="th" scope="row">{supplier.name}</TableCell>
                                            <TableCell>{supplier.cnpj}</TableCell> {/* TODO: Format CNPJ if needed */}
                                            <TableCell>{supplier.email}</TableCell>
                                            <TableCell>{supplier.phone ? supplier.phone : '-'}</TableCell> {/* Display '-' if no phone */}
                                            <TableCell>{supplier.address ? supplier.address : '-'}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={supplier.status || 'Desconhecido'}
                                                    color={getStatusChipColor(supplier.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    aria-label={`editar fornecedor ${supplier.name}`}
                                                    size="small"
                                                    onClick={() => handleOpenEditModal(supplier)}
                                                    sx={{ mr: 0.5 }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    aria-label={`deletar fornecedor ${supplier.name}`}
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteSupplier(supplier.id)}
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

            {/* --- Supplier Create/Edit Modal --- */}
            <Dialog open={isModalOpen} onClose={handleModalClose} aria-labelledby="supplier-dialog-title" maxWidth="sm" fullWidth>
                <DialogTitle id="supplier-dialog-title">
                    {isEditing ? 'Editar Fornecedor' : 'Criar Novo Fornecedor'}
                </DialogTitle>
                <DialogContent>
                    {/* Required Fields */}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Nome do Fornecedor"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentSupplier.name}
                        onChange={handleInputChange}
                        required
                        disabled={isSaving}
                    />
                    <TextField
                        margin="dense"
                        id="cnpj"
                        name="cnpj"
                        label="CNPJ"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentSupplier.cnpj}
                        onChange={handleInputChange}
                        required
                        disabled={isSaving}
                        placeholder="XX.XXX.XXX/XXXX-XX"
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={currentSupplier.email}
                        onChange={handleInputChange}
                        required
                        disabled={isSaving}
                    />
                    <FormControl margin="dense" fullWidth variant="outlined" required disabled={isSaving}>
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status"
                            name="status"
                            value={currentSupplier.status}
                            onChange={handleInputChange}
                            label="Status"
                        >
                            {/* Define possible statuses */}
                            <MenuItem value="Ativo">Ativo</MenuItem>
                            <MenuItem value="Inativo">Inativo</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Optional Fields */}
                    <TextField
                        margin="dense"
                        id="phone"
                        name="phone"
                        label="Telefone (Opcional)"
                        type="tel"
                        fullWidth
                        variant="outlined"
                        value={currentSupplier.phone}
                        onChange={handleInputChange}
                        disabled={isSaving}
                        placeholder="(XX) XXXXX-XXXX"
                    />
                    <TextField
                        margin="dense"
                        id="address"
                        name="address"
                        label="Endereço (Opcional)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentSupplier.address}
                        onChange={handleInputChange}
                        disabled={isSaving}
                        multiline
                        rows={2}
                    />

                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
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
                        {isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Fornecedor')}
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

export default SupplierScreen;
import { useState, useEffect, useCallback } from 'react';
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
    CircularProgress,
    Alert,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';

const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000"
const API_BASE_URL = `${api_url}/siteManagement`;

const initialSectionState = {
    id: null,
    title: '',
    description: '',
    images: [''],
};

function SiteSectionScreen() {
    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSection, setCurrentSection] = useState(initialSectionState);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSections = useCallback(async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: {
                    'userId': localStorage.getItem('userId'),
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSections(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Não foi possível carregar as seções.';
            setError(errorMessage);
            setSections([]);
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSections();
    }, [fetchSections]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setCurrentSection(initialSectionState);
        setIsModalOpen(true);
        setError(null);
    };

    const handleOpenEditModal = (sectionToEdit) => {
        setIsEditing(true);
        setCurrentSection({
            ...sectionToEdit,
            images: Array.isArray(sectionToEdit.images) && sectionToEdit.images.length > 0
                ? sectionToEdit.images
                : [''],
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
        setCurrentSection(prev => ({ ...prev, [name]: value }));
    };

    // Para imagens (array de URLs)
    const handleImageChange = (idx, value) => {
        setCurrentSection(prev => {
            const images = [...prev.images];
            images[idx] = value;
            return { ...prev, images };
        });
    };

    const handleAddImageField = () => {
        setCurrentSection(prev => ({
            ...prev,
            images: [...prev.images, '']
        }));
    };

    const handleRemoveImageField = (idx) => {
        setCurrentSection(prev => {
            const images = prev.images.filter((_, i) => i !== idx);
            return { ...prev, images: images.length > 0 ? images : [''] };
        });
    };

    const handleModalSave = async () => {
        setIsSaving(true);
        setError(null);

        if (!currentSection.title?.trim()) {
            setSnackbar({ open: true, message: 'Erro: Título é obrigatório.', severity: 'error' });
            setIsSaving(false);
            return;
        }

        let sectionDataToSend = {
            ...currentSection,
            images: currentSection.images.filter(img => img.trim() !== ''),
        };

        if (!isEditing) {
            const { ...rest } = sectionDataToSend; // Remove id
            sectionDataToSend = rest;
        }

        try {
            if (isEditing) {
                await axios.put(`${API_BASE_URL}/${currentSection.id}`, sectionDataToSend, {
                    headers: {
                        'userId': localStorage.getItem('userId'),
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSnackbar({ open: true, message: 'Seção atualizada com sucesso!', severity: 'success' });
            } else {
                await axios.post(API_BASE_URL, sectionDataToSend, {
                    headers: {
                        'userId': localStorage.getItem('userId'),
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSnackbar({ open: true, message: 'Seção criada com sucesso!', severity: 'success' });
            }
            handleModalClose();
            await fetchSections(false);
        } catch (err) {
            const errorMessage = err.response?.data?.message || `Não foi possível ${isEditing ? 'atualizar' : 'criar'} a seção.`;
            setSnackbar({ open: true, message: `Erro: ${errorMessage}`, severity: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSection = async (id) => {
        const sectionToDelete = sections.find(section => section.id === id);
        const sectionTitle = sectionToDelete ? sectionToDelete.title : `ID ${id}`;

        if (window.confirm(`Tem certeza que deseja deletar a seção "${sectionTitle}"? Esta ação não pode ser desfeita.`)) {
            try {
                await axios.delete(`${API_BASE_URL}/${id}`, {
                    headers: {
                        'userId': localStorage.getItem('userId'),
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSnackbar({ open: true, message: 'Seção deletada com sucesso!', severity: 'success' });
                setSections(prevSections => prevSections.filter(section => section.id !== id));
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Não foi possível deletar a seção.';
                setError(errorMessage);
                setSnackbar({ open: true, message: `Erro ao deletar: ${errorMessage}`, severity: 'error' });
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Seções do Site
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateModal}
                    disabled={isLoading}
                >
                    Nova Seção
                </Button>
            </Box>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && !isLoading && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {!isLoading && (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 650 }}>
                        <Table stickyHeader aria-label="sticky section table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Imagens</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!error && sections.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                            Nenhuma seção cadastrada. Crie uma para começar!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sections.map((section) => (
                                        <TableRow
                                            hover
                                            key={section.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">{section.title}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                                    {section.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    {(section.images || []).map((img, idx) => (
                                                        img ?
                                                        <img
                                                            key={idx}
                                                            src={img}
                                                            alt={`img-${idx}`}
                                                            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }}
                                                        />
                                                        : null
                                                    ))}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    aria-label={`editar seção ${section.title}`}
                                                    size="small"
                                                    onClick={() => handleOpenEditModal(section)}
                                                    sx={{ mr: 0.5 }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    aria-label={`deletar seção ${section.title}`}
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteSection(section.id)}
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

            {/* Modal de criação/edição */}
            <Dialog open={isModalOpen} onClose={handleModalClose} aria-labelledby="section-dialog-title" maxWidth="sm" fullWidth>
                <DialogTitle id="section-dialog-title">
                    {isEditing ? 'Editar Seção' : 'Criar Nova Seção'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        name="title"
                        label="Título"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentSection.title}
                        onChange={handleInputChange}
                        required
                        disabled={isSaving}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        name="description"
                        label="Descrição"
                        type="text"
                        fullWidth
                        multiline
                        minRows={3}
                        variant="outlined"
                        value={currentSection.description}
                        onChange={handleInputChange}
                        disabled={isSaving}
                    />
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        Imagens (URLs)
                    </Typography>
                    <Grid container spacing={1}>
                        {currentSection.images.map((img, idx) => (
                            <Grid item xs={12} key={idx}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        label={`Imagem ${idx + 1}`}
                                        value={img}
                                        onChange={e => handleImageChange(idx, e.target.value)}
                                        fullWidth
                                        margin="dense"
                                        disabled={isSaving}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ImageIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Button
                                        onClick={() => handleRemoveImageField(idx)}
                                        color="error"
                                        sx={{ ml: 1, minWidth: 0 }}
                                        disabled={isSaving || currentSection.images.length === 1}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </Button>
                                </Box>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button
                                onClick={handleAddImageField}
                                startIcon={<AddIcon />}
                                size="small"
                                disabled={isSaving}
                            >
                                Adicionar Imagem
                            </Button>
                        </Grid>
                    </Grid>
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
                        {isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Seção')}
                    </Button>
                </DialogActions>
            </Dialog>

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

export default SiteSectionScreen;
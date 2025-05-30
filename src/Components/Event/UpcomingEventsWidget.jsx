import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Chip } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_BASE_URL = `${api_url}/events`;

function formatDate(dateString) {
    if (!dateString) return "";
    try {
        return new Date(dateString).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return dateString;
    }
}

const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
        case "confirmado": return "success";
        case "pendente": return "warning";
        case "cancelado": return "error";
        default: return "default";
    }
};

const UpcomingEventsWidget = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUpcomingEvents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/week`, {
                    headers: {
                        'userId': localStorage.getItem('userId'),
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEvents(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError(err.response?.data?.message || "Erro ao buscar eventos da semana.");
                setEvents([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUpcomingEvents();
    }, []);

    return (
        <Card sx={{ minHeight: 250 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EventIcon color="primary" /> Próximos eventos da semana
                </Typography>
                {isLoading ? (
                    <CircularProgress size={28} />
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : events.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        Nenhum evento agendado para esta semana.
                    </Typography>
                ) : (
                    <List dense>
                        {events.map(event => (
                            <ListItem key={event.id} disablePadding>
                                <ListItemText
                                    primary={
                                        <span>
                                            <strong>{event.name}</strong> &mdash; {formatDate(event.start_date)}
                                        </span>
                                    }
                                    secondary={event.local}
                                />
                                <Chip
                                    label={event.status}
                                    color={getStatusChipColor(event.status)}
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default UpcomingEventsWidget;
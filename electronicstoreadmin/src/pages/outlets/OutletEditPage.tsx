import { Box, CircularProgress, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OutletForm } from '../../components/outlets';
import { OutletService } from '../../services/outlet.service';
import { OutletResponse } from '../../types/api-responses';

const OutletEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [outlet, setOutlet] = useState<OutletResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOutlet = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await OutletService.getOutletById(parseInt(id));

                if (response?.status === 'SUCCESS' && response?.data) {
                    setOutlet(response.data);
                } else {
                    setError(response?.message || 'Failed to load outlet');
                }
            } catch (error) {
                setError('An error occurred while loading the outlet');
                console.error('Error fetching outlet:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOutlet();
    }, [id]);

    if (loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    {error}
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <OutletForm outletId={id ? parseInt(id) : undefined} initialData={outlet || undefined} />
        </Container>
    );
};

export default OutletEditPage; 
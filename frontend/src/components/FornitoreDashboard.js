import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Button,
    useToast,
    Flex
} from '@chakra-ui/react';
import axios from '../utils/axiosConfig';
import { useParams } from 'react-router-dom';
import KanbanCard from './KanbanCard';

const FornitoreDashboard = () => {
    const { fornitoreId } = useParams();
    const [kanbanList, setKanbanList] = useState([]);
    const toast = useToast();
    const [groupedKanban, setGroupedKanban] = useState({});

    useEffect(() => {
        const fetchKanban = async () => {
            try {
                const response = await axios.get(`/api/dashboard/fornitori/${fornitoreId}`);
                setKanbanList(response.data);
            } catch (error) {
              toast({
               title: 'Errore durante il caricamento dei dati',
                 description: 'Si è verificato un errore durante il caricamento dei kanban del fornitore.',
                status: 'error',
                 duration: 5000,
                isClosable: true,
               });
            }
        };

        fetchKanban();
    }, [fornitoreId, toast]);

    useEffect(() => {
        // Raggruppa i cartellini per codice prodotto
        const grouped = kanbanList.reduce((acc, kanban) => {
            const prodottoCodice = kanban.prodotto.descrizione;
            if (!acc[prodottoCodice]) {
                acc[prodottoCodice] = [];
            }
            acc[prodottoCodice].push(kanban);
            return acc;
        }, {});

        // Ordina i cartellini di ogni gruppo, mettendo prima quelli svuotati
        for (const prodottoCodice in grouped) {
            grouped[prodottoCodice].sort((a, b) => {
                if (a.stato === 'Svuotato' && b.stato !== 'Svuotato') {
                    return -1;
                } else if (a.stato !== 'Svuotato' && b.stato === 'Svuotato') {
                    return 1;
                }
                return 0;
            });
        }

        setGroupedKanban(grouped);
    }, [kanbanList]);

    const handleAttivaKanban = async (kanbanId) => {
        try {
            await axios.put(`/api/kanban/${kanbanId}/stato`, { stato: 'Attivo' });
           setKanbanList(kanbanList.map(kanban => kanban.id === kanbanId ? { ...kanban, stato: 'Attivo' } : kanban));
            toast({
               title: 'Kanban reso attivo',
               status: 'success',
               duration: 3000,
               isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Errore durante l\'aggiornamento',
                description: 'Si è verificato un errore durante l\'attivazione del kanban.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };


     return (
        <Box p={4}>
            <Heading mb={4}>Dashboard Fornitore</Heading>
             {Object.keys(groupedKanban).length === 0 ? (
                    <Box>Nessun kanban trovato</Box>
                ) : (
                    Object.keys(groupedKanban).map((prodottoCodice) => (
                         <Box key={prodottoCodice} mb={6}>
                             <Heading size="md" mb={2}>{prodottoCodice}</Heading>
                            <Flex wrap="wrap" >
                              {groupedKanban[prodottoCodice].map((kanban) => (
                                    <KanbanCard key={kanban.id} kanban={kanban}>
                                        {kanban.stato === 'Svuotato' &&
                                        <Button colorScheme="green" onClick={() => handleAttivaKanban(kanban.id)}>Rendi Attivo</Button>
                                        }
                                    </KanbanCard>
                                ))
                              }
                            </Flex>
                         </Box>
                      ))
             )}
        </Box>
    );
};

export default FornitoreDashboard;
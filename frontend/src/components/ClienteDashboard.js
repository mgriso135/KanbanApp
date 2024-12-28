import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Flex,
    Button,
    useToast,
} from '@chakra-ui/react';
import axios from '../utils/axiosConfig';
import { useParams } from 'react-router-dom';
import KanbanCard from './KanbanCard';
import QrScanner from 'react-qr-scanner';

const ClienteDashboard = () => {
    const { clienteId } = useParams();
    const [kanbanList, setKanbanList] = useState([]);
    const toast = useToast();
     const [scanning, setScanning] = useState(false);
     const [scanResult, setScanResult] = useState('');
      const [groupedKanban, setGroupedKanban] = useState({});


    useEffect(() => {
        const fetchKanban = async () => {
            try {
                const response = await axios.get(`/api/dashboard/clienti/${clienteId}`);
                setKanbanList(response.data);
            } catch (error) {
                 toast({
                 title: 'Errore durante il caricamento dei dati',
                    description: 'Si è verificato un errore durante il caricamento dei kanban del cliente.',
                 status: 'error',
                 duration: 5000,
                 isClosable: true,
                });
            }
        };

        fetchKanban();
    }, [clienteId, toast]);
    useEffect(() => {
    // Raggruppa i cartellini per codice prodotto e riordina
      const grouped = kanbanList.reduce((acc, kanban) => {
          const prodottoCodice = kanban.prodotto?.descrizione;
          if (!acc[prodottoCodice]) {
              acc[prodottoCodice] = [];
          }
          acc[prodottoCodice].push(kanban);
          return acc;
      }, {});
     for (const prodottoCodice in grouped) {
          grouped[prodottoCodice].sort((a, b) => {
                if (a.stato === 'Attivo' && b.stato !== 'Attivo') {
                    return -1;
                } else if (a.stato !== 'Attivo' && b.stato === 'Attivo') {
                    return 1;
                }
              return 0;
           });
        }
      setGroupedKanban(grouped);
    }, [kanbanList]);

     const handleSvuotaKanban = async (kanbanId) => {
        try {
             await axios.put(`/api/kanban/${kanbanId}/stato`, { stato: 'Svuotato' });
            setKanbanList(kanbanList.map(kanban => kanban.id === kanbanId ? { ...kanban, stato: 'Svuotato' } : kanban));
            toast({
                title: 'Kanban svuotato',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
               title: 'Errore durante l\'aggiornamento',
                description: 'Si è verificato un errore durante lo svuotamento del kanban.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleScan = (result) => {
         if (result) {
            setScanning(false);
            setScanResult(result.text);
             //Estraggo l'id del kanban
            const idKanban = result.text.split(":")[1]
            if (idKanban) {
               handleSvuotaKanban(parseInt(idKanban,10));
            }
          }
    };

      const handleError = (err) => {
         console.error(err);
          toast({
               title: 'Errore durante la scansione del QR code',
                description: 'Si è verificato un errore durante la scansione del QR code.',
               status: 'error',
               duration: 5000,
              isClosable: true,
           });
      }

    return (
        <Box p={4}>
            <Heading mb={4}>Dashboard Cliente</Heading>
             <Button onClick={() => setScanning(!scanning)} colorScheme="teal" mb={4}>
               {scanning ? "Chiudi Scanner" : "Apri Scanner"}
              </Button>
              {scanning &&
                <QrScanner
                   onError={handleError}
                   onScan={handleScan}
                  style={{ width: '100%' }}
               />
               }
               {Object.keys(groupedKanban).length === 0 ? (
                  <Box>Nessun kanban trovato</Box>
              ) : (
                 Object.keys(groupedKanban).map((prodottoCodice) => (
                     <Box key={prodottoCodice} mb={6}>
                          <Heading size="md" mb={2}>{prodottoCodice}</Heading>
                          <Flex wrap="wrap">
                              {groupedKanban[prodottoCodice].map((kanban) => (
                                <KanbanCard key={kanban.id} kanban={kanban}>
                                    {kanban.stato === 'Attivo' &&
                                      <Button colorScheme="red" onClick={() => handleSvuotaKanban(kanban.id)} >Svuota</Button>
                                    }
                                </KanbanCard>
                               ))}
                          </Flex>
                      </Box>
                   ))
              )}
        </Box>
    );
};

export default ClienteDashboard;
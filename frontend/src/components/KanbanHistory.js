import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    useToast,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Flex
} from '@chakra-ui/react';
import axios from '../utils/axiosConfig';

const KanbanHistory = () => {
    const [kanbanHistory, setKanbanHistory] = useState([]);
    const [prodotti, setProdotti] = useState([]);
    const [selectedProdotto, setSelectedProdotto] = useState('');
    const toast = useToast();


    useEffect(() => {
        const fetchData = async () => {
            try {
              const historyResult = await axios.get('/api/kanban/history');
                setKanbanHistory(historyResult.data);
              const prodottiResult = await axios.get('/api/prodotti');
                setProdotti(prodottiResult.data);
            } catch (error) {
                toast({
                    title: 'Errore durante il caricamento dei dati',
                    description: 'Si è verificato un errore durante il caricamento della history dei Kanban.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchData();
    }, [toast]);

      const filteredKanbanHistory = selectedProdotto
          ? kanbanHistory.filter(kanban => kanban.prodotto?.descrizione === selectedProdotto)
          : kanbanHistory;

    return (
        <Box p={4}>
            <Heading mb={4}>Kanban History</Heading>
            <Flex mb={4} align="center">
              <Box mr={2}>
                <Heading size="md">Filtra per prodotto:</Heading>
                <Select placeholder="Seleziona un prodotto" value={selectedProdotto} onChange={(e) => setSelectedProdotto(e.target.value)}>
                    {prodotti.map((prodotto) => (
                         <option key={prodotto.codice_prodotto} value={prodotto.descrizione}>{prodotto.descrizione}</option>
                      ))}
                 </Select>
              </Box>
            </Flex>
          <Box overflowX="auto">
             <Table variant="striped" colorScheme="gray">
                 <Thead>
                  <Tr>
                       <Th>ID</Th>
                       <Th>Prodotto</Th>
                       <Th>Cliente</Th>
                       <Th>Fornitore</Th>
                        <Th>Quantità</Th>
                        <Th>Tipo Contenitore</Th>
                       <Th>Stato</Th>
                       <Th>Data Aggiornamento</Th>
                  </Tr>
                 </Thead>
                <Tbody>
                {filteredKanbanHistory.map((kanban) => (
                    <Tr key={kanban.id}>
                       <Td>{kanban.id}</Td>
                       <Td>{kanban.prodotto?.descrizione}</Td>
                       <Td>{kanban.cliente?.ragione_sociale}</Td>
                       <Td>{kanban.fornitore?.ragione_sociale}</Td>
                        <Td>{kanban.quantita}</Td>
                        <Td>{kanban.tipo_contenitore}</Td>
                        <Td>{kanban.stato}</Td>
                       <Td>{new Date(kanban.data_aggiornamento).toLocaleString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
             </Table>
          </Box>
        </Box>
    );
};

export default KanbanHistory;
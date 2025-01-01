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
import { useTranslation } from 'react-i18next';


const KanbanHistory = () => {
    const [kanbanHistory, setKanbanHistory] = useState([]);
    const [prodotti, setProdotti] = useState([]);
    const [selectedProdotto, setSelectedProdotto] = useState('');
    const toast = useToast();
    const { t } = useTranslation();


    useEffect(() => {
        const fetchData = async () => {
            try {
              const historyResult = await axios.get('/api/kanban/history');
              // Ordina per data decrescente
               const sortedKanbanList = historyResult.data.sort((a, b) => new Date(b.data_aggiornamento) - new Date(a.data_aggiornamento))
               setKanbanHistory(sortedKanbanList);
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
          ? kanbanHistory.filter(kanban => kanban.kanban?.prodotto?.descrizione === selectedProdotto)
          : kanbanHistory;

    return (
        <Box p={4}>
            <Heading mb={4}>{t('kanbanHistory')}</Heading>
             <Flex mb={4} align="center">
              <Box mr={2}>
                <Heading size="md">Filtra per prodotto:</Heading>
                 <Select placeholder={t('selectProduct')} value={selectedProdotto} onChange={(e) => setSelectedProdotto(e.target.value)}>
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
                        <Th>{t('id')}</Th>
                        <Th>Kanban ID</Th>
                       <Th>{t('productName')}</Th>
                       <Th>{t('customer')}</Th>
                       <Th>{t('provider')}</Th>
                        <Th>{t('quantity')}</Th>
                        <Th>{t('type')}</Th>
                       <Th>{t('stato')}</Th>
                       <Th>{t('lastUpdate')}</Th>
                  </Tr>
                 </Thead>
                <Tbody>
                {filteredKanbanHistory.map((entry) => (
                    <Tr key={entry.id}>
                        <Td>{entry.id}</Td>
                        <Td>{entry.kanban_id}</Td>
                       <Td>{entry.kanban?.prodotto?.descrizione}</Td>
                        <Td>{entry.kanban?.cliente?.ragione_sociale}</Td>
                        <Td>{entry.kanban?.fornitore?.ragione_sociale}</Td>
                        <Td>{entry.kanban?.quantita}</Td>
                        <Td>{entry.kanban?.tipo_contenitore}</Td>
                        <Td>{entry.stato}</Td>
                        <Td>{new Date(entry.data_aggiornamento).toLocaleString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
             </Table>
          </Box>
        </Box>
    );
};

export default KanbanHistory;
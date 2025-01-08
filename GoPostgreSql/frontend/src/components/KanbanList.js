import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Heading,
    Button,
    useToast,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Flex,
    Spacer,
    Select
} from '@chakra-ui/react';
import axios from '../utils/axiosConfig';
import { useReactToPrint } from 'react-to-print';
import KanbanCard from './KanbanCard';
import { useTranslation } from 'react-i18next';

const KanbanList = () => {
    const [kanbanList, setKanbanList] = useState([]);
    const [prodotti, setProdotti] = useState([]);
    const [selectedProdotto, setSelectedProdotto] = useState('');
    const toast = useToast();
    const componentRef = useRef();
    const { t } = useTranslation();

    const handlePrintSingle = useReactToPrint({
        content:  () => componentRef.current
     });

    useEffect(() => {
        const fetchKanban = async () => {
            try {
                const response = await axios.get('/api/kanban');
                setKanbanList(response.data.filter(kanban => kanban.stato === 'Attivo' && kanban.is_active));
                 const prodottiResult = await axios.get('/api/prodotti');
                setProdotti(prodottiResult.data);
            } catch (error) {
               toast({
                    title: 'Errore durante il caricamento dei kanban',
                     description: 'Si è verificato un errore durante il caricamento della lista dei kanban.',
                   status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchKanban();
    }, [toast]);

       const handleEliminaKanban = async (kanbanId) => {
          try {
               await axios.delete(`/api/kanban/${kanbanId}`);
                // Fetch the updated list of kanbans
               const response = await axios.get('/api/kanban');
                setKanbanList(response.data.filter(kanban => kanban.stato === 'Attivo' && kanban.is_active));
              toast({
                  title: 'Kanban eliminato',
                   status: 'success',
                   duration: 3000,
                    isClosable: true,
               });
            } catch (error) {
               toast({
                   title: 'Errore durante l\'eliminazione del kanban',
                  description: 'Si è verificato un errore durante l\'eliminazione del kanban.',
                    status: 'error',
                   duration: 5000,
                   isClosable: true,
               });
         }
     };

     const filteredKanbanList = selectedProdotto
        ? kanbanList.filter(kanban => kanban.prodotto?.descrizione === selectedProdotto)
        : kanbanList;


    return (
        <Box p={4}>
          <Flex mb={4} align="center">
              <Heading>{t('kanbanList')}</Heading>
                <Spacer/>
          </Flex>
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
                    <Th>{t('product')}</Th>
                    <Th>{t('customer')}</Th>
                   <Th>{t('provider')}</Th>
                    <Th>{t('quantity')}</Th>
                    <Th>{t('type')}</Th>
                    <Th>{t('leadTime')}</Th>
                     <Th>Rimuovi</Th>
                     <Th>Stampa</Th>
               </Tr>
              </Thead>
                <Tbody>
                {filteredKanbanList.map((kanban) => (
                    <Tr key={kanban.id}>
                      <Td>{kanban.id}</Td>
                      <Td>{kanban.prodotto?.descrizione}</Td>
                        <Td>{kanban.cliente?.ragione_sociale}</Td>
                        <Td>{kanban.fornitore?.ragione_sociale}</Td>
                         <Td>{kanban.quantita}</Td>
                        <Td>{kanban.tipo_contenitore}</Td>
                         <Td>{kanban.leadTime}</Td>
                        <Td>
                          <Button size="sm" colorScheme="red" onClick={() => handleEliminaKanban(kanban.id)}>Rimuovi</Button>
                        </Td>
                           <Td>
                                 <Button size="sm" colorScheme="blue" onClick={()=> handlePrintSingle()}>Stampa</Button>
                            </Td>
                    </Tr>
                    ))}
                </Tbody>
             </Table>
           </Box>
            <div style={{ display: 'none' }}>
                <div ref={componentRef}>
                  {filteredKanbanList.map((kanban) => (
                       <div key={kanban.id} id={`kanban-${kanban.id}`}>
                         <KanbanCard  kanban={kanban} showQrCode={true}/>
                        </div>
                   ))}
               </div>
             </div>
        </Box>
    );
};

export default KanbanList;
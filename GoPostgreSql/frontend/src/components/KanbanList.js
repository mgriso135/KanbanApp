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
Spacer
} from '@chakra-ui/react';
import axios from '../utils/axiosConfig';
import { useReactToPrint } from 'react-to-print';
import KanbanCard from './KanbanCard';
import { useTranslation } from 'react-i18next';

const KanbanList = () => {
    const [kanbanList, setKanbanList] = useState([]);
    const toast = useToast();
    const componentRef = useRef();
    const { t } = useTranslation();

    const handlePrintSingle = useReactToPrint({
        content:  () => componentRef.current
    });

    useEffect(() => {
        const fetchKanban = async () => {
            console.log("Fetching kanban data...");
            try {
                const response = await axios.get('/api/kanban');
                 console.log("Kanban data received:", response.data);
                setKanbanList(response.data.filter(kanban => kanban.stato === 'Attivo' && kanban.is_active));
            } catch (error) {
               console.error("Error fetching Kanban data:", error)
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

     const handleRecalculateKanban = async () => {
            try {
                await axios.post('/api/kanban/recalculate');
                const response = await axios.get('/api/kanban');
                setKanbanList(response.data.filter(kanban => kanban.stato === 'Attivo' && kanban.is_active));
                toast({
                    title: 'Kanban ricalcolato',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                toast({
                    title: 'Errore durante il ricalcolo del kanban',
                    description: 'Si è verificato un errore durante il ricalcolo del kanban.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

    return (
        <Box p={4}>
          <Flex mb={4} align="center">
              <Heading>{t('kanbanList')}</Heading>
                <Spacer/>
				<Button onClick={handleRecalculateKanban} colorScheme="teal" mr={2}>Ricalcola Kanban</Button>
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
                {kanbanList.map((kanban) => (
                    <Tr key={kanban.id}>
                      <Td>{kanban.id}</Td>
                      <Td>{kanban.kanban_chain?.prodotto?.descrizione}</Td>
                        <Td>{kanban.kanban_chain?.cliente?.ragione_sociale}</Td>
                        <Td>{kanban.kanban_chain?.fornitore?.ragione_sociale}</Td>
                         <Td>{kanban.kanban_chain?.quantita}</Td>
                        <Td>{kanban.kanban_chain?.tipo_contenitore}</Td>
                        <Td>{kanban.kanban_chain?.lead_time}</Td>
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
                  {kanbanList.map((kanban) => (
                       <div key={kanban.id} id={`kanban-${kanban.id}`}>
                         <KanbanCard  kanban={kanban} showQrCode={true} dashboard="none"/>
                        </div>
                   ))}
               </div>
             </div>
        </Box>
    );
};

export default KanbanList;
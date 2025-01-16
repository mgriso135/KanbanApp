import React, { useState, useEffect } from 'react';
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
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const KanbanStatusChainList = () => {
    const [kanbanStatusChains, setKanbanStatusChains] = useState([]);
     const toast = useToast();
       const { t } = useTranslation();

    useEffect(() => {
        const fetchKanbanStatusChains = async () => {
            try {
                const response = await axios.get('/api/kanban-status-chain');
                setKanbanStatusChains(response.data);
            } catch (error) {
               toast({
                    title: 'Errore durante il caricamento delle Kanban Status Chain',
                     description: 'Si è verificato un errore durante il caricamento della lista delle kanban status chain.',
                   status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchKanbanStatusChains();
    }, [toast]);

    const handleEliminaKanbanStatusChain = async (kanbanStatusChainId) => {
        try {
             await axios.delete(`/api/kanban-status-chain/${kanbanStatusChainId}`);
             setKanbanStatusChains(kanbanStatusChains.filter(kanbanStatusChain => kanbanStatusChain.id !== kanbanStatusChainId));
             toast({
                 title: 'Kanban Status Chain eliminata',
                  status: 'success',
                   duration: 3000,
                  isClosable: true,
             });
         } catch (error) {
              toast({
                  title: 'Errore durante l\'eliminazione della Kanban Status Chain',
                   description: 'Si è verificato un errore durante l\'eliminazione della Kanban Status Chain.',
                   status: 'error',
                   duration: 5000,
                   isClosable: true,
               });
         }
     };


    return (
        <Box p={4}>
            <Flex mb={4} align="center">
                <Heading>Lista Kanban Status Chain</Heading>
                 <Spacer/>
                <Link to="/aggiungi-kanban-status-chain">
                    <Button colorScheme="teal">Aggiungi Kanban Status Chain</Button>
                </Link>
           </Flex>
            <Box overflowX="auto">
                <Table variant="striped" colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                           <Th>Name</Th>
                           <Th>Modifica</Th>
                              <Th>Rimuovi</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {kanbanStatusChains.map((kanbanStatusChain) => (
                        <Tr key={kanbanStatusChain.id}>
                           <Td>{kanbanStatusChain.id}</Td>
                            <Td>{kanbanStatusChain.name}</Td>
                             <Td>
                               <Link to={`/aggiungi-kanban-status-chain/${kanbanStatusChain.id}`}>
                                   <Button size="sm" colorScheme="teal">Modifica</Button>
                                </Link>
                             </Td>
                             <Td>
                                  <Button size="sm" colorScheme="red" onClick={() => handleEliminaKanbanStatusChain(kanbanStatusChain.id)}>Rimuovi</Button>
                              </Td>
                        </Tr>
                     ))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default KanbanStatusChainList;
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

const KanbanChainList = () => {
    const [kanbanChains, setKanbanChains] = useState([]);
     const toast = useToast();
       const { t } = useTranslation();

    useEffect(() => {
        const fetchKanbanChains = async () => {
            try {
                const response = await axios.get('/api/kanban-chain');
                setKanbanChains(response.data);
            } catch (error) {
               toast({
                    title: 'Errore durante il caricamento delle Kanban Chain',
                     description: 'Si è verificato un errore durante il caricamento della lista delle Kanban Chain.',
                   status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchKanbanChains();
    }, [toast]);

    return (
        <Box p={4}>
            <Flex mb={4} align="center">
                <Heading>Lista Kanban Chain</Heading>
                 <Spacer/>
                <Link to="/aggiungi-kanban-chain">
                    <Button colorScheme="teal">Aggiungi Kanban Chain</Button>
                </Link>
           </Flex>
            <Box overflowX="auto">
                <Table variant="striped" colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                           <Th>Name</Th>
                           <Th>Modifica</Th>
                           <Th>Gestisci Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {kanbanChains.map((kanbanChain) => (
                        <Tr key={kanbanChain.id}>
                           <Td>{kanbanChain.id}</Td>
                           <Td>{kanbanChain.name}</Td>
                            <Td>
                               <Link to={`/aggiungi-kanban-chain/${kanbanChain.id}`}>
                                   <Button size="sm" colorScheme="teal">Modifica</Button>
                                </Link>
                             </Td>
                             <Td>
                              <Link to={`/kanban-chain-status-management/${kanbanChain.id}`}>
                                 <Button size="sm" colorScheme="teal">Gestisci Status</Button>
                             </Link>
                         </Td>
                        </Tr>
                    ))}
                   </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default KanbanChainList;
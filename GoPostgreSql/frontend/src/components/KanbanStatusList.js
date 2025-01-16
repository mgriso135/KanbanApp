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
    Spacer,
    IconButton
} from '@chakra-ui/react';
import axios from '../utils/axiosConfig';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DeleteIcon } from '@chakra-ui/icons';

const KanbanStatusList = () => {
    const [kanbanStatuses, setKanbanStatuses] = useState([]);
     const toast = useToast();
       const { t } = useTranslation();
    const { kanbanChainId } = useParams();

    useEffect(() => {
        const fetchKanbanStatuses = async () => {
            try {
                 let response
                if(kanbanChainId){
                    response = await axios.get('/api/kanban-status', {
                        params: {
                            kanban_chain_id: kanbanChainId,
                         },
                      });
                }
                else{
                  response = await axios.get('/api/kanban-status');
                }

                setKanbanStatuses(response.data);
            } catch (error) {
               toast({
                    title: 'Errore durante il caricamento dei Kanban Status',
                     description: 'Si è verificato un errore durante il caricamento della lista dei kanban status.',
                   status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchKanbanStatuses();
    }, [toast, kanbanChainId]);

     const handleEliminaKanbanStatus = async (kanbanStatusId) => {
        try {
            await axios.delete(`/api/kanban-status/${kanbanStatusId}`);
            setKanbanStatuses(kanbanStatuses.filter(kanbanStatus => kanbanStatus.id !== kanbanStatusId));
            toast({
                title: 'Kanban Status eliminato',
                 status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
              toast({
                title: 'Errore durante l\'eliminazione del kanban status',
                 description: 'Si è verificato un errore durante l\'eliminazione del kanban status.',
                 status: 'error',
                 duration: 5000,
                 isClosable: true,
             });
        }
    };

    return (
        <Box p={4}>
            <Flex mb={4} align="center">
                <Heading>Lista Kanban Status</Heading>
                 <Spacer/>
                <Link to={ kanbanChainId ? `/aggiungi-kanban-status/${kanbanChainId}` : `/aggiungi-kanban-status`}>
                    <Button colorScheme="teal">Aggiungi Kanban Status</Button>
                </Link>
           </Flex>
            <Box overflowX="auto">
                <Table variant="striped" colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                           <Th>Name</Th>
                           <Th>Color</Th>
                            <Th>Modifica</Th>
                            <Th>Rimuovi</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {kanbanStatuses.map((kanbanStatus) => (
                        <Tr key={kanbanStatus.id}>
                           <Td>{kanbanStatus.id}</Td>
                           <Td>{kanbanStatus.name}</Td>
                             <Td>{kanbanStatus.color}</Td>
                             <Td>
                               <Link to={kanbanChainId ? `/aggiungi-kanban-status/${kanbanStatus.id}/${kanbanChainId}` : `/aggiungi-kanban-status/${kanbanStatus.id}`}>
                                   <Button size="sm" colorScheme="teal">Modifica</Button>
                               </Link>
                            </Td>
                             <Td>
                                   <IconButton
                                        icon={<DeleteIcon />}
                                         colorScheme="red"
                                        size="sm"
                                       onClick={() => handleEliminaKanbanStatus(kanbanStatus.id)}
                                         aria-label={'Elimina Kanban Status'}
                                    />
                            </Td>
                        </Tr>
                    ))}
                   </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default KanbanStatusList;
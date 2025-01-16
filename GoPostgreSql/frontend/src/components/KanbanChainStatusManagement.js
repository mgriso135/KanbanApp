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
    Select,
    FormControl,
    FormLabel,
    Input
} from '@chakra-ui/react';
import axios from '../utils/axiosConfig';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const KanbanChainStatusManagement = () => {
    const [kanbanStatuses, setKanbanStatuses] = useState([]);
    const [kanbanChain, setKanbanChain] = useState({});
    const toast = useToast();
       const { t } = useTranslation();
    const { kanbanChainId } = useParams();
     const [selectedKanbanStatus, setSelectedKanbanStatus] = useState('')
    const [order, setOrder] = useState(1);
     const [name, setName] = useState("");
    useEffect(() => {
        const fetchKanbanStatuses = async () => {
            try {
                 const response = await axios.get(`/api/kanban-status`, {
                    params: {
                        kanban_chain_id: kanbanChainId,
                     },
                 });
                setKanbanStatuses(response.data);

                 const kanbanChainResult = await axios.get(`/api/kanban-chain/${kanbanChainId}`);
                 setKanbanChain(kanbanChainResult.data);

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


     const handleUpdateKanbanChainStatus = async (kanbanStatusId, order, name) => {
          try {
              await axios.put(`/api/kanban-chain-status/${kanbanStatusId}`,{
                  kanban_chain_id: parseInt(kanbanChainId,10),
                  order: order,
                  name: name
               });

                toast({
                  title: 'Kanban Status aggiornato',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
              });
           } catch (error) {
               toast({
                    title: 'Errore durante l\'aggiornamento del kanban status',
                   description: 'Si è verificato un errore durante l\'aggiornamento del kanban status.',
                    status: 'error',
                    duration: 5000,
                   isClosable: true,
                });
           }
       };
     const handleAddKanbanChainStatus = async (kanbanChainId, kanbanStatusId) => {
         try {
              await axios.post(`/api/kanban-chain-status`,{
                  kanban_chain_id: parseInt(kanbanChainId,10),
                    kanban_status_id: kanbanStatusId,
                 });

                 toast({
                     title: 'Kanban Status aggiunto',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                 });
             } catch (error) {
                 toast({
                     title: 'Errore durante l\'aggiunta del kanban status',
                     description: 'Si è verificato un errore durante l\'aggiunta del kanban status.',
                     status: 'error',
                     duration: 5000,
                     isClosable: true,
                 });
            }
       };

     const handleRemoveKanbanChainStatus = async (kanbanStatusId) => {
        try {
             await axios.delete(`/api/kanban-chain-status/${kanbanStatusId}`,{
                  data: {
                     kanban_chain_id: parseInt(kanbanChainId, 10),
                   }
                });
               toast({
                    title: 'Kanban Status rimosso',
                    status: 'success',
                    duration: 3000,
                     isClosable: true,
                 });
           } catch (error) {
               toast({
                   title: 'Errore durante la rimozione del kanban status',
                    description: 'Si è verificato un errore durante la rimozione del kanban status.',
                    status: 'error',
                   duration: 5000,
                  isClosable: true,
               });
          }
     };

    return (
        <Box p={4}>
            <Flex mb={4} align="center">
                <Heading>Gestisci Status</Heading>
                 <Spacer/>
                <Link to={`/aggiungi-kanban-status/${kanbanChainId}`}>
                    <Button colorScheme="teal" mr={2}>Aggiungi Status</Button>
                 </Link>

            </Flex>
            <Box mb={4}>
                <Heading size="md">Kanban Chain: {kanbanChain.name} </Heading>
            </Box>
            <Box overflowX="auto">
                <Table variant="striped" colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                           <Th>Name</Th>
                           <Th>Color</Th>
                            <Th>Order</Th>
                             <Th>Name</Th>
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
                            {kanbanStatus.kanban_chain_statuses?.find(item => item.kanban_status_id === kanbanStatus.id)?.order || "N/A" }
                                </Td>
                                <Td>
                                     <FormControl maxW="200px" mr={2}>
                                        <Input type="text"
                                             placeholder="Name"
                                              defaultValue={kanbanStatus.kanban_chain_statuses?.find(item => item.kanban_status_id === kanbanStatus.id)?.name || ""}
                                            onChange={(e) => {
                                              setSelectedKanbanStatus(kanbanStatus.id)
                                                setName(e.target.value)
                                             }}
                                          />
                                 </FormControl>

                                </Td>
                            <Td>
                              <Flex alignItems="center">
                                <FormControl maxW="100px" mr={2}>
                                      <Input type="number"
                                             placeholder="Order"
                                             value={order}
                                            onChange={(e) => setOrder(e.target.value)}
                                            />
                                </FormControl>
                                 <Button size="sm" colorScheme="teal" onClick={() => handleUpdateKanbanChainStatus(kanbanStatus.id,order, name)}>Modifica</Button>
                            </Flex>
                             </Td>
                             <Td>
                                   <Button size="sm" colorScheme="red" onClick={() => handleRemoveKanbanChainStatus(kanbanStatus.id)}>Rimuovi</Button>
                              </Td>
                        </Tr>
                    ))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default KanbanChainStatusManagement;
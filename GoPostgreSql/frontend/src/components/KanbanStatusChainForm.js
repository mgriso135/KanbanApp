import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    Flex,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spacer,
    NumberInput,
    NumberInputField,
    IconButton,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import axios from '../utils/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Custom Hook for managing API requests and loading states
const useApi = () => {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const apiRequest = useCallback(async (action, url, method = 'get', payload = null) => {
          setLoading(true);
        try {
           let response;
          switch(method){
              case "post":
                    response =  await axios.post(url, payload);
                  break;
               case "put":
                  response =  await axios.put(url, payload);
                  break;
              case "delete":
                    response = await axios.delete(url, { data: payload});
                    break;
               default:
                   response = await axios.get(url, { params: payload });
          }
           return response?.data
        } catch (error) {
              toast({
                    title: `Errore durante ${action}`,
                     description: `Si è verificato un errore durante l'azione ${action}`,
                      status: 'error',
                     duration: 5000,
                      isClosable: true,
                });
             throw error;
        } finally {
           setLoading(false);
        }
    }, [toast]);

    return { loading, apiRequest };
};


const KanbanStatusChainForm = () => {
    console.log("KanbanStatusChainForm rendered");
    const { kanbanStatusChainId } = useParams();
    const [chainName, setChainName] = useState('');
    const [availableStatuses, setAvailableStatuses] = useState([]);
    const [linkedStatuses, setLinkedStatuses] = useState([]);
    const [statusOrder, setStatusOrder] = useState({});
    const [selectedStatus, setSelectedStatus] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { loading, apiRequest } = useApi();
    const [isEditing, setIsEditing] = useState(false);


   useEffect(() => {
        console.log("useEffect hook started");
        const fetchData = async () => {
            try {
                const availableStatusesData = await apiRequest('Caricamento kanban statuses', '/api/kanban-status');
                
                setAvailableStatuses(availableStatusesData);
                console.log("kanbanStatusChainId", kanbanStatusChainId);
                if (kanbanStatusChainId) {
                    
                    setIsEditing(true);
                   const chainData = await apiRequest('Caricamento kanban status chain', `/api/kanban-status-chain/${kanbanStatusChainId}`);
                   console.log(chainData);
                   setChainName(chainData.name);
                     const linkedStatusesData = await apiRequest('Caricamento linked kanban statuses', '/api/kanban-status', 'get', { kanban_chain_id: kanbanStatusChainId});
                    setLinkedStatuses(linkedStatusesData);
                       const initialOrder = {};
                      linkedStatusesData.forEach((status) => {
                            initialOrder[status.id] = status.kanban_chain_statuses?.find(item => item.kanban_status_id === status.id)?.order || 1;
                        });
                       setStatusOrder(initialOrder);
                 }
                  else{
                    console.log("Api request started BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB:");
                    setIsEditing(false);
                      setChainName('');
                 }
            } catch (error) {
               navigate('/kanban-status-chain-list');
          }

        };

        fetchData();
    }, [kanbanStatusChainId, apiRequest, navigate]);

    const handleChainSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { name: chainName };
            if (isEditing) {
                await apiRequest('Aggiornamento kanban status chain',`/api/kanban-status-chain/${kanbanStatusChainId}`, 'put', payload);
            } else {
                const newChain = await apiRequest('Creazione kanban status chain', '/api/kanban-status-chain', 'post', payload);
                 navigate(`/aggiungi-kanban-status-chain/${newChain.id}`);

            }
              navigate('/kanban-status-chain-list');
        } catch (error) {

        }

    };


    const handleAddStatus = async () => {
         if (!selectedStatus) return;
         console.log('handleAddStatus - URL:', '/api/kanban-chain-status', 'payload', {
                    kanban_chain_id: parseInt(kanbanStatusChainId, 10),
                    kanban_status_id: parseInt(selectedStatus, 10),
                    order: 1
                });
         try {
             await apiRequest('Collegamento kanban status','/api/kanban-chain-status', 'post', {
                    kanban_chain_id: parseInt(kanbanStatusChainId, 10),
                    kanban_status_id: parseInt(selectedStatus, 10),
                    order: 1
                });
               const linkedStatusesData = await apiRequest('Caricamento linked kanban statuses', '/api/kanban-status', 'get', { kanban_chain_id: kanbanStatusChainId});
                setLinkedStatuses(linkedStatusesData);
                 setSelectedStatus('');
        } catch (error) {

        }
    };

    const handleUnlinkStatus = async (kanbanStatusId) => {
        try {
            await apiRequest('Scollegamento kanban status',`/api/kanban-chain-status/${kanbanStatusId}`, 'delete', {
                    kanban_chain_id: parseInt(kanbanStatusChainId, 10),
                });
            const linkedStatusesData = await apiRequest('Caricamento linked kanban statuses', '/api/kanban-status', 'get', { kanban_chain_id: kanbanStatusChainId});
            setLinkedStatuses(linkedStatusesData);

       } catch (error) {

       }
    };


   const handleStatusOrderChange = (kanbanStatusId, newOrder) => {
         setStatusOrder(prevStatusOrder => ({
              ...prevStatusOrder,
                [kanbanStatusId]: newOrder,
          }));
       };


       const handleUpdateStatusOrder = async (kanbanStatusId) => {
        try {
          const kanbanStatus = linkedStatuses.find(linked => linked.id === parseInt(kanbanStatusId,10));
          let name = "";
            if(kanbanStatus && kanbanStatus.kanban_chain_statuses) {
                const chainStatus = kanbanStatus.kanban_chain_statuses.find(item => item.kanban_status_id === parseInt(kanbanStatusId,10))
                if(chainStatus){
                    name = chainStatus.name;
                }
            }
          await apiRequest('Aggiornamento ordine kanban status',`/api/kanban-chain-status/${kanbanStatusId}`, 'put', {
                order: statusOrder[kanbanStatusId],
                name: name + "A"
             });
           const linkedStatusesData = await apiRequest('Caricamento linked kanban statuses', '/api/kanban-status', 'get', { kanban_chain_id: kanbanStatusChainId});
          setLinkedStatuses(linkedStatusesData);
     
      } catch (error) {
     console.log(error);
      }
     };


    return (
        <Box p={4}>
           <Heading mb={4}>{isEditing ? t('Modifica Kanban Status Chain') : t('Aggiungi Kanban Status Chain')}</Heading>
            <form onSubmit={handleChainSubmit}>
                <FormControl mb={4}>
                    <FormLabel>{t('name')}</FormLabel>
                   <Input
                        type="text"
                        value={chainName}
                        onChange={(e) => setChainName(e.target.value)}
                        required
                   />
                </FormControl>
              <Button colorScheme="teal" type="submit" isLoading={loading}>{isEditing ? t('Salva modifiche') : t('Aggiungi')}</Button>
            </form>

            {isEditing && (
                <Box mt={4}>
                     <Heading size="md" mb={4}>{t('manageLinkedStatuses')}</Heading>
                     <Flex mb={4} align="center">
                       <FormControl maxW="200px" mr={2}>
                         <Select
                                placeholder="Seleziona un Kanban Status"
                                 value={selectedStatus}
                               onChange={(e) => setSelectedStatus(e.target.value)}
                         >
                             {availableStatuses
                                .filter(status => !linkedStatuses.find(linked => linked.id === status.id))
                                   .map((status) => (
                                      <option key={status.id} value={status.id}>
                                           {status.name}
                                       </option>
                                  ))}
                           </Select>
                     </FormControl>
                      <Button
                            colorScheme="teal"
                           size="sm"
                           onClick={handleAddStatus}
                           isLoading={loading}
                         >
                           <AddIcon mr={2} />
                           {t('linkStatus')}
                        </Button>
                 </Flex>
                   <Box overflowX="auto">
                       <Table variant="striped" colorScheme="gray">
                          <Thead>
                                <Tr>
                                     <Th>ID</Th>
                                    <Th>{t('name')}</Th>
                                    <Th>Color</Th>
                                    <Th>{t('order')}</Th>
                                    <Th>{t('actions')}</Th>
                                </Tr>
                           </Thead>
                            <Tbody>
                                {linkedStatuses.map((status) => (
                                  <Tr key={status.id}>
                                     <Td>{status.id}</Td>
                                        <Td>{status.name}</Td>
                                         <Td>{status.color}</Td>
                                           <Td>
                                             <Flex alignItems="center">
                                                <NumberInput
                                                      maxW={100}
                                                       min={1}
                                                       value={statusOrder[status.id] || 1}
                                                      onChange={(value) => handleStatusOrderChange(status.id, value)}
                                                   >
                                                   <NumberInputField />
                                               </NumberInput>
                                                 <Button
                                                       size="sm"
                                                        colorScheme="teal"
                                                       onClick={() => handleUpdateStatusOrder(status.id)}
                                                          ml={2}
                                                        isLoading={loading}
                                                   >
                                                        Aggiorna
                                                    </Button>
                                           </Flex>
                                         </Td>
                                       <Td>
                                             <IconButton
                                                  icon={<DeleteIcon />}
                                                  colorScheme="red"
                                                  size="sm"
                                                 onClick={() => handleUnlinkStatus(status.id)}
                                                   isLoading={loading}
                                                  aria-label={'Unlink Status'}
                                           />
                                       </Td>
                                  </Tr>
                                  ))}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default KanbanStatusChainForm;
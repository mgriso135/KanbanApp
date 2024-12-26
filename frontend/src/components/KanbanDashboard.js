import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  useToast,
  Select
} from '@chakra-ui/react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const KanbanDashboard = () => {
  const [clienti, setClienti] = useState([]);
  const [fornitori, setFornitori] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedFornitore, setSelectedFornitore] = useState('');
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const clientiResult = await axios.get('/api/clienti');
            setClienti(clientiResult.data);
            const fornitoriResult = await axios.get('/api/fornitori');
            setFornitori(fornitoriResult.data);
        } catch (error) {
           toast({
             title: 'Errore durante il caricamento dei dati',
            description: 'Si è verificato un errore durante il caricamento dei clienti e/o dei fornitori.',
             status: 'error',
             duration: 5000,
             isClosable: true,
         });
        }
    };

    fetchData();
  }, [toast]);

  return (
      <Box p={4}>
            <Heading mb={4}>Dashboard</Heading>

            <Box mb={4}>
                <Heading size="md">Clienti</Heading>
                 <Flex align="center">
                    <Box mr={2}>
                        <Select placeholder="Seleziona un cliente" value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)}>
                        {clienti.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>{cliente.ragione_sociale}</option>
                            ))}
                        </Select>
                    </Box>
                    {selectedCliente &&
                        <Link to={`/clienti/${selectedCliente}`}>
                            <Button colorScheme="teal" ml={2}>Visualizza Kanban</Button>
                         </Link>
                     }
                 </Flex>
            </Box>

            <Box>
                <Heading size="md">Fornitori</Heading>
                <Flex align="center">
                    <Box mr={2}>
                        <Select placeholder="Seleziona un fornitore" value={selectedFornitore} onChange={(e) => setSelectedFornitore(e.target.value)}>
                        {fornitori.map((fornitore) => (
                            <option key={fornitore.id} value={fornitore.id}>{fornitore.ragione_sociale}</option>
                            ))}
                        </Select>
                    </Box>
                    {selectedFornitore &&
                        <Link to={`/fornitori/${selectedFornitore}`}>
                            <Button colorScheme="teal" ml={2}>Visualizza Kanban</Button>
                        </Link>
                    }
                </Flex>
            </Box>
      </Box>
  );
};

export default KanbanDashboard;
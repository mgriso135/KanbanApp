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


const ClientiList = () => {
    const [clienti, setClienti] = useState([]);
     const toast = useToast();


    useEffect(() => {
        const fetchClienti = async () => {
            try {
                const response = await axios.get('/api/clienti');
                setClienti(response.data);
            } catch (error) {
               toast({
                    title: 'Errore durante il caricamento dei clienti',
                     description: 'Si è verificato un errore durante il caricamento della lista dei clienti.',
                   status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchClienti();
    }, [toast]);

    return (
        <Box p={4}>
            <Flex mb={4} align="center">
                <Heading>Lista Clienti</Heading>
                <Spacer/>
                  <Link to="/aggiungi-cliente">
                      <Button colorScheme="teal">Aggiungi Cliente</Button>
                 </Link>
            </Flex>
            <Box overflowX="auto">
                 <Table variant="striped" colorScheme="gray">
                     <Thead>
                         <Tr>
                            <Th>ID</Th>
                             <Th>Ragione Sociale</Th>
                            <Th>Partita IVA</Th>
                           <Th>Modifica</Th>
                         </Tr>
                     </Thead>
                     <Tbody>
                     {clienti.map((cliente) => (
                           <Tr key={cliente.id}>
                               <Td>{cliente.id}</Td>
                               <Td>{cliente.ragione_sociale}</Td>
                                <Td>{cliente.partita_iva}</Td>
                               <Td>
                                 <Link to={`/aggiungi-cliente/${cliente.id}`}>
                                    <Button size="sm" colorScheme="teal">Modifica</Button>
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

export default ClientiList;
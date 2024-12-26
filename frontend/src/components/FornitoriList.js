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


const FornitoriList = () => {
    const [fornitori, setFornitori] = useState([]);
    const toast = useToast();


    useEffect(() => {
        const fetchFornitori = async () => {
            try {
                const response = await axios.get('/api/fornitori');
                setFornitori(response.data);
            } catch (error) {
                 toast({
                  title: 'Errore durante il caricamento dei fornitori',
                    description: 'Si è verificato un errore durante il caricamento della lista dei fornitori.',
                    status: 'error',
                   duration: 5000,
                    isClosable: true,
                 });
            }
        };

        fetchFornitori();
    }, [toast]);

    return (
        <Box p={4}>
            <Flex mb={4} align="center">
                 <Heading>Lista Fornitori</Heading>
                 <Spacer/>
                     <Link to="/aggiungi-fornitore">
                         <Button colorScheme="teal">Aggiungi Fornitore</Button>
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
                    {fornitori.map((fornitore) => (
                        <Tr key={fornitore.id}>
                           <Td>{fornitore.id}</Td>
                            <Td>{fornitore.ragione_sociale}</Td>
                            <Td>{fornitore.partita_iva}</Td>
                             <Td>
                               <Link to={`/aggiungi-fornitore/${fornitore.id}`}>
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

export default FornitoriList;
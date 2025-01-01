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

const ProductList = () => {
    const [prodotti, setProdotti] = useState([]);
     const toast = useToast();
       const { t } = useTranslation();

    useEffect(() => {
        const fetchProdotti = async () => {
            try {
                const response = await axios.get('/api/prodotti');
                setProdotti(response.data);
            } catch (error) {
               toast({
                    title: 'Errore durante il caricamento dei prodotti',
                     description: 'Si è verificato un errore durante il caricamento della lista dei prodotti.',
                   status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchProdotti();
    }, [toast]);

    return (
        <Box p={4}>
            <Flex mb={4} align="center">
                <Heading>{t('product')}</Heading>
                 <Spacer/>
                <Link to="/aggiungi-prodotto">
                    <Button colorScheme="teal">{t('createProduct')}</Button>
                </Link>
           </Flex>
            <Box overflowX="auto">
                <Table variant="striped" colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th>Codice Prodotto</Th>
                           <Th>Descrizione</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {prodotti.map((prodotto) => (
                        <Tr key={prodotto.codice_prodotto}>
                           <Td>{prodotto.codice_prodotto}</Td>
                           <Td>{prodotto.descrizione}</Td>
                        </Tr>
                    ))}
                   </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default ProductList;
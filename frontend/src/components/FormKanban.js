import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Select,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const FormKanban = () => {
    const [clienti, setClienti] = useState([]);
    const [fornitori, setFornitori] = useState([]);
    const [prodotti, setProdotti] = useState([]);
    const [clienteId, setClienteId] = useState('');
    const [prodottoCodice, setProdottoCodice] = useState('');
    const [fornitoreId, setFornitoreId] = useState('');
    const [quantita, setQuantita] = useState('');
    const [tipoContenitore, setTipoContenitore] = useState('');
    const [numCartellini, setNumCartellini] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientiResult = await axios.get('/api/clienti');
                setClienti(clientiResult.data);
                const fornitoriResult = await axios.get('/api/fornitori');
                setFornitori(fornitoriResult.data);
                const prodottiResult = await axios.get('/api/prodotti');
                setProdotti(prodottiResult.data);
            } catch (error) {
                toast({
                    title: 'Errore durante il caricamento dei dati',
                    description: 'Si è verificato un errore durante il caricamento dei clienti, fornitori o prodotti.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchData();
    }, [toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/kanban', {
                cliente_id: parseInt(clienteId, 10),
                prodotto_codice: prodottoCodice,
                fornitore_id: parseInt(fornitoreId, 10),
                quantita: parseInt(quantita, 10),
                tipo_contenitore: tipoContenitore,
                num_cartellini: parseInt(numCartellini, 10),
            });
            toast({
                title: 'Kanban creati',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate('/'); // Navigate to dashboard after form submission
        } catch (error) {
            toast({
                title: 'Errore durante la creazione del kanban',
                description: 'Si è verificato un errore durante la creazione dei kanban.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={4}>
            <Heading mb={4}>Aggiungi Kanban</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl mb={4}>
                    <FormLabel>Cliente</FormLabel>
                    <Select placeholder="Seleziona un cliente" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
                        {clienti.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>{cliente.ragione_sociale}</option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Prodotto</FormLabel>
                    <Select placeholder="Seleziona un prodotto" value={prodottoCodice} onChange={(e) => setProdottoCodice(e.target.value)} required>
                        {prodotti.map((prodotto) => (
                            <option key={prodotto.codice_prodotto} value={prodotto.codice_prodotto}>{prodotto.descrizione}</option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Fornitore</FormLabel>
                    <Select placeholder="Seleziona un fornitore" value={fornitoreId} onChange={(e) => setFornitoreId(e.target.value)} required>
                         {fornitori.map((fornitore) => (
                             <option key={fornitore.id} value={fornitore.id}>{fornitore.ragione_sociale}</option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Quantità per cartellino</FormLabel>
                    <Input type="number" value={quantita} onChange={(e) => setQuantita(e.target.value)} required />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Tipo Contenitore</FormLabel>
                    <Input type="text" value={tipoContenitore} onChange={(e) => setTipoContenitore(e.target.value)} required />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Numero di cartellini da creare</FormLabel>
                    <Input type="number" value={numCartellini} onChange={(e) => setNumCartellini(e.target.value)} required />
                </FormControl>
                <Button colorScheme="teal" type="submit">Aggiungi</Button>
            </form>
        </Box>
    );
};

export default FormKanban;
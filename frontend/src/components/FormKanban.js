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
import axios from '../utils/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const FormKanban = () => {
    const { kanbanId } = useParams();
    const [clienti, setClienti] = useState([]);
    const [fornitori, setFornitori] = useState([]);
    const [prodotti, setProdotti] = useState([]);
    const [clienteId, setClienteId] = useState('');
    const [prodottoCodice, setProdottoCodice] = useState('');
    const [fornitoreId, setFornitoreId] = useState('');
    const [quantita, setQuantita] = useState('');
    const [tipoContenitore, setTipoContenitore] = useState('');
    const [numCartellini, setNumCartellini] = useState('');
    const [leadTime, setLeadTime] = useState('');
    const toast = useToast();
    const navigate = useNavigate();
     const [isEditing, setIsEditing] = useState(false);
     const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientiResult = await axios.get('/api/clienti');
                setClienti(clientiResult.data);
                const fornitoriResult = await axios.get('/api/fornitori');
                setFornitori(fornitoriResult.data);
                const prodottiResult = await axios.get('/api/prodotti');
                setProdotti(prodottiResult.data);
                if (kanbanId) {
                    setIsEditing(true);
                     const kanbanResult = await axios.get(`/api/kanban`);
                     const kanban = kanbanResult.data.find(k => k.id === parseInt(kanbanId,10))
                    if(kanban){
                           setClienteId(kanban.cliente_id);
                           setProdottoCodice(kanban.prodotto_codice);
                            setFornitoreId(kanban.fornitore_id);
                           setQuantita(kanban.quantita);
                          setTipoContenitore(kanban.tipo_contenitore);
                          setLeadTime(kanban.lead_time);
                    }
                    else{
                          toast({
                              title: 'Kanban non trovato',
                             status: 'error',
                             duration: 3000,
                              isClosable: true,
                         });
                         navigate('/');
                   }
                } else {
                    setIsEditing(false);
                     setClienteId('');
                     setProdottoCodice('');
                     setFornitoreId('');
                     setQuantita('');
                      setTipoContenitore('');
                     setNumCartellini('');
                     setLeadTime('');
                }
            } catch (error) {
                toast({
                    title: 'Errore durante il caricamento dei dati',
                    description: 'Si è verificato un errore durante il caricamento dei dati per il kanban',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/');
            }
        };

        fetchData();
    }, [kanbanId, toast, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                cliente_id: parseInt(clienteId, 10),
                prodotto_codice: prodottoCodice,
                fornitore_id: parseInt(fornitoreId, 10),
                quantita: parseInt(quantita, 10),
                tipo_contenitore: tipoContenitore,
                lead_time: parseInt(leadTime, 10)
             };
           if(isEditing){
               await axios.put(`/api/kanban/${kanbanId}`, payload);
              toast({
                title: 'Kanban modificato',
                status: 'success',
               duration: 3000,
                isClosable: true,
           });
            } else{
               payload.num_cartellini = parseInt(numCartellini,10)
               await axios.post('/api/kanban', payload);
                toast({
                    title: 'Kanban creato',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            navigate('/');
        } catch (error) {
              toast({
                  title: `Errore durante ${isEditing ? 'la modifica' : 'la creazione'} del kanban`,
                description: `Si è verificato un errore durante ${isEditing ? 'la modifica' : 'la creazione'} del kanban`,
                   status: 'error',
                 duration: 5000,
                  isClosable: true,
              });
        }
    };

    return (
        <Box p={4}>
            <Heading mb={4}>{isEditing ? t('Modifica Kanban') : t('Aggiungi Kanban')}</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl mb={4}>
                    <FormLabel>{t('client')}</FormLabel>
                    <Select placeholder={t('selectClient')} value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
                        {clienti.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>{cliente.ragione_sociale}</option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>{t('product')}</FormLabel>
                    <Select placeholder={t('selectProduct')} value={prodottoCodice} onChange={(e) => setProdottoCodice(e.target.value)} required>
                        {prodotti.map((prodotto) => (
                            <option key={prodotto.codice_prodotto} value={prodotto.codice_prodotto}>{prodotto.descrizione}</option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>{t('supplier')}</FormLabel>
                    <Select placeholder={t('selectSupplier')} value={fornitoreId} onChange={(e) => setFornitoreId(e.target.value)} required>
                         {fornitori.map((fornitore) => (
                             <option key={fornitore.id} value={fornitore.id}>{fornitore.ragione_sociale}</option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>{t('quantity')}</FormLabel>
                    <Input type="number" value={quantita} onChange={(e) => setQuantita(e.target.value)} required />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>{t('type')}</FormLabel>
                    <Input type="text" value={tipoContenitore} onChange={(e) => setTipoContenitore(e.target.value)} required />
                </FormControl>
                 <FormControl mb={4}>
                    <FormLabel>{t('leadTime')}</FormLabel>
                     <Input type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} required />
                </FormControl>
                {!isEditing && (
                    <FormControl mb={4}>
                       <FormLabel>{t('numberOfCards')}</FormLabel>
                        <Input type="number" value={numCartellini} onChange={(e) => setNumCartellini(e.target.value)} required />
                   </FormControl>
                )}
                <Button colorScheme="teal" type="submit">{isEditing ? 'Salva modifiche' : t('Aggiungi')}</Button>
            </form>
        </Box>
    );
};

export default FormKanban;
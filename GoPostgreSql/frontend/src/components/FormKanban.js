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
    const [kanbanChains, setKanbanChains] = useState([]);
    const [kanbanChainId, setKanbanChainId] = useState('');
    const [numCartellini, setNumCartellini] = useState('');
    const toast = useToast();
    const navigate = useNavigate();
     const [isEditing, setIsEditing] = useState(false);
     const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const kanbanChainResult = await axios.get('/api/kanban-chain');
                setKanbanChains(kanbanChainResult.data);
                if (kanbanId) {
                    setIsEditing(true);
                     const kanbanResult = await axios.get(`/api/kanban`);
                     const kanban = kanbanResult.data.find(k => k.id === parseInt(kanbanId,10))
                    if(kanban){
                         setKanbanChainId(kanban.kanban_chain_id);
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
                     setKanbanChainId('');
                     setNumCartellini('');
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
                kanban_chain_id: parseInt(kanbanChainId, 10),
            };
            if(isEditing){
               await axios.put(`/api/kanban/${kanbanId}`, payload);
               toast({
                 title: 'Kanban modificato',
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
             });
            } else {
              payload.num_cartellini = parseInt(numCartellini, 10)
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
                   <FormLabel>Kanban Chain</FormLabel>
                   <Select placeholder="Seleziona una Kanban Chain" value={kanbanChainId} onChange={(e) => setKanbanChainId(e.target.value)} required>
                       {kanbanChains.map((kanbanChain) => (
                           <option key={kanbanChain.id} value={kanbanChain.id}>{kanbanChain.name}</option>
                       ))}
                   </Select>
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
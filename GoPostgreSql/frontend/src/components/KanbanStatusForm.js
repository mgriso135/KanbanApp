import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
     FormHelperText
} from '@chakra-ui/react';
import axios from '../utils/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SketchPicker } from 'react-color';


const KanbanStatusForm = () => {
    const { kanbanStatusId, kanbanChainId } = useParams();
    const [name, setName] = useState('');
    const [color, setColor] = useState('#ffffff');
    const toast = useToast();
    const navigate = useNavigate();
     const [isEditing, setIsEditing] = useState(false);
    const { t } = useTranslation();

     useEffect(() => {
        const fetchData = async () => {
            try {
                 if (kanbanStatusId) {
                    setIsEditing(true);
                     const kanbanStatusResult = await axios.get(`/api/kanban-status`);
                     const kanbanStatus = kanbanStatusResult.data.find(k => k.id === parseInt(kanbanStatusId,10))
                    if(kanbanStatus){
                           setName(kanbanStatus.name);
                          setColor(kanbanStatus.color);
                    }
                     else{
                        toast({
                           title: 'Kanban Status non trovato',
                            status: 'error',
                           duration: 3000,
                            isClosable: true,
                        });
                         navigate('/');
                   }
                 } else {
                    setIsEditing(false);
                      setName('');
                     setColor('#ffffff');
                  }
            } catch (error) {
                toast({
                    title: 'Errore durante il caricamento dei dati',
                    description: 'Si è verificato un errore durante il caricamento dei dati per il kanban status',
                    status: 'error',
                   duration: 5000,
                    isClosable: true,
                });
                 navigate('/');
            }
        };

        fetchData();
    }, [kanbanStatusId, toast, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
         try {
             const payload = {
               name: name,
               color: color,
           };
           if(kanbanChainId){
               payload.kanban_chain_id = parseInt(kanbanChainId, 10)
            }
           if(isEditing){
                 await axios.put(`/api/kanban-status/${kanbanStatusId}`, payload);
                 toast({
                     title: 'Kanban Status modificato',
                    status: 'success',
                     duration: 3000,
                     isClosable: true,
                 });
            } else {
                await axios.post('/api/kanban-status', payload);
                 toast({
                    title: 'Kanban Status creato',
                     status: 'success',
                     duration: 3000,
                     isClosable: true,
                 });
            }

            navigate('/kanban-status-list');
        } catch (error) {
             toast({
                title: `Errore durante ${isEditing ? 'la modifica' : 'la creazione'} del kanban status`,
                 description: `Si è verificato un errore durante ${isEditing ? 'la modifica' : 'la creazione'} del kanban status.`,
                  status: 'error',
                  duration: 5000,
                 isClosable: true,
             });
        }
    };

     const handleChangeColor = (color) => {
        setColor(color.hex);
     };

    return (
        <Box p={4}>
            <Heading mb={4}>{isEditing ? t('Modifica Kanban Status') : t('Aggiungi Kanban Status')}</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl mb={4}>
                    <FormLabel>{t('name')}</FormLabel>
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </FormControl>
               <FormControl mb={4}>
                  <FormLabel>Color</FormLabel>
                   <SketchPicker color={color} onChange={handleChangeColor} />
                    <FormHelperText>Select a color for the status</FormHelperText>
              </FormControl>
                <Button colorScheme="teal" type="submit">{isEditing ? 'Salva modifiche' : t('Aggiungi')}</Button>
            </form>
       </Box>
    );
};

export default KanbanStatusForm;
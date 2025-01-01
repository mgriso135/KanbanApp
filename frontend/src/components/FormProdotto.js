import React, { useState } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
} from '@chakra-ui/react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FormProdotto = () => {
  const [codiceProdotto, setCodiceProdotto] = useState('');
  const [descrizione, setDescrizione] = useState('');
    const [leadTime, setLeadTime] = useState('');
    const toast = useToast();
    const navigate = useNavigate();
    const { t } = useTranslation();

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await axios.post('/api/prodotti', {
              codice_prodotto: codiceProdotto,
              descrizione: descrizione,
               lead_time: parseInt(leadTime, 10)
          });
            toast({
                title: 'Prodotto creato',
                status: 'success',
               duration: 3000,
                isClosable: true,
           });
          navigate('/'); // Navigate to dashboard after form submission
      } catch (error) {
            toast({
                title: 'Errore durante la creazione del prodotto',
                 description: 'Si è verificato un errore durante la creazione del prodotto.',
                status: 'error',
                duration: 5000,
               isClosable: true,
            });
      }
  };


  return (
        <Box p={4}>
          <Heading mb={4}>{t('createProduct')}</Heading>
          <form onSubmit={handleSubmit}>
              <FormControl mb={4}>
                  <FormLabel>Codice Prodotto</FormLabel>
                  <Input type="text" value={codiceProdotto} onChange={(e) => setCodiceProdotto(e.target.value)} required />
               </FormControl>
               <FormControl mb={4}>
                  <FormLabel>Descrizione</FormLabel>
                  <Input type="text" value={descrizione} onChange={(e) => setDescrizione(e.target.value)} required />
              </FormControl>
              <FormControl mb={4}>
                  <FormLabel>Lead Time</FormLabel>
                   <Input type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} required />
               </FormControl>
              <Button colorScheme="teal" type="submit">{t('add')}</Button>
          </form>
       </Box>
   );
};

export default FormProdotto;
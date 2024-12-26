import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const FormFornitore = () => {
  const { fornitoreId } = useParams();
  const [ragioneSociale, setRagioneSociale] = useState('');
  const [indirizzo, setIndirizzo] = useState('');
  const [partitaIva, setPartitaIva] = useState('');
  const [codiceSdi, setCodiceSdi] = useState('');
  const toast = useToast();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
      const fetchFornitore = async () => {
        if (fornitoreId) {
           setIsEditing(true);
          try {
              const response = await axios.get(`/api/fornitori`);
              const fornitore = response.data.find(c => c.id === parseInt(fornitoreId, 10));

            if (fornitore) {
                   setRagioneSociale(fornitore.ragione_sociale);
                  setIndirizzo(fornitore.indirizzo);
                   setPartitaIva(fornitore.partita_iva);
                   setCodiceSdi(fornitore.codice_sdi);
                 }
            else{
               toast({
                  title: 'Fornitore non trovato',
                  status: 'error',
                 duration: 3000,
                    isClosable: true,
                });
                 navigate('/');
            }
           } catch (error) {
                toast({
                  title: 'Errore durante il caricamento del fornitore',
                   description: 'Si è verificato un errore durante il caricamento dei dati del fornitore.',
                   status: 'error',
                  duration: 5000,
                  isClosable: true,
                 });
                 navigate('/');
            }
        }
      };

        fetchFornitore();
    }, [fornitoreId, toast, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
             const payload = {
                ragione_sociale: ragioneSociale,
                indirizzo: indirizzo,
                partita_iva: partitaIva,
                codice_sdi: codiceSdi
            };
            if(isEditing){
                await axios.put(`/api/fornitori/${fornitoreId}`, payload);
                toast({
                    title: 'Fornitore modificato',
                    status: 'success',
                   duration: 3000,
                   isClosable: true,
                });
            } else {
                await axios.post('/api/fornitori', payload);
                toast({
                    title: 'Fornitore creato',
                   status: 'success',
                   duration: 3000,
                   isClosable: true,
                });
            }
          navigate('/');
        } catch (error) {
            toast({
              title: `Errore durante ${isEditing ? 'la modifica' : 'la creazione'} del fornitore`,
               description: `Si è verificato un errore durante ${isEditing ? 'la modifica' : 'la creazione'} del fornitore.`,
               status: 'error',
              duration: 5000,
              isClosable: true,
            });
        }
    };


  return (
      <Box p={4}>
          <Heading mb={4}>{isEditing ? 'Modifica Fornitore' : 'Aggiungi Fornitore'}</Heading>
          <form onSubmit={handleSubmit}>
              <FormControl mb={4}>
                  <FormLabel>Ragione Sociale</FormLabel>
                  <Input type="text" value={ragioneSociale} onChange={(e) => setRagioneSociale(e.target.value)} required />
              </FormControl>
              <FormControl mb={4}>
                  <FormLabel>Indirizzo</FormLabel>
                  <Input type="text" value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)} required />
              </FormControl>
               <FormControl mb={4}>
                  <FormLabel>Partita IVA</FormLabel>
                 <Input type="text" value={partitaIva} onChange={(e) => setPartitaIva(e.target.value)} required />
              </FormControl>
              <FormControl mb={4}>
                  <FormLabel>Codice SDI</FormLabel>
                 <Input type="text" value={codiceSdi} onChange={(e) => setCodiceSdi(e.target.value)} required />
              </FormControl>
              <Button colorScheme="teal" type="submit">{isEditing ? 'Salva modifiche' : 'Aggiungi'}</Button>
          </form>
      </Box>
  );
};

export default FormFornitore;
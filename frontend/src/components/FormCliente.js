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
import axios from '../utils/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';

const FormCliente = () => {
  const { clienteId } = useParams();
  const [ragioneSociale, setRagioneSociale] = useState('');
  const [indirizzo, setIndirizzo] = useState('');
  const [partitaIva, setPartitaIva] = useState('');
  const [codiceSdi, setCodiceSdi] = useState('');
  const toast = useToast();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
      const fetchCliente = async () => {
          if (clienteId) {
              setIsEditing(true);
              try {
                  const response = await axios.get(`/api/clienti`);
                  const cliente = response.data.find(c => c.id === parseInt(clienteId, 10));
                if (cliente) {
                      setRagioneSociale(cliente.ragione_sociale);
                       setIndirizzo(cliente.indirizzo);
                      setPartitaIva(cliente.partita_iva);
                      setCodiceSdi(cliente.codice_sdi);
                  }
                 else{
                      toast({
                          title: 'Cliente non trovato',
                          status: 'error',
                         duration: 3000,
                          isClosable: true,
                     });
                       navigate('/');
                 }
              } catch (error) {
                  toast({
                     title: 'Errore durante il caricamento del cliente',
                      description: 'Si è verificato un errore durante il caricamento dei dati del cliente.',
                     status: 'error',
                      duration: 5000,
                      isClosable: true,
                 });
                  navigate('/');
              }
          } else {
            setIsEditing(false);
            setRagioneSociale('');
            setIndirizzo('');
            setPartitaIva('');
            setCodiceSdi('');
         }
        };

          fetchCliente();
     }, [clienteId, toast, navigate]);


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
                 await axios.put(`/api/clienti/${clienteId}`, payload);
                 toast({
                     title: 'Cliente modificato',
                     status: 'success',
                     duration: 3000,
                     isClosable: true,
                  });
            } else {
                 await axios.post('/api/clienti', payload);
                   toast({
                      title: 'Cliente creato',
                       status: 'success',
                       duration: 3000,
                       isClosable: true,
                  });
            }

            navigate('/');
       } catch (error) {
             toast({
                 title: `Errore durante ${isEditing ? 'la modifica' : 'la creazione'} del cliente`,
                description: `Si è verificato un errore durante ${isEditing ? 'la modifica' : 'la creazione'} del cliente.`,
                 status: 'error',
                 duration: 5000,
                 isClosable: true,
            });
        }
  };

  return (
      <Box p={4}>
          <Heading mb={4}>{isEditing ? 'Modifica Cliente' : 'Aggiungi Cliente'}</Heading>
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

export default FormCliente;
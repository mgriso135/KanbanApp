import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Select,
    useToast,
    Flex,
    Text
} from '@chakra-ui/react';
import axios from '../utils/axiosConfig';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const KanbanChainForm = () => {
  const { fornitoreId, clienteId, prodottoId, kanbanChainId } = useParams();
  const [name, setName] = useState('');
  const [fornitori, setFornitori] = useState([]);
  const [clienti, setClienti] = useState([]);
  const [prodotti, setProdotti] = useState([]);
    const [statusChains, setStatusChains] = useState([]);
  const [selectedFornitore, setSelectedFornitore] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedProdotto, setSelectedProdotto] = useState('');
    const [selectedStatusChain, setSelectedStatusChain] = useState('');
    const [leadTime, setLeadTime] = useState('');
    const [quantita, setQuantita] = useState('');
    const [tipoContenitore, setTipoContenitore] = useState('');
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
                 const statusChainResult = await axios.get('/api/kanban-status-chain');
                 setStatusChains(statusChainResult.data);
                if (kanbanChainId) {
                    setIsEditing(true);
                     const kanbanChainResult = await axios.get(`/api/kanban-chain/${kanbanChainId}`);
                     const kanbanChain = kanbanChainResult.data.find(k => k.id === parseInt(kanbanChainId,10))
                    if(kanbanChain){
                           setName(kanbanChain.name);
                           setSelectedCliente(kanbanChain.cliente_id);
                            setSelectedFornitore(kanbanChain.fornitore_id);
                            setSelectedProdotto(kanbanChain.prodotto_codice);
                           setLeadTime(kanbanChain.lead_time);
                           setQuantita(kanbanChain.quantita);
                           setTipoContenitore(kanbanChain.tipo_contenitore);
                           setSelectedStatusChain(kanbanChain.kanban_statuschain_id)
                    }
                    else{
                          toast({
                              title: 'Kanban Chain non trovato',
                             status: 'error',
                             duration: 3000,
                              isClosable: true,
                         });
                         navigate('/');
                   }
                } else {
                    setIsEditing(false);
                     setName('');
                     setSelectedCliente('');
                     setSelectedFornitore('');
                     setSelectedProdotto('');
                     setLeadTime('');
                     setQuantita('');
                      setTipoContenitore('');
                      setSelectedStatusChain('')
                }
            } catch (error) {
                toast({
                    title: 'Errore durante il caricamento dei dati',
                    description: 'Si è verificato un errore durante il caricamento dei dati per la kanban chain',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/');
            }
        };

        fetchData();
    }, [kanbanChainId, toast, navigate]);


  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const payload = {
              name: name,
              cliente_id: parseInt(selectedCliente, 10),
               prodotto_codice: selectedProdotto,
               fornitore_id: parseInt(selectedFornitore, 10),
               lead_time: parseInt(leadTime,10),
               quantita: parseInt(quantita, 10),
               tipo_contenitore: tipoContenitore,
               kanban_statuschain_id: parseInt(selectedStatusChain, 10)
          };
          if(isEditing){
              await axios.put(`/api/kanban-chain/${kanbanChainId}`, payload);
                toast({
                    title: 'Kanban Chain modificata',
                    status: 'success',
                   duration: 3000,
                   isClosable: true,
              });
          }else {
            await axios.post('/api/kanban-chain', payload);
             toast({
                    title: 'Kanban Chain creata',
                    status: 'success',
                    duration: 3000,
                   isClosable: true,
             });
        }
         navigate('/kanban-chain-list');
      } catch (error) {
            toast({
                title: `Errore durante ${isEditing ? 'la modifica' : 'la creazione'} del kanban chain`,
                description: `Si è verificato un errore durante ${isEditing ? 'la modifica' : 'la creazione'} del kanban chain.`,
                status: 'error',
               duration: 5000,
               isClosable: true,
          });
       }
  };

  return (
      <Box p={4}>
          <Heading mb={4}>{isEditing ? t('Modifica Kanban Chain') : t('Aggiungi Kanban Chain')}</Heading>
          <form onSubmit={handleSubmit}>
              <FormControl mb={4}>
                  <FormLabel>{t('name')}</FormLabel>
                  <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </FormControl>
               <FormControl mb={4}>
                   <FormLabel>{t('client')}</FormLabel>
                   <Select placeholder={t('selectClient')} value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)} required>
                       {clienti.map((cliente) => (
                           <option key={cliente.id} value={cliente.id}>{cliente.ragione_sociale}</option>
                       ))}
                   </Select>
               </FormControl>
              <FormControl mb={4}>
                   <FormLabel>{t('product')}</FormLabel>
                   <Select placeholder={t('selectProduct')} value={selectedProdotto} onChange={(e) => setSelectedProdotto(e.target.value)} required>
                       {prodotti.map((prodotto) => (
                            <option key={prodotto.codice_prodotto} value={prodotto.codice_prodotto}>{prodotto.descrizione}</option>
                       ))}
                   </Select>
               </FormControl>
               <FormControl mb={4}>
                   <FormLabel>{t('supplier')}</FormLabel>
                   <Select placeholder={t('selectSupplier')} value={selectedFornitore} onChange={(e) => setSelectedFornitore(e.target.value)} required>
                         {fornitori.map((fornitore) => (
                           <option key={fornitore.id} value={fornitore.id}>{fornitore.ragione_sociale}</option>
                        ))}
                   </Select>
               </FormControl>
                 <FormControl mb={4}>
                    <FormLabel>{t('leadTime')}</FormLabel>
                     <Input type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} required />
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
                    <FormLabel>Kanban Status Chain</FormLabel>
                  <Flex alignItems="center">
                       <Select placeholder="Seleziona una Kanban Status Chain" value={selectedStatusChain} onChange={(e) => setSelectedStatusChain(e.target.value)} required>
                            {statusChains.map((statusChain) => (
                                <option key={statusChain.id} value={statusChain.id}>{statusChain.name}</option>
                            ))}
                        </Select>
                        <Link to="/aggiungi-kanban-status-chain">
                           <Button size="sm" colorScheme="teal" ml={2} >Aggiungi</Button>
                        </Link>
                  </Flex>
                 </FormControl>
              <Button colorScheme="teal" type="submit">{isEditing ? 'Salva modifiche' : t('Aggiungi')}</Button>
          </form>
      </Box>
  );
};

export default KanbanChainForm;
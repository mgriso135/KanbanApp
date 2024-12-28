import React from 'react';
import {
    Box,
    Text,
    Flex,
    Spacer,
    Badge
} from '@chakra-ui/react';
import { QRCodeCanvas } from 'qrcode.react';

const KanbanCard = ({ kanban, children }) => {
    const qrCodeValue = `kanbanId:${kanban.id}`; //Genera un qr code contente l'id del kanban.

    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
            <Flex align="center" mb={2}>
                <Text fontWeight="bold">ID: {kanban.id} - {kanban.prodotto?.descrizione}</Text>
                <Spacer/>
              <Badge colorScheme={kanban.stato === 'Attivo' ? 'green' : kanban.stato === 'Svuotato' ? 'red' : 'yellow'}>{kanban.stato}</Badge>
            </Flex>
           
            <Flex>
                <Text fontSize="sm" color="gray.600">Cliente: {kanban.cliente?.ragione_sociale}</Text>
            </Flex>
           <Flex>
            <Text fontSize="sm" color="gray.600">Fornitore: {kanban.fornitore?.ragione_sociale}</Text>
            </Flex>
            <Flex>
               <Text fontSize="sm" color="gray.600">Quantità: {kanban.quantita} - Tipo: {kanban.tipo_contenitore}</Text>
            </Flex>
           <Flex>
            <Text fontSize="xs" color="gray.400">Aggiornato: {new Date(kanban.data_aggiornamento).toLocaleString()}</Text>
             </Flex>
            <Box mt={2}>
                {children}
                <QRCodeCanvas value={qrCodeValue} size={80} level="H" />
            </Box>
        </Box>
    );
};

export default KanbanCard;
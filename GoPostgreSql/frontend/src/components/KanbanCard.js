import React from 'react';
import {
    Box,
    Text,
    Flex,
    Spacer,
    Badge,
	Button
} from '@chakra-ui/react';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axiosConfig';


const KanbanCard = ({ kanban, children, showQrCode, dashboard }) => {
    const { t } = useTranslation();
    const qrCodeValue = `kanbanId:${kanban.id}`; //Genera un qr code contente l'id del kanban.

    const handleStatusChange = async () => {
        try {
           const response =  await axios.put(`/api/kanban/${kanban.id}/stato`);
           if (response.data.status) {
                kanban.stato = response.data.status
           }

        } catch (error) {
            console.error("Error updating Kanban status:", error)
        }
    };
    const isStatusActionable = () => {
       if (kanban.kanban_chain && kanban.kanban_chain.kanban_statuses) {
            const currentStatus = kanban.kanban_chain.kanban_statuses.find(status => status.name === kanban.stato);
            if(currentStatus){
              return currentStatus.dashboard === dashboard
            }
       }
        return false;
    };

    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
            <Flex align="center" mb={2}>
                <Text fontWeight="bold">ID: {kanban.id} - {kanban.kanban_chain?.prodotto?.descrizione}</Text>
                <Spacer/>
              <Badge colorScheme={kanban.stato === 'Attivo' ? 'green' : kanban.stato === 'Svuotato' ? 'red' : 'yellow'}>{kanban.stato}</Badge>
            </Flex>
            <Flex>
                <Text fontSize="sm" color="gray.600">{t('customer')}: {kanban.kanban_chain?.cliente?.ragione_sociale}</Text>
            </Flex>
           <Flex>
            <Text fontSize="sm" color="gray.600">{t('provider')}: {kanban.kanban_chain?.fornitore?.ragione_sociale}</Text>
            </Flex>
            <Flex>
               <Text fontSize="sm" color="gray.600">{t('quantity')}: {kanban.kanban_chain?.quantita} - {t('type')}: {kanban.kanban_chain?.tipo_contenitore} - {t('leadTime')}: {kanban.kanban_chain?.leadTime}</Text>
            </Flex>
           <Flex>
            <Text fontSize="xs" color="gray.400"> {t('lastUpdate')}: {new Date(kanban.data_aggiornamento).toLocaleString()}</Text>
             </Flex>
           {showQrCode &&  <Box mt={2}>
                {children}
				 {isStatusActionable() &&
                    <Button colorScheme="teal" onClick={handleStatusChange} mt={2} >Change status</Button>
                  }
                <QRCodeCanvas value={qrCodeValue} size={80} level="H" />
            </Box>}
           {!showQrCode &&
               <Box mt={2}>
                  {children}
				   {isStatusActionable() &&
                    <Button colorScheme="teal" onClick={handleStatusChange} mt={2} >Change status</Button>
                  }
               </Box>
           }
        </Box>
    );
};

export default KanbanCard;
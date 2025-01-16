import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormCliente from './FormCliente';
import FormFornitore from './FormFornitore';
import FormProdotto from './FormProdotto';
import FormKanban from './FormKanban';
import KanbanDashboard from './KanbanDashboard';
import ClienteDashboard from './ClienteDashboard';
import FornitoreDashboard from './FornitoreDashboard';
import KanbanHistory from './KanbanHistory';
import ClientiList from './ClientiList';
import FornitoriList from './FornitoriList';
import KanbanList from './KanbanList';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import ProductList from './ProductList';
import KanbanChainList from './KanbanChainList';
import KanbanChainForm from './KanbanChainForm';
import KanbanStatusList from './KanbanStatusList';
import KanbanStatusForm from './KanbanStatusForm';
import KanbanChainStatusManagement from './KanbanChainStatusManagement';
import KanbanStatusChainForm from './KanbanStatusChainForm';
import KanbanStatusChainList from './KanbanStatusChainList';

const NavBar = () => {
   const { t } = useTranslation();

  return (
      <Router>
        <Box bg="gray.800" color="white" px={4}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <Heading as="h1" size="lg">
                <Link to="/">{t('appTitle')}</Link>
            </Heading>
            <Flex alignItems={'center'}>
            <LanguageSelector/>
              <Menu>
                <MenuButton as={Button} colorScheme="teal">
                   {t('add')}
                </MenuButton>
                <MenuList bg="gray.700">
                 <MenuItem as={Link} to="/clienti-list" bg="gray.700">
                   Gestione Clienti
                  </MenuItem>
                  <MenuItem as={Link} to="/fornitori-list" bg="gray.700">
                   Gestione Fornitori
                  </MenuItem>
                   <MenuItem as={Link} to="/kanban-chain-list" bg="gray.700">
                      Gestione Kanban Chain
                   </MenuItem>
                  <MenuItem as={Link} to="/kanban-status-list" bg="gray.700">
                        Gestione Kanban Status
                  </MenuItem>
                  <MenuItem as={Link} to="/aggiungi-prodotto" bg="gray.700">
                    Prodotto
                  </MenuItem>
                    <MenuItem as={Link} to="/kanban-list" bg="gray.700">
                       {t('kanbanList')}
                    </MenuItem>
                  <MenuItem as={Link} to="/aggiungi-kanban" bg="gray.700">
                   {t('kanban')}
                  </MenuItem>
                  <MenuItem as={Link} to="/kanban-history" bg="gray.700">
                    {t('kanbanHistory')}
                  </MenuItem>
                  <MenuItem as={Link} to="/kanban-status-chain-list" bg="gray.700">
                     Gestione Kanban Status Chain
                   </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
        </Box>
        <Routes>
            <Route path="/" element={<KanbanDashboard />} />
            <Route path="/clienti/:clienteId" element={<ClienteDashboard />} />
            <Route path="/fornitori/:fornitoreId" element={<FornitoreDashboard />} />
            <Route path="/aggiungi-cliente" element={<FormCliente />} />
             <Route path="/aggiungi-cliente/:clienteId" element={<FormCliente />} />
             <Route path="/aggiungi-fornitore" element={<FormFornitore />} />
             <Route path="/aggiungi-fornitore/:fornitoreId" element={<FormFornitore />} />
            <Route path="/aggiungi-prodotto" element={<FormProdotto />} />
            <Route path="/aggiungi-kanban" element={<FormKanban />} />
            <Route path="/aggiungi-kanban/:kanbanId" element={<FormKanban />} />
            <Route path="/kanban-history" element={<KanbanHistory />} />
            <Route path="/clienti-list" element={<ClientiList />} />
            <Route path="/fornitori-list" element={<FornitoriList />} />
             <Route path="/kanban-list" element={<KanbanList />} />
            <Route path="/prodotti-list" element={<ProductList />} />
             <Route path="/kanban-chain-list" element={<KanbanChainList />} />
             <Route path="/aggiungi-kanban-chain" element={<KanbanChainForm />} />
             <Route path="/aggiungi-kanban-chain/:kanbanChainId" element={<KanbanChainForm />} />
              <Route path="/kanban-status-list" element={<KanbanStatusList />} />
             <Route path="/aggiungi-kanban-status" element={<KanbanStatusForm />} />
                <Route path="/aggiungi-kanban-status/:kanbanStatusId" element={<KanbanStatusForm />} />
                 <Route path="/aggiungi-kanban-status/:kanbanChainId" element={<KanbanStatusForm />} />
                <Route path="/aggiungi-kanban-status/:kanbanStatusId/:kanbanChainId" element={<KanbanStatusForm />} />
                <Route path="/kanban-chain-status-management/:kanbanChainId" element={<KanbanChainStatusManagement />} />
              <Route path="/aggiungi-kanban-status-chain" element={<KanbanStatusChainForm />} />
              <Route path="/aggiungi-kanban-status-chain/:kanbanStatusChainId" element={<KanbanStatusChainForm />} />
           <Route path="/kanban-status-chain-list" element={<KanbanStatusChainList />} />

        </Routes>
      </Router>
  );
};

export default NavBar;
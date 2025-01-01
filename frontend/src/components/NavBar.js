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
                    {t('client')}
                  </MenuItem>
                  <MenuItem as={Link} to="/fornitori-list" bg="gray.700">
                    {t('supplier')}
                  </MenuItem>
                  <MenuItem as={Link} to="/aggiungi-prodotto" bg="gray.700">
                    {t('product')}
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
        </Routes>
      </Router>
  );
};

export default NavBar;
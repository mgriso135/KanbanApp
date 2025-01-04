import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import NavBar from './components/NavBar';
import KanbanDashboard from './components/KanbanDashboard';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';


function App() {
  const { ready } = useTranslation()

  if (!ready) return <Box>Loading Translations</Box>;

  return (
    <I18nextProvider i18n={i18n}>
      <ChakraProvider>
        <Box>
          <NavBar/>
          <KanbanDashboard />
        </Box>
      </ChakraProvider>
    </I18nextProvider>
  );
}

export default App;
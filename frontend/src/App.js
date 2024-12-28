import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import NavBar from './components/NavBar';
import KanbanDashboard from './components/KanbanDashboard';

function App() {
  return (
    <ChakraProvider>
      <Box>
        <NavBar/>
        <KanbanDashboard />
      </Box>
    </ChakraProvider>
  );
}

export default App;
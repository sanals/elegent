import { Box } from '@mui/material';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { ProductProvider } from './context/ProductContext';
import { CustomThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes';

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <Router>
        <ProductProvider>
          <Box className="app" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box
              component="main"
              className="main-content"
              sx={{
                flexGrow: 1,
                pt: 2,
                px: { xs: 2, sm: 3 }
              }}
            >
              <AppRoutes />
            </Box>
            <Footer />
          </Box>
        </ProductProvider>
      </Router>
    </CustomThemeProvider>
  );
};

export default App; 
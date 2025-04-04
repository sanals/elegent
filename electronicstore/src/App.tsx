import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes';
import { ProductProvider } from './context/ProductContext';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <ProductProvider>
        <Box className="app">
          <Navbar />
          <Box component="main" className="main-content">
            <AppRoutes />
          </Box>
          <Footer />
        </Box>
      </ProductProvider>
    </Router>
  );
};

export default App; 
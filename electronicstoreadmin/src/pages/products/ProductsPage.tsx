import { Container } from '@mui/material';
import React from 'react';
import ProductList from '../../components/products/ProductList';

const ProductsPage: React.FC = () => {
  return (
    <Container>
      <ProductList />
    </Container>
  );
};

export default ProductsPage;

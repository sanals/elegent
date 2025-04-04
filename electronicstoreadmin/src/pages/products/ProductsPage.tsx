import { Container } from '@mui/material';
import React from 'react';
import ProductListV2 from '../../components/products/ProductListV2';

const ProductsPage: React.FC = () => {
  return (
    <Container>
      <ProductListV2 />
    </Container>
  );
};

export default ProductsPage; 
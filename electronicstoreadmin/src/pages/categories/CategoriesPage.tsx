import { Container } from '@mui/material';
import React from 'react';
import CategoryListV2 from '../../components/categories/CategoryListV2';

const CategoriesPage: React.FC = () => {
  return (
    <Container>
      <CategoryListV2 />
    </Container>
  );
};

export default CategoriesPage; 
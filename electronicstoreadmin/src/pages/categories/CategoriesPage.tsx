import { Container } from '@mui/material';
import React from 'react';
import CategoryList from '../../components/categories/CategoryList';

const CategoriesPage: React.FC = () => {
  return (
    <Container>
      <CategoryList />
    </Container>
  );
};

export default CategoriesPage; 
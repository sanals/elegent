import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

const ProductListingPage: React.FC = () => {
  const { filteredProducts } = useProducts();

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        All Products
      </Typography>
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductListingPage; 
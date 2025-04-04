import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Box,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { 
    filteredProducts, 
    setFilter, 
    categories, 
    loading, 
    error,
    fetchProducts 
  } = useProducts();
  const [categoryName, setCategoryName] = useState<string>('');
  const [initialFilterApplied, setInitialFilterApplied] = useState(false);

  // Memoize the filtering function to prevent unnecessary re-renders
  const applyFilter = useCallback(() => {
    if (categoryId && !initialFilterApplied) {
      const categoryIdNum = parseInt(categoryId, 10);
      setFilter(categoryIdNum);
      setInitialFilterApplied(true);
    }
  }, [categoryId, setFilter, initialFilterApplied]);

  // Apply filter once when component mounts or categoryId changes
  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  // Update category name when categories are loaded
  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const categoryIdNum = parseInt(categoryId, 10);
      const category = categories.find(c => c.id === categoryIdNum);
      if (category) {
        setCategoryName(category.name);
      }
    }
  }, [categoryId, categories]);

  return (
    <Container maxWidth="lg" sx={{ 
      px: { xs: 1, sm: 2, md: 3 },
      mx: 'auto'
    }}>
      <Box sx={{ my: { xs: 2, sm: 3, md: 4 } }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" color="inherit">
            Home
          </MuiLink>
          <Typography color="text.primary">{categoryName || 'Category'}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Category Header with Image */}
      <Box sx={{ mb: 4, position: 'relative' }}>
        {categories.length > 0 && categoryId && (
          <Box sx={{ 
            position: 'relative',
            height: { xs: '150px', md: '200px' },
            borderRadius: 2,
            overflow: 'hidden',
            mb: 3
          }}>
            <Box
              component="img"
              src={
                categories.find(c => c.id === parseInt(categoryId))?.imageUrl || 
                `https://picsum.photos/800/300?random=${categoryId}`
              }
              alt={categoryName}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              p: 2
            }}>
              <Typography 
                variant="h4" 
                component="h1" 
                color="white"
                sx={{
                  textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
                }}
              >
                {categoryName || 'Products'}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <button 
            onClick={() => {
              setInitialFilterApplied(false);
              applyFilter();
            }} 
            style={{ marginTop: '1rem' }}
          >
            Try Again
          </button>
        </Box>
      ) : (
        <Grid 
          container 
          spacing={{ xs: 1, sm: 2, md: 3 }}
          justifyContent="center"
        >
          {filteredProducts.map((product) => (
            <Grid 
              item 
              key={product.id} 
              xs={12} 
              sm={6} 
              md={4}
            >
              <ProductCard product={product} />
            </Grid>
          ))}
  
          {filteredProducts.length === 0 && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
              No products found in this category.
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default CategoryPage; 
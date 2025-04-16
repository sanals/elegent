import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink,
  Paper,
  Typography
} from '@mui/material';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductImageCarousel } from '../components';
import { useProductDetails } from '../hooks/useProductDetails';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProductDetails(id);

  // Show loading state while fetching product
  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Show error message if product couldn't be loaded
  if (error || !product) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          {error || "Product not found"}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <MuiLink component={Link} to="/" color="primary">
            Return to Home
          </MuiLink>
        </Box>
      </Container>
    );
  }

  // Get category name and ID
  const categoryName = product.category ? product.category.name : 'Uncategorized';
  const categoryId = product.category ? product.category.id : null;

  return (
    <Container maxWidth="lg" sx={{
      px: { xs: 1, sm: 2, md: 3 },
      mx: 'auto'
    }}>
      <Box sx={{ my: { xs: 2, sm: 3, md: 4 } }}>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            display: { xs: 'none', sm: 'flex' }
          }}
        >
          <MuiLink component={Link} to="/" color="inherit">
            Home
          </MuiLink>
          {categoryId && (
            <MuiLink
              component={Link}
              to={`/category/${categoryId}`}
              color="inherit"
            >
              {categoryName}
            </MuiLink>
          )}
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>
      </Box>

      <Grid
        container
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="center"
      >
        <Grid item xs={12} md={6}>
          {/* Replace the existing image display with our new ProductImageCarousel */}
          <ProductImageCarousel
            images={product.images}
            productName={product.name}
            aspectRatio="75%"
            showControls={true}
            showIndicators={true}
            enableModal={true}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: { xs: 1, md: 2 }
            }}
          >
            {product.name}
          </Typography>

          <Typography
            variant="h5"
            color="text.primary"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              mb: { xs: 2, md: 3 }
            }}
          >
            ₹{product.price.toFixed(2)}
          </Typography>

          <Paper
            elevation={1}
            sx={{
              p: { xs: 1.5, md: 2.5 },
              mb: { xs: 2, md: 3 }
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
            >
              {product.description}
            </Typography>

            {/* Display Category */}
            {categoryId && (
              <Typography
                variant="body2"
                color="text.primary"
                component={Link}
                to={`/category/${categoryId}`}
                sx={{
                  display: 'block',
                  mt: 2,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Category: {categoryName}
              </Typography>
            )}
          </Paper>

          <Paper
            elevation={1}
            sx={{
              p: { xs: 1.5, md: 2.5 },
              mb: { xs: 2, md: 3 }
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              Specifications
            </Typography>
            <List disablePadding>
              {/* Stock Status */}
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <ListItemText
                  primary="Stock Status"
                  secondary={
                    <Typography
                      variant="body2"
                      color={product.stock > 0 ? "success.main" : "error.main"}
                      sx={{ fontWeight: 'medium' }}
                    >
                      {product.stock > 0
                        ? `${product.stock} units available`
                        : 'Out of stock'}
                    </Typography>
                  }
                />
              </ListItem>

              {/* Category */}
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <ListItemText
                  primary="Category"
                  secondary={
                    <Typography
                      component={Link}
                      to={`/category/${categoryId}`}
                      color="text.primary"
                      variant="body2"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {categoryName}
                    </Typography>
                  }
                />
              </ListItem>

              {/* Map all the specification key-value pairs */}
              {(() => {
                // Parse specifications if they're a string
                let specs = product.specifications;
                if (typeof specs === 'string') {
                  try {
                    specs = JSON.parse(specs);
                  } catch (e) {
                    console.error('Failed to parse specifications:', e);
                    specs = { "Error": "Invalid specification format" };
                  }
                }

                // Handle both object and string formats
                return Object.entries(specs || {}).map(([key, value]) => (
                  <ListItem key={key} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={key}
                      secondary={String(value)}
                    />
                  </ListItem>
                ));
              })()}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage; 
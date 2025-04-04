import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  Box,
  IconButton,
  Link as MuiLink,
  Breadcrumbs,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useProducts } from '../context/ProductContext';
import ImageModal from '../components/ImageModal';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageSwitch = () => {
    setIsLoading(true);
  };

  React.useEffect(() => {
    handleImageSwitch();
  }, [currentImageIndex]);

  // Find product by ID, converting string to number
  const product = products.find(p => p.id === (id ? Number(id) : null));

  if (!product) {
    return (
      <Container>
        <Typography variant="h5" color="error">Product not found</Typography>
      </Container>
    );
  }

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

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
          <Box sx={{ 
            position: 'relative',
            paddingTop: '75%',
            backgroundColor: 'grey.100',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {isLoading && (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }}>
                <CircularProgress />
              </Box>
            )}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            >
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.name} - view ${currentImageIndex + 1}`}
                onLoad={handleImageLoad}
                style={{ 
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center center',
                  cursor: 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                  transition: 'opacity 0.3s'
                }}
                onClick={handleImageClick}
              />
            </Box>
            {product.images.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.8)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.8)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </>
            )}
          </Box>
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1 }, 
            mt: { xs: 1, sm: 2 }, 
            justifyContent: 'center' 
          }}>
            {product.images.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: index === currentImageIndex ? 'primary.main' : 'grey.300',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </Box>
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
            color="primary"
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              mb: { xs: 2, md: 3 } 
            }}
          >
            ${product.price.toFixed(2)}
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
                color="primary"
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
                      color="primary"
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
                return Object.entries(specs).map(([key, value]) => (
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

      {/* Image modal for fullscreen view */}
      <ImageModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={product.images}
        initialIndex={currentImageIndex}
        title={product.name}
      />
    </Container>
  );
};

export default ProductDetailPage; 
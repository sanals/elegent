import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Box, 
  CardMedia,
  IconButton,
  Paper,
  CircularProgress,
  Pagination
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight,
  Download,
  LocationOn
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import Button from '../components/Button';
import { locations } from '../data/locations';
import ProductCard from '../components/ProductCard';

// Category images mapping
const categoryImages: Record<string, string> = {
  'Fans': 'https://picsum.photos/800/600?random=10',
  'Lighting': 'https://picsum.photos/800/600?random=11',
  'Electrical Supplies': 'https://picsum.photos/800/600?random=12',
  'Tools': 'https://picsum.photos/800/600?random=13'
};

const AUTOPLAY_DELAY = 5000; // 5 seconds

const HomePage: React.FC = () => {
  const { 
    products, 
    categories,
    loading, 
    error,
    totalPages,
    currentPage, 
    setPage,
    fetchProducts
  } = useProducts();
  
  const featuredProducts = products.slice(0, 5); // Get first 5 products as featured
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  
  // Function to handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchProducts(searchQuery);
    }
  };

  // Handle search input keypress
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Auto-slide functionality
  useEffect(() => {
    if (featuredProducts.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === featuredProducts.length - 1 ? 0 : prev + 1
      );
    }, AUTOPLAY_DELAY);

    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? featuredProducts.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => 
      prev === featuredProducts.length - 1 ? 0 : prev + 1
    );
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1); // API pages are 0-indexed
  };

  const states = Object.keys(locations);
  const cities = selectedState ? Object.keys(locations[selectedState as keyof typeof locations]) : [];
  const localities = selectedState && selectedCity ? 
    locations[selectedState as keyof typeof locations][selectedCity] : [];

  return (
    <Container maxWidth="lg" sx={{ 
      px: { xs: 1, sm: 2, md: 3 },
      mx: 'auto'
    }}>
      {/* Featured Products Slider */}
      {loading && featuredProducts.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button onClick={() => fetchProducts()} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Box>
      ) : featuredProducts.length > 0 ? (
        <Box sx={{ 
          position: 'relative',
          mb: 6,
          mt: 2,
          height: { xs: '200px', sm: '300px', md: '400px' }
        }}>
          <Paper 
            elevation={3}
            sx={{ 
              position: 'relative',
              height: '100%',
              overflow: 'hidden',
              borderRadius: 2
            }}
          >
            {featuredProducts.map((product, index) => (
              <Box
                key={product.id}
                component={Link}
                to={`/product/${product.id}`}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: currentSlide === index ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <CardMedia
                  component="img"
                  image={product.images.length > 0 ? product.images[0] : 'https://picsum.photos/800/600?random=1'}
                  alt={product.name}
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
                  p: 2,
                  color: 'white'
                }}>
                  <Typography variant="h5" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body1">
                    ${product.price.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))}
            
            <IconButton
              onClick={handlePrevSlide}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.8)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
              }}
            >
              <ChevronLeft />
            </IconButton>
            
            <IconButton
              onClick={handleNextSlide}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.8)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
              }}
            >
              <ChevronRight />
            </IconButton>

            {/* Dot indicators */}
            <Box sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1
            }}>
              {featuredProducts.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                    transition: 'background-color 0.3s'
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      ) : null}

      {/* Categories Section */}
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          my: 4, 
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        Shop by Category
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {categories.filter(cat => cat.status === 'ACTIVE').map((category) => (
          <Grid item xs={6} sm={4} md={3} key={category.id}>
            <Card 
              component={Link} 
              to={`/category/${category.id}`}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)'
                },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={category.imageUrl || `https://picsum.photos/400/300?random=${category.id}`}
                alt={category.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" sx={{ textAlign: 'center' }}>
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Store Message Section */}
      <Box sx={{ 
        textAlign: 'center', 
        my: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 }
      }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
          }}
        >
          Your Trusted Source for Quality Electronics
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3,
            fontSize: { xs: '1rem', md: '1.1rem' },
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          With over 10,000 products and 15 years of experience, we offer the best selection of electronic components and devices for professionals and hobbyists alike.
        </Typography>
      </Box>
        
      {/* Latest Products Section */}
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          mb: 4, 
          mt: 6,
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        Latest Products
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button onClick={() => fetchProducts()} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage + 1} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}

      {/* Location Section */}
      <Box sx={{ 
        textAlign: 'center', 
        my: { xs: 4, md: 6 },
        py: 6,
        bgcolor: 'grey.100',
        borderRadius: 2
      }}>
        <LocationOn sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            mb: 3
          }}
        >
          LOCATE OUR NEAREST OFFICE
        </Typography>
        <Grid container spacing={2} maxWidth="md" sx={{ mx: 'auto', px: 2 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ width: '100%' }}>
              <select 
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('');
                }}
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ width: '100%' }}>
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: !selectedState ? '#f5f5f5' : 'white'
                }}
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ width: '100%' }}>
              <select 
                disabled={!selectedCity}
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: !selectedCity ? '#f5f5f5' : 'white'
                }}
              >
                <option value="">Select Locality</option>
                {localities.map(locality => (
                  <option key={locality} value={locality}>
                    {locality}
                  </option>
                ))}
              </select>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage; 
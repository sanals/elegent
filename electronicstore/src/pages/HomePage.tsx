import {
  ChevronLeft,
  ChevronRight,
  LocationOn,
  Phone
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Link as MuiLink,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { OutletLocation, OutletService } from '../services/outlet.service';

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
    fetchProducts,
    featuredProducts,
    latestProducts,
    loadingFeatured,
    loadingLatest,
    fetchFeaturedProducts,
    fetchLatestProducts
  } = useProducts();

  // Use dedicated featured products for carousel
  const [currentSlide, setCurrentSlide] = useState(0);

  // Outlet location state
  const [selectedStateId, setSelectedStateId] = useState<number | ''>('');
  const [selectedCityId, setSelectedCityId] = useState<number | ''>('');
  const [selectedLocalityId, setSelectedLocalityId] = useState<number | ''>('');
  const [states, setStates] = useState<Array<{ id: number; name: string }>>([]);
  const [cities, setCities] = useState<Array<{ id: number; name: string }>>([]);
  const [localities, setLocalities] = useState<Array<{ id: number; name: string; pincode: string }>>([]);
  const [outlets, setOutlets] = useState<OutletLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<OutletLocation | null>(null);

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

  // Auto-slide functionality for featured products carousel
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

  // Load states from API
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingLocations(true);
      try {
        const response = await OutletService.getStatesWithOutlets();
        if (response.status === 'SUCCESS' && response.data) {
          setStates(response.data);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchStates();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (selectedStateId === '') {
      setCities([]);
      setLocalities([]);
      setSelectedCityId('');
      setSelectedLocalityId('');
      setOutlets([]);
      setSelectedOutlet(null);
      return;
    }

    const fetchCities = async () => {
      setLoadingLocations(true);
      try {
        const citiesResponse = await OutletService.getCitiesByState(selectedStateId as number);

        if (citiesResponse.status === 'SUCCESS' && citiesResponse.data) {
          setCities(citiesResponse.data);
        }

        // Clear any previously selected outlet data
        setOutlets([]);
        setSelectedOutlet(null);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchCities();
  }, [selectedStateId]);

  // Load localities when city changes
  useEffect(() => {
    if (selectedCityId === '') {
      setLocalities([]);
      setSelectedLocalityId('');
      setOutlets([]);
      setSelectedOutlet(null);
      return;
    }

    const fetchLocalities = async () => {
      setLoadingLocations(true);
      try {
        const localitiesResponse = await OutletService.getLocalitiesByCity(selectedCityId as number);

        if (localitiesResponse.status === 'SUCCESS' && localitiesResponse.data) {
          setLocalities(localitiesResponse.data);
        }

        // Clear any previously selected outlet data
        setOutlets([]);
        setSelectedOutlet(null);
      } catch (error) {
        console.error('Error fetching localities:', error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocalities();
  }, [selectedCityId]);

  // Load outlets only when locality is selected
  useEffect(() => {
    if (selectedLocalityId === '') {
      setOutlets([]);
      setSelectedOutlet(null);
      return;
    }

    const fetchOutletsByLocality = async () => {
      setLoadingLocations(true);
      try {
        const response = await OutletService.getOutletsByLocality(selectedLocalityId as number);
        if (response.status === 'SUCCESS' && response.data) {
          setOutlets(response.data);
          // Select the first outlet by default if any
          if (response.data.length > 0) {
            setSelectedOutlet(response.data[0]);
          } else {
            setSelectedOutlet(null);
          }
        }
      } catch (error) {
        console.error('Error fetching locality outlets:', error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchOutletsByLocality();
  }, [selectedLocalityId]);

  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{
      px: { xs: 1, sm: 2, md: 3 },
      mx: 'auto'
    }}>
      {/* Featured Products Slider */}
      {loadingFeatured && featuredProducts.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button onClick={() => fetchFeaturedProducts()} sx={{ mt: 2 }}>
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
                    {product?.name}
                  </Typography>
                  <Typography variant="body1">
                    ₹{product?.price?.toFixed(2)}
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
              {featuredProducts?.map((_, index) => (
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
        {Array.isArray(categories) ? (
          categories
            .filter(cat => cat && cat.status === 'ACTIVE')
            .map((category) => (
              <Grid item xs={6} sm={4} md={3} key={category?.id}>
                <Card
                  component={Link}
                  to={`/category/${category?.id}`}
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
                    image={category?.imageUrl || `https://picsum.photos/400/300?random=${category?.id}`}
                    alt={category?.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" sx={{ textAlign: 'center' }}>
                      {category?.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
        ) : (
          <Grid item xs={12}>
            <Typography textAlign="center" color="text.secondary">
              Loading categories...
            </Typography>
          </Grid>
        )}
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
          my: 4,
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        Latest Products
      </Typography>

      {loadingLatest ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button onClick={() => fetchLatestProducts()} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {latestProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Location Section */}
      <Box sx={{
        textAlign: 'center',
        my: { xs: 4, md: 6 },
        py: 6,
        bgcolor: theme => theme.palette.mode === 'dark' ? 'background.paper' : 'grey.200',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        color: 'text.primary'
      }}
        className="location-box"
      >
        <LocationOn
          sx={{
            fontSize: 40,
            color: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
            mb: 2
          }}
        />
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 3,
            color: 'text.primary'
          }}
          className="location-heading"
        >
          LOCATE OUR NEAREST OUTLET
        </Typography>

        {loadingLocations ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2} maxWidth="md" sx={{ mx: 'auto', px: 2, mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ width: '100%' }}>
                  <select
                    value={selectedStateId}
                    onChange={(e) => {
                      setSelectedStateId(e.target.value ? Number(e.target.value) : '');
                      setSelectedCityId('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : '#ccc',
                      backgroundColor: theme.palette.mode === 'dark' ? '#333' : 'white',
                      color: theme.palette.mode === 'dark' ? 'white' : 'inherit'
                    }}
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ width: '100%' }}>
                  <select
                    value={selectedCityId}
                    onChange={(e) => setSelectedCityId(e.target.value ? Number(e.target.value) : '')}
                    disabled={!selectedStateId}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : '#ccc',
                      backgroundColor: !selectedStateId
                        ? (theme.palette.mode === 'dark' ? '#222' : '#f5f5f5')
                        : (theme.palette.mode === 'dark' ? '#333' : 'white'),
                      color: theme.palette.mode === 'dark' ? 'white' : 'inherit'
                    }}
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ width: '100%' }}>
                  <select
                    value={selectedLocalityId}
                    onChange={(e) => setSelectedLocalityId(e.target.value ? Number(e.target.value) : '')}
                    disabled={!selectedCityId}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : '#ccc',
                      backgroundColor: !selectedCityId
                        ? (theme.palette.mode === 'dark' ? '#222' : '#f5f5f5')
                        : (theme.palette.mode === 'dark' ? '#333' : 'white'),
                      color: theme.palette.mode === 'dark' ? 'white' : 'inherit'
                    }}
                  >
                    <option value="">Select Locality</option>
                    {localities.map(locality => (
                      <option key={locality.id} value={locality.id}>
                        {locality.name} - {locality.pincode}
                      </option>
                    ))}
                  </select>
                </Box>
              </Grid>
            </Grid>

            {/* Show selection guidance when selections are incomplete */}
            {!selectedLocalityId && (
              <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                {!selectedStateId
                  ? 'Please select a state to begin.'
                  : !selectedCityId
                    ? 'Please select a city to continue.'
                    : 'Please select a locality to see available outlets.'}
              </Typography>
            )}

            {/* Outlet Details Display - only show when locality is selected and data is loaded */}
            {selectedOutlet && selectedLocalityId ? (
              <Box
                sx={{
                  maxWidth: 'md',
                  mx: 'auto',
                  mt: 3,
                  p: 3,
                  bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
                  borderRadius: 2,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}
              >
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {selectedOutlet.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedOutlet.address}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                  <Phone fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1">
                    {selectedOutlet.contactNumber}
                  </Typography>
                </Box>
                {selectedOutlet.openingTime && selectedOutlet.closingTime && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Open: {selectedOutlet.openingTime} - {selectedOutlet.closingTime}
                  </Typography>
                )}
                {selectedOutlet.mapUrl && (
                  <MuiLink
                    href={selectedOutlet.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      mt: 2,
                      display: 'inline-block',
                      bgcolor: 'primary.main',
                      color: 'white',
                      py: 1,
                      px: 2,
                      borderRadius: 1,
                      textDecoration: 'none',
                      fontWeight: 'medium',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                  >
                    View on Map
                  </MuiLink>
                )}
              </Box>
            ) : selectedLocalityId && outlets.length === 0 ? (
              <Typography variant="body1" sx={{ mt: 2 }}>
                No outlets found in this locality. Please select another area.
              </Typography>
            ) : null}
          </>
        )}
      </Box>
    </Container>
  );
};

export default HomePage; 
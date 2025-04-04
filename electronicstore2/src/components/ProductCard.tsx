import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  IconButton,
  Chip
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the heart icon
    setIsFavorite(!isFavorite);
  };
  
  // Use default image if no images are available
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://picsum.photos/400/300?random=1';
  
  // Format price with 2 decimal places
  const formattedPrice = `$${product.price.toFixed(2)}`;
  
  // Stock status indicator
  const lowStock = product.stock <= 5;
  const inStock = product.stock > 0;

  return (
    <Card 
      component={Link} 
      to={`/product/${product.id}`}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        },
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* Status Chip */}
      {!inStock ? (
        <Chip 
          label="Out of Stock" 
          color="error" 
          size="small" 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            left: 10, 
            zIndex: 1 
          }} 
        />
      ) : lowStock ? (
        <Chip 
          label="Low Stock" 
          color="warning" 
          size="small" 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            left: 10, 
            zIndex: 1 
          }} 
        />
      ) : null}
      
      {/* Favorite Button */}
      <IconButton 
        size="small" 
        onClick={toggleFavorite}
        sx={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          zIndex: 1,
          bgcolor: 'rgba(255,255,255,0.8)', 
          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
        }}
      >
        {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
      </IconButton>
      
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={product.name}
        sx={{ objectFit: 'contain', p: 2, bgcolor: '#f7f7f7' }}
      />
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 'medium',
            fontSize: '1.1rem',
            height: '2.4em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            {formattedPrice}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              size="small" 
              color="primary"
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <ShoppingCart fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        {product.category && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Category: {product.category.name}
          </Typography>
        )}
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 1,
            height: '2.5em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {product.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <Typography 
            variant="body2" 
            color={inStock ? "success.main" : "error.main"}
            sx={{ fontWeight: 'medium' }}
          >
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 
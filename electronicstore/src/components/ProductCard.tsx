import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import { ProductImageCarousel } from '.';
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const theme = useTheme();

  // Prepare images array, use fallback if needed
  const hasImages = product?.images && product?.images?.length > 0;
  const productImages = hasImages
    ? product.images
    : ['https://picsum.photos/400/300?random=1'];

  // Format price with 2 decimal places
  const formattedPrice = `₹${product?.price?.toFixed(2)}`;

  // Stock status indicator
  const lowStock = product?.stock <= 5;
  const inStock = product?.stock > 0;

  return (
    <Card
      component={Link}
      to={`/product/${product?.id}`}
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

      {/* Replace CardMedia with ProductImageCarousel */}
      <Box sx={{ height: 200, bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : '#f7f7f7' }}>
        <ProductImageCarousel
          images={productImages}
          productName={product?.name}
          aspectRatio="100%"
          showIndicators={false}
          enableModal={false}
          showControls={productImages.length > 1}
        />
      </Box>

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
          {product?.name}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold', width: '100%' }}>
            {formattedPrice}
          </Typography>
        </Box>

        {product?.category && (
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Category: {product?.category?.name}
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
          {product?.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <Typography
            variant="body2"
            color={inStock ? "success.main" : "error.main"}
            sx={{ fontWeight: 'medium' }}
          >
            {inStock ? `${product?.stock} in stock` : 'Out of stock'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 
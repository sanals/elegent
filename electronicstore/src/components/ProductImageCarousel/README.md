# ProductImageCarousel

A reusable React component that displays a carousel of product images with navigation controls, indicator dots, and an optional full-screen modal view.

## Features

- Displays a carousel of product images
- Smooth navigation between images with prev/next buttons
- Visual indicators showing current image position
- Loading state with spinner while images load
- Optional full-screen modal view on image click
- Fully customizable with props
- Theme-aware styling for both light and dark modes
- Responsive design for all screen sizes
- Accessibility features for better user experience

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `string[]` | Required | Array of image URLs to display in the carousel |
| `productName` | `string` | Required | Name of the product for accessibility and modal title |
| `aspectRatio` | `string` | `'75%'` | CSS value for the aspect ratio of the image container |
| `showControls` | `boolean` | `true` | Whether to show navigation controls |
| `showIndicators` | `boolean` | `true` | Whether to show indicator dots |
| `enableModal` | `boolean` | `true` | Whether to enable the fullscreen modal on image click |

## Usage Examples

### Basic Usage

```tsx
import ProductImageCarousel from '../components/ProductImageCarousel';

const ProductPage = () => {
  const product = {
    name: 'Smartphone XYZ',
    images: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg'
    ]
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <ProductImageCarousel 
        images={product.images}
        productName={product.name}
      />
    </div>
  );
};
```

### In a Product Card (Compact)

```tsx
import ProductImageCarousel from '../components/ProductImageCarousel';

const ProductCard = ({ product }) => {
  return (
    <Card>
      <Box sx={{ height: 200 }}>
        <ProductImageCarousel
          images={product.images}
          productName={product.name}
          aspectRatio="100%"
          showIndicators={false}
          enableModal={false}
        />
      </Box>
      <CardContent>
        <Typography>{product.name}</Typography>
        <Typography>{product.price}</Typography>
      </CardContent>
    </Card>
  );
};
```

### Custom Aspect Ratio

```tsx
<ProductImageCarousel 
  images={product.images}
  productName={product.name}
  aspectRatio="56.25%" // 16:9 aspect ratio
/>
```

## Dependencies

- React
- Material-UI
- ImageModal component (for full-screen view)

## Notes

- The component handles empty image arrays gracefully and returns `null`.
- For optimal performance, images should be appropriately sized and optimized.
- When using in a grid or list, consider disabling indicators or the modal view for a more compact display. 
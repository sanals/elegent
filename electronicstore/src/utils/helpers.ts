export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price * 83);
};

export const generateImagePlaceholder = (width: number, height: number): string => {
  return `https://via.placeholder.com/${width}x${height}`;
}; 
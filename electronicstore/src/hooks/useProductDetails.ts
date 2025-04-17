import { useEffect, useState } from 'react';
import { api } from '../data/api';
import { Product } from '../types/Product';

/**
 * Hook to fetch product details directly from API by ID
 * This avoids unnecessary API calls to products/featured and products/latest
 */
export const useProductDetails = (productId: string | undefined) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productId) {
                setError('Product ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const productData = await api.getProductById(productId);
                setProduct(productData);
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('Could not load product details. Please try again later.');
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    return { product, loading, error };
}; 
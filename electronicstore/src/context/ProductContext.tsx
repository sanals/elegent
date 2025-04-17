import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../data/api';
import { Page } from '../data/models';
import { Category, Product } from '../types/Product';
// Import fallback data
import { categories as fallbackCategories } from '../data/categories';
import { products as fallbackProducts } from '../data/products';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  filteredProducts: Product[];
  setFilter: (categoryId: number | null) => void;
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  fetchProducts: (keyword?: string, categoryId?: number) => Promise<void>;
  usingFallbackData: boolean;
  featuredProducts: Product[];
  latestProducts: Product[];
  loadingFeatured: boolean;
  loadingLatest: boolean;
  fetchFeaturedProducts: () => Promise<void>;
  fetchLatestProducts: () => Promise<void>;
}

const defaultContext: ProductContextType = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  filteredProducts: [],
  setFilter: () => { },
  totalProducts: 0,
  totalPages: 0,
  currentPage: 0,
  setPage: () => { },
  fetchProducts: async () => { },
  usingFallbackData: false,
  featuredProducts: [],
  latestProducts: [],
  loadingFeatured: false,
  loadingLatest: false,
  fetchFeaturedProducts: async () => { },
  fetchLatestProducts: async () => { }
};

export const ProductContext = createContext<ProductContextType>(defaultContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(false);

  // Transform fallback data to match API format
  const convertFallbackData = useCallback(() => {
    try {
      // Convert local categories to match API format
      const formattedCategories = fallbackCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.name,
        description: `${cat.name} category`,
        imageUrl: cat.imageUrl || `https://picsum.photos/400/300?random=${index + 10}`,
        status: 'ACTIVE' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      // Convert local products to match API format
      const formattedProducts = fallbackProducts.map(prod => {
        // Find the category index by name
        const catIndex = fallbackCategories.findIndex(cat => cat.name === String(prod.category));

        return {
          id: Number(prod.id),
          name: prod.name,
          description: prod.description,
          price: prod.price,
          category: formattedCategories[catIndex !== -1 ? catIndex : 0],
          specifications: prod.specifications,
          // Use the single imageUrl as the first element in images array if needed
          images: 'images' in prod && prod.images.length > 0
            ? prod.images
            : ['imageUrl' in prod ? prod.imageUrl : 'https://picsum.photos/400/300'],
          status: 'ACTIVE' as const,
          stock: 10, // Default value
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Product;
      });

      return { formattedCategories, formattedProducts };
    } catch (err) {
      console.error('Error converting fallback data:', err);
      return { formattedCategories: [], formattedProducts: [] };
    }
  }, []);

  // Define fetchProducts before it's used in any useEffect
  const fetchProducts = useCallback(async (keyword?: string, categoryId?: number) => {
    setLoading(true);
    setError(null);

    try {
      const categoryToUse = categoryId !== undefined ? categoryId : selectedCategoryId;
      const response: Page<Product> = await api.getProducts(currentPage, 10, keyword || '', categoryToUse || undefined);

      setProducts(response.content);
      setFilteredProducts(response.content);
      setTotalProducts(response.totalElements);
      setTotalPages(response.totalPages);
      setUsingFallbackData(false);

    } catch (err) {
      console.error('Error fetching products:', err);

      // Use fallback data
      const { formattedProducts } = convertFallbackData();

      // Filter products if needed
      let filteredFallbackProducts = formattedProducts;

      if (keyword) {
        filteredFallbackProducts = formattedProducts.filter(p =>
          p.name.toLowerCase().includes(keyword.toLowerCase()) ||
          p.description.toLowerCase().includes(keyword.toLowerCase())
        );
      }

      if (categoryId !== undefined || selectedCategoryId !== null) {
        const categoryIdToFilter = categoryId !== undefined ? categoryId : selectedCategoryId;
        filteredFallbackProducts = formattedProducts.filter(p => p.category.id === categoryIdToFilter);
      }

      setProducts(formattedProducts);
      setFilteredProducts(filteredFallbackProducts);
      setTotalProducts(filteredFallbackProducts.length);
      setTotalPages(1);
      setUsingFallbackData(true);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategoryId, convertFallbackData]);

  // Fetch categories on mount - categories are needed on all pages
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from API...');
        const categoriesData = await api.getCategories();
        console.log('Categories data received:', categoriesData);

        if (!categoriesData || !Array.isArray(categoriesData)) {
          console.error('Categories data is not an array, using fallback data instead');
          const { formattedCategories } = convertFallbackData();
          setCategories(formattedCategories);
          setUsingFallbackData(true);
          return;
        }

        setCategories(categoriesData);
        setUsingFallbackData(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Use fallback data
        const { formattedCategories } = convertFallbackData();
        setCategories(formattedCategories);
        setUsingFallbackData(true);
      }
    };

    fetchCategories();
  }, [convertFallbackData]);

  // Initial products fetch only when page or category changes (not on initial load)
  useEffect(() => {
    // Only fetch products if we're not on the initial state
    // or if we have a selected category or search keyword
    if (currentPage > 0 || selectedCategoryId !== null) {
      fetchProducts();
    }
  }, [currentPage, selectedCategoryId, fetchProducts]);

  // Fetch featured and latest products only on homepage
  useEffect(() => {
    if (isHomePage) {
      fetchFeaturedProducts();
      fetchLatestProducts();
    }
  }, [isHomePage]);

  const setFilter = useCallback((categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(0); // Reset to first page when changing filters

    if (usingFallbackData) {
      // Filter the fallback data locally
      const { formattedProducts } = convertFallbackData();

      if (categoryId === null) {
        setFilteredProducts(formattedProducts);
      } else {
        const filtered = formattedProducts.filter(p => p.category.id === categoryId);
        setFilteredProducts(filtered);
      }

      setTotalProducts(categoryId === null ? formattedProducts.length : formattedProducts.filter(p => p.category.id === categoryId).length);
      setTotalPages(1);
    } else {
      // Use API filtering
      if (categoryId === null) {
        fetchProducts();
      } else {
        fetchProducts(undefined, categoryId);
      }
    }
  }, [usingFallbackData, convertFallbackData, fetchProducts]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const fetchFeaturedProducts = useCallback(async () => {
    setLoadingFeatured(true);

    try {
      // Use the single API call that handles settings and fetching
      const featuredProductsData = await api.getFeaturedProductsWithSettings();
      setFeaturedProducts(featuredProductsData);
      setUsingFallbackData(false);
    } catch (err) {
      console.error('Error fetching featured products:', err);

      // Use fallback data
      const { formattedProducts } = convertFallbackData();

      // Get a reasonable number of products for fallback
      // Default to 5 if we can't get settings
      let featuredCount = 5;

      // Just use the first N products as featured for the fallback
      setFeaturedProducts(formattedProducts.slice(0, featuredCount));
      setUsingFallbackData(true);
    } finally {
      setLoadingFeatured(false);
    }
  }, [convertFallbackData]);

  const fetchLatestProducts = useCallback(async () => {
    setLoadingLatest(true);

    try {
      // Use the single API call that handles settings and fetching
      const latestProductsResponse = await api.getLatestProductsWithSettings();
      setLatestProducts(latestProductsResponse.content);
      setUsingFallbackData(false);
    } catch (err) {
      console.error('Error fetching latest products:', err);

      // Use fallback data
      const { formattedProducts } = convertFallbackData();

      // Default to 10 for fallback
      let latestCount = 10;

      // Sort by createdAt date (descending) for the fallback
      const sortedProducts = [...formattedProducts].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLatestProducts(sortedProducts.slice(0, latestCount));
      setUsingFallbackData(true);
    } finally {
      setLoadingLatest(false);
    }
  }, [convertFallbackData]);

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      loading,
      error,
      filteredProducts,
      setFilter,
      totalProducts,
      totalPages,
      currentPage,
      setPage,
      fetchProducts,
      usingFallbackData,
      featuredProducts,
      latestProducts,
      loadingFeatured,
      loadingLatest,
      fetchFeaturedProducts,
      fetchLatestProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 
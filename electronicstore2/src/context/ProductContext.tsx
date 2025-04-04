import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category } from '../types/Product';
import { api } from '../data/api';
import { Page } from '../data/models';
// Import fallback data
import { products as fallbackProducts } from '../data/products';
import { categories as fallbackCategories } from '../data/categories';

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
}

const defaultContext: ProductContextType = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  filteredProducts: [],
  setFilter: () => {},
  totalProducts: 0,
  totalPages: 0,
  currentPage: 0,
  setPage: () => {},
  fetchProducts: async () => {},
  usingFallbackData: false
};

export const ProductContext = createContext<ProductContextType>(defaultContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  
  // Transform fallback data to match API format
  const convertFallbackData = () => {
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
  };
  
  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await api.getCategories();
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
  }, []);
  
  // Initial products fetch
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);
  
  const fetchProducts = async (keyword?: string, categoryId?: number) => {
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
  };
  
  const setFilter = (categoryId: number | null) => {
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
  };
  
  const setPage = (page: number) => {
    setCurrentPage(page);
  };

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
      usingFallbackData
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
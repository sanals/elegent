import { Box, CircularProgress, Container, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { QuickActions, RecentActivity, Statistics, SystemHealth } from '../../components/dashboard';
import { ProductService } from '../../services/product.service';
import { getTimestamp } from '../../utils/date-utils';
import { showNotification } from '../../utils/notification';

// Statistics interface
interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  productsByCategory: {
    categoryName: string;
    count: number;
  }[];
}

// Product interface
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: {
    id: number;
    name: string;
    description: string;
    status?: string;
  };
  specifications: string;
  images: string[];
  status: string;
  stock: number;
  createdAt: string | any[];
  updatedAt: string | any[];
}

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [productStats, setProductStats] = useState<ProductStats>({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    productsByCategory: [],
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all products
        const response = await ProductService.getAllProducts();

        if (response && response.status === 'SUCCESS' && response.data) {
          const products = response.data.content || [];

          // Calculate stats
          const activeProducts = products.filter(p => p.status === 'ACTIVE');
          const lowStockProducts = products.filter(p => p.stock < 10);

          // Group by category
          const categoryCounts: Record<string, number> = {};
          products.forEach(product => {
            const categoryName = product.category?.name || 'Uncategorized';
            categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
          });

          const productsByCategory = Object.keys(categoryCounts).map(categoryName => ({
            categoryName,
            count: categoryCounts[categoryName],
          }));

          setProductStats({
            totalProducts: products.length,
            activeProducts: activeProducts.length,
            lowStockProducts: lowStockProducts.length,
            productsByCategory,
          });

          // Set recent products (most recently updated first)
          // Using our reusable date utility function
          const sortedProducts = [...products]
            .sort((a, b) => {
              return getTimestamp(b.updatedAt) - getTimestamp(a.updatedAt); // Most recent first
            })
            .slice(0, 5);

          setRecentProducts(sortedProducts);
        } else {
          // If no data is available, show a notification
          showNotification('Failed to fetch dashboard data', 'warning');

          // Set empty data rather than failing
          setProductStats({
            totalProducts: 0,
            activeProducts: 0,
            lowStockProducts: 0,
            productsByCategory: [],
          });
          setRecentProducts([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome to the Electronics Store Admin Dashboard.
        </Typography>
      </Box>

      <Statistics productStats={productStats} />

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <SystemHealth />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentActivity recentProducts={recentProducts} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <QuickActions />
      </Box>
    </Container>
  );
};

export default DashboardPage;

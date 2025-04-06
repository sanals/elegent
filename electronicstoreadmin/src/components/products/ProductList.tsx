import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePagedApiRequest } from '../../hooks/usePagedApiRequest';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../types/api-responses';
import { showNotification } from '../../utils/notification';
import DataTable, { Action } from '../shared/DataTable';
import PageHeader from '../shared/PageHeader';

const ProductList = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Memoize the API request function to prevent infinite rerenders
  const fetchProductsApi = useCallback(async () => {
    try {
      const response = await ProductService.getAllProducts();
      console.log("API Response:", response);
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error('Failed to fetch products');
    }
  }, []);

  // Setup paged API request hook with memoized function
  const {
    items: products,
    pagination,
    loading,
    error,
    refetch: fetchProducts
  } = usePagedApiRequest<ProductResponse, []>(
    fetchProductsApi,
    true
  );

  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const result = await ProductService.deleteProduct(selectedProduct?.id);

      if (result && result?.status === 'SUCCESS') {
        showNotification('Product deleted successfully', 'success');
        setDeleteDialogOpen(false);
        // Refetch products to update the list
        fetchProducts();
      } else {
        showNotification(`Failed to delete product: ${result?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification(`Error deleting product: ${error instanceof Error ? error?.message : 'Unknown error'}`, 'error');
    }
  };

  // Handle product status change
  const handleToggleStatus = async (product: ProductResponse) => {
    try {
      const newStatus = product?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      console.log(`Toggling product ${product?.id} status from ${product?.status} to ${newStatus}`);

      const result = await ProductService.updateProductStatus(product?.id, newStatus);

      if (result && result?.status === 'SUCCESS') {
        showNotification(`Product ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`, 'success');
        // Refetch products to ensure our state is synced with the backend
        fetchProducts();
      } else {
        showNotification(`Failed to update product status: ${result?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      showNotification(`Error updating status: ${error instanceof Error ? error?.message : 'Unknown error'}`, 'error');
    }
  };

  // Define columns for the data table
  const columns = [
    {
      id: 'name',
      label: 'Product Name',
      render: (item: ProductResponse) => (
        <Typography variant="body2" fontWeight="medium">
          {item?.name}
        </Typography>
      ),
    },
    {
      id: 'category',
      label: 'Category',
      render: (item: ProductResponse) => item?.category?.name || 'Uncategorized',
    },
    {
      id: 'price',
      label: 'Price',
      render: (item: ProductResponse) => `₹${item?.price?.toFixed(2)}`,
      align: 'right' as const,
    },
    {
      id: 'stock',
      label: 'Stock',
      render: (item: ProductResponse) => item?.stock,
      align: 'right' as const,
    },
    {
      id: 'status',
      label: 'Status',
      render: (item: ProductResponse) => (
        <Chip
          size="small"
          label={item?.status}
          color={item?.status === 'ACTIVE' ? 'success' : 'warning'}
        />
      ),
      align: 'center' as const,
    },
    {
      id: 'createdBy',
      label: 'Created By',
      render: (item: ProductResponse) => item?.createdBy || 'Unknown',
    },
    {
      id: 'updatedAt',
      label: 'Last Modified',
      render: (item: ProductResponse) => new Date(item?.updatedAt).toLocaleString(),
    },
  ];

  // Define actions for the data table
  const actions: Action<ProductResponse>[] = [
    {
      icon: (item: ProductResponse) => <EditIcon />,
      label: 'Edit Product',
      onClick: (item: ProductResponse) => {
        navigate(`/products/${item?.id}`);
      },
      color: 'primary',
    },
    {
      icon: (item: ProductResponse) => (
        item?.status === 'ACTIVE' ? <ToggleOnIcon /> : <ToggleOffIcon />
      ),
      label: 'Toggle Status',
      onClick: handleToggleStatus,
      color: (item: ProductResponse) => (
        item?.status === 'ACTIVE' ? 'success' : 'default'
      ),
    },
    {
      icon: (item: ProductResponse) => <DeleteIcon />,
      label: 'Delete Product',
      onClick: (item: ProductResponse) => {
        setSelectedProduct(item);
        setDeleteDialogOpen(true);
      },
      color: 'error',
    },
  ];

  // Debug pagination information
  console.log("Products pagination:", pagination);
  console.log("Products length:", products?.length);

  return (
    <Box>
      <PageHeader
        title="Products"
        addButtonLabel="Add Product"
        addButtonPath="/products/new"
      />

      <DataTable
        data={products}
        columns={columns}
        actions={actions}
        loading={loading}
        error={error}
        onRetry={fetchProducts}
        keyExtractor={(item) => item.id}
        emptyMessage="No products found. Add your first product to get started."
      />

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedProduct?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductList;
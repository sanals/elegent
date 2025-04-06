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
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../types/api-responses';
import { showNotification } from '../../utils/notification';
import DataTable, { Action } from '../shared/DataTable';
import PageHeader from '../shared/PageHeader';

const CategoryList = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Memoize the API request function to prevent infinite rerenders
  const fetchCategoriesApi = useCallback(async () => {
    try {
      const response = await CategoryService.getAllCategories();
      console.log("Category API Response:", response);
      return response;
    } catch (error) {
      console.error("Category API Error:", error);
      throw new Error('Failed to fetch categories');
    }
  }, []);

  // Setup paged API request hook with memoized function
  const {
    items: categories,
    pagination,
    loading,
    error,
    refetch: fetchCategories
  } = usePagedApiRequest<CategoryResponse, []>(
    fetchCategoriesApi,
    true
  );

  // Handle category deletion
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      const response = await CategoryService.deleteCategory(selectedCategory.id);

      if (response && response.status === 'SUCCESS') {
        showNotification('Category deleted successfully', 'success');
        setDeleteDialogOpen(false);
        // Refetch categories
        fetchCategories();
      } else {
        showNotification(`Failed to delete category: ${response?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showNotification(`Error deleting category: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  // Handle category status change
  const handleToggleStatus = async (category: CategoryResponse) => {
    try {
      const newStatus = category.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      console.log(`Toggling category ${category.id} status from ${category.status} to ${newStatus}`);

      // Use the dedicated method for updating category status
      const response = await CategoryService.updateCategoryStatus(category.id, newStatus);

      if (response && response.status === 'SUCCESS') {
        showNotification(`Category ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`, 'success');
        // Refetch categories to ensure our state is synced with the backend
        fetchCategories();
      } else {
        showNotification(`Failed to update category status: ${response?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error updating category status:', error);
      showNotification(`Error updating status: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  // Define columns for the data table
  const columns = [
    {
      id: 'name',
      label: 'Category Name',
      render: (item: CategoryResponse) => (
        <Typography variant="body2" fontWeight="medium">
          {item.name}
        </Typography>
      ),
    },
    {
      id: 'description',
      label: 'Description',
      render: (item: CategoryResponse) => item.description,
    },
    {
      id: 'status',
      label: 'Status',
      render: (item: CategoryResponse) => (
        <Chip
          size="small"
          label={item.status}
          color={item.status === 'ACTIVE' ? 'success' : 'warning'}
        />
      ),
      align: 'center' as const,
    },
    {
      id: 'createdBy',
      label: 'Created By',
      render: (item: CategoryResponse) => item.createdBy || 'Unknown',
    },
    {
      id: 'updatedAt',
      label: 'Last Modified',
      render: (item: CategoryResponse) => new Date(item.updatedAt).toLocaleString(),
    },
  ];

  // Define actions for the data table
  const actions: Action<CategoryResponse>[] = [
    {
      icon: (item: CategoryResponse) => <EditIcon />,
      label: 'Edit Category',
      onClick: (item: CategoryResponse) => {
        navigate(`/categories/${item.id}`);
      },
      color: 'primary',
    },
    {
      icon: (item: CategoryResponse) => (
        item.status === 'ACTIVE' ? <ToggleOnIcon /> : <ToggleOffIcon />
      ),
      label: 'Toggle Status',
      onClick: handleToggleStatus,
      color: (item: CategoryResponse) => (
        item.status === 'ACTIVE' ? 'success' : 'default'
      ),
    },
    {
      icon: (item: CategoryResponse) => <DeleteIcon />,
      label: 'Delete Category',
      onClick: (item: CategoryResponse) => {
        setSelectedCategory(item);
        setDeleteDialogOpen(true);
      },
      color: 'error',
    },
  ];

  // Debug pagination information
  console.log("Categories pagination:", pagination);
  console.log("Categories length:", categories?.length);

  return (
    <Box>
      <PageHeader
        title="Categories"
        addButtonLabel="Add Category"
        addButtonPath="/categories/new"
      />

      <DataTable
        data={categories}
        columns={columns}
        actions={actions}
        loading={loading}
        error={error}
        onRetry={fetchCategories}
        keyExtractor={(item) => item.id}
        emptyMessage="No categories found. Add your first category to get started."
      />

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedCategory?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteCategory} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CategoryList;
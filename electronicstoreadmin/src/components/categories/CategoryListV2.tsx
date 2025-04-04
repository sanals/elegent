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
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiRequest } from '../../hooks/useApiRequest';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../types/api-responses';
import { showNotification } from '../../utils/notification';
import DataTable, { Action } from '../shared/DataTable';
import PageHeader from '../shared/PageHeader';

export default function CategoryListV2() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);

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

    // Setup API request hook with memoized function
    const {
        data,
        loading,
        error,
        execute: fetchCategories
    } = useApiRequest<any, []>(
        fetchCategoriesApi,
        false
    );

    // Fetch categories on component mount
    useEffect(() => {
        console.log("Fetching categories...");
        fetchCategories();
    }, [fetchCategories]);

    // Update categories state when data changes
    useEffect(() => {
        console.log("Raw category data from API hook:", data);

        try {
            if (data) {
                // Type assertion to handle any response structure
                const responseData = data as any;

                // Try various data extraction approaches based on your API structure
                if (responseData.data && Array.isArray(responseData.data)) {
                    console.log("Found category data.data array:", responseData.data);
                    setCategories(responseData.data);
                } else if (Array.isArray(responseData)) {
                    console.log("Found category data array:", responseData);
                    setCategories(responseData);
                } else if (typeof responseData === 'object') {
                    // Last resort, try to find any array in the response
                    console.log("Searching for arrays in the response object");
                    let foundCategories = false;

                    for (const key in responseData) {
                        if (Array.isArray(responseData[key])) {
                            console.log(`Found array at data.${key}:`, responseData[key]);

                            if (responseData[key].length > 0 && responseData[key][0].id) {
                                console.log(`Using array at data.${key} as categories list`);
                                setCategories(responseData[key]);
                                foundCategories = true;
                                break;
                            }
                        } else if (typeof responseData[key] === 'object' && responseData[key] !== null) {
                            for (const nestedKey in responseData[key]) {
                                if (Array.isArray(responseData[key][nestedKey])) {
                                    console.log(`Found array at data.${key}.${nestedKey}:`, responseData[key][nestedKey]);

                                    if (responseData[key][nestedKey].length > 0 && responseData[key][nestedKey][0].id) {
                                        console.log(`Using array at data.${key}.${nestedKey} as categories list`);
                                        setCategories(responseData[key][nestedKey]);
                                        foundCategories = true;
                                        break;
                                    }
                                }
                            }

                            if (foundCategories) break;
                        }
                    }

                    if (!foundCategories) {
                        console.error("Could not find a suitable array in the response object");
                        setCategories([]);
                    }
                } else {
                    console.error("Unexpected category data structure:", responseData);
                    setCategories([]);
                }
            } else {
                console.log("No category data returned from API");
                setCategories([]);
            }
        } catch (error) {
            console.error("Error processing category API response:", error);
            setCategories([]);
        }
    }, [data]);

    // Handle category deletion
    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;

        try {
            const response = await CategoryService.deleteCategory(selectedCategory.id);

            if (response && response.status === 'SUCCESS') {
                showNotification('Category deleted successfully', 'success');
                setDeleteDialogOpen(false);
                // Remove deleted category from state
                setCategories(prev => prev.filter(c => c.id !== selectedCategory.id));
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

            // Optimistically update the UI
            setCategories(prev =>
                prev.map(c => c.id === category.id ? { ...c, status: newStatus } : c)
            );

            // Use the dedicated method for updating category status
            const response = await CategoryService.updateCategoryStatus(category.id, newStatus);

            if (response && response.status === 'SUCCESS') {
                showNotification(`Category ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`, 'success');
                // No need to update state again as we already did it optimistically

                // Refetch categories to ensure our state is synced with the backend
                setTimeout(() => {
                    fetchCategories();
                }, 1000); // Small delay to avoid race conditions
            } else {
                // Revert the optimistic update since the API call failed
                setCategories(prev =>
                    prev.map(c => c.id === category.id ? { ...c, status: category.status } : c)
                );
                showNotification(`Failed to update category status: ${response?.message || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Error updating category status:', error);
            // Revert the optimistic update since an error occurred
            setCategories(prev =>
                prev.map(c => c.id === category.id ? { ...c, status: category.status } : c)
            );
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
                    color={item.status === 'ACTIVE' ? 'success' : 'error'}
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

    // Debug the categories state
    console.log("Categories state:", categories);
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
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
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../types/api-responses';
import { showNotification } from '../../utils/notification';
import DataTable, { Action } from '../shared/DataTable';
import PageHeader from '../shared/PageHeader';

export default function ProductListV2() {
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [products, setProducts] = useState<ProductResponse[]>([]);

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

    // Setup API request hook with memoized function
    const {
        data,
        loading,
        error,
        execute: fetchProducts
    } = useApiRequest<any, []>(
        fetchProductsApi,
        false
    );

    // Fetch products on component mount
    useEffect(() => {
        console.log("Fetching products...");
        fetchProducts();
    }, [fetchProducts]);

    // Update products state when data changes
    useEffect(() => {
        console.log("Raw data from API hook:", data);

        try {
            if (data) {
                // Try various data extraction approaches based on your API structure
                if (data.data && data.data.content && Array.isArray(data.data.content)) {
                    console.log("Found data.data.content array:", data.data.content);
                    setProducts(data.data.content);
                } else if (data.data && Array.isArray(data.data)) {
                    console.log("Found data.data array:", data.data);
                    setProducts(data.data);
                } else if (Array.isArray(data)) {
                    console.log("Found data array:", data);
                    setProducts(data);
                } else if (data.content && Array.isArray(data.content)) {
                    console.log("Found data.content array:", data.content);
                    setProducts(data.content);
                } else if (typeof data === 'object') {
                    // Last resort, try to find any array in the response
                    console.log("Searching for arrays in the response object");
                    let foundProducts = false;

                    for (const key in data) {
                        if (Array.isArray(data[key])) {
                            console.log(`Found array at data.${key}:`, data[key]);

                            if (data[key].length > 0 && data[key][0].id) {
                                console.log(`Using array at data.${key} as products list`);
                                setProducts(data[key]);
                                foundProducts = true;
                                break;
                            }
                        } else if (typeof data[key] === 'object' && data[key] !== null) {
                            for (const nestedKey in data[key]) {
                                if (Array.isArray(data[key][nestedKey])) {
                                    console.log(`Found array at data.${key}.${nestedKey}:`, data[key][nestedKey]);

                                    if (data[key][nestedKey].length > 0 && data[key][nestedKey][0].id) {
                                        console.log(`Using array at data.${key}.${nestedKey} as products list`);
                                        setProducts(data[key][nestedKey]);
                                        foundProducts = true;
                                        break;
                                    }
                                }
                            }

                            if (foundProducts) break;
                        }
                    }

                    if (!foundProducts) {
                        console.error("Could not find a suitable array in the response object");
                        setProducts([]);
                    }
                } else {
                    console.error("Unexpected data structure:", data);
                    setProducts([]);
                }
            } else {
                console.log("No data returned from API");
                setProducts([]);
            }
        } catch (error) {
            console.error("Error processing API response:", error);
            setProducts([]);
        }
    }, [data]);

    // Handle product deletion
    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;

        try {
            const result = await ProductService.deleteProduct(selectedProduct.id);

            if (result && result.status === 'SUCCESS') {
                showNotification('Product deleted successfully', 'success');
                setDeleteDialogOpen(false);
                // Remove deleted product from state
                setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
                // Refetch products
                fetchProducts();
            } else {
                showNotification(`Failed to delete product: ${result?.message || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification(`Error deleting product: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    };

    // Handle product status change
    const handleToggleStatus = async (product: ProductResponse) => {
        try {
            const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            console.log(`Toggling product ${product.id} status from ${product.status} to ${newStatus}`);

            // Optimistically update the UI
            setProducts(prev =>
                prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p)
            );

            const result = await ProductService.updateProductStatus(product.id, newStatus);

            if (result && result.status === 'SUCCESS') {
                showNotification(`Product ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`, 'success');
                // No need to update state again as we already did it optimistically

                // Refetch products to ensure our state is synced with the backend
                setTimeout(() => {
                    fetchProducts();
                }, 1000); // Small delay to avoid race conditions
            } else {
                // Revert the optimistic update since the API call failed
                setProducts(prev =>
                    prev.map(p => p.id === product.id ? { ...p, status: product.status } : p)
                );
                showNotification(`Failed to update product status: ${result?.message || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Error updating product status:', error);
            // Revert the optimistic update since an error occurred
            setProducts(prev =>
                prev.map(p => p.id === product.id ? { ...p, status: product.status } : p)
            );
            showNotification(`Error updating status: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    };

    // Define columns for the data table
    const columns = [
        {
            id: 'name',
            label: 'Product Name',
            render: (item: ProductResponse) => (
                <Typography variant="body2" fontWeight="medium">
                    {item.name}
                </Typography>
            ),
        },
        {
            id: 'category',
            label: 'Category',
            render: (item: ProductResponse) => item.category?.name || 'Uncategorized',
        },
        {
            id: 'price',
            label: 'Price',
            render: (item: ProductResponse) => `₹${item.price.toFixed(2)}`,
            align: 'right' as const,
        },
        {
            id: 'stock',
            label: 'Stock',
            render: (item: ProductResponse) => item.stock,
            align: 'right' as const,
        },
        {
            id: 'status',
            label: 'Status',
            render: (item: ProductResponse) => (
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
            render: (item: ProductResponse) => item.createdBy || 'Unknown',
        },
        {
            id: 'updatedAt',
            label: 'Last Modified',
            render: (item: ProductResponse) => new Date(item.updatedAt).toLocaleString(),
        },
    ];

    // Define actions for the data table
    const actions: Action<ProductResponse>[] = [
        {
            icon: (item: ProductResponse) => <EditIcon />,
            label: 'Edit Product',
            onClick: (item: ProductResponse) => {
                navigate(`/products/${item.id}`);
            },
            color: 'primary',
        },
        {
            icon: (item: ProductResponse) => (
                item.status === 'ACTIVE' ? <ToggleOnIcon /> : <ToggleOffIcon />
            ),
            label: 'Toggle Status',
            onClick: handleToggleStatus,
            color: (item: ProductResponse) => (
                item.status === 'ACTIVE' ? 'success' : 'default'
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

    // Debug the products state
    console.log("Products state:", products);
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
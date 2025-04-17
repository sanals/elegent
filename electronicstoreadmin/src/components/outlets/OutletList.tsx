import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    ToggleOff as ToggleOffIcon,
    ToggleOn as ToggleOnIcon,
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
    Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePagedApiRequest } from '../../hooks/usePagedApiRequest';
import { OutletService } from '../../services/outlet.service';
import { OutletResponse } from '../../types/api-responses';
import { showNotification } from '../../utils/notification';
import DataTable, { Action } from '../shared/DataTable';
import PageHeader from '../shared/PageHeader';

const OutletList = () => {
  const navigate = useNavigate();
  const [selectedOutlet, setSelectedOutlet] = useState<OutletResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Memoize the API request function to prevent infinite rerenders
  const fetchOutletsApi = useCallback(async () => {
    try {
      const response = await OutletService.getAllOutlets();
      return response;
    } catch (error) {
      throw new Error('Failed to fetch outlets');
    }
  }, []);

  // Setup paged API request hook with memoized function
  const {
    items: outlets,
    pagination: _pagination,
    loading,
    error,
    refetch: fetchOutlets,
  } = usePagedApiRequest<OutletResponse, []>(fetchOutletsApi, true);

  // Handle outlet deletion
  const handleDeleteOutlet = async () => {
    if (!selectedOutlet) return;

    try {
      const result = await OutletService.deleteOutlet(selectedOutlet?.id);

      if (result && result?.status === 'SUCCESS') {
        showNotification('Outlet deleted successfully', 'success');
        setDeleteDialogOpen(false);
        // Refetch outlets to update the list
        fetchOutlets();
      } else {
        showNotification(`Failed to delete outlet: ${result?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      showNotification(
        `Error deleting outlet: ${error instanceof Error ? error?.message : 'Unknown error'}`,
        'error'
      );
    }
  };

  // Handle outlet status change
  const handleToggleStatus = async (outlet: OutletResponse) => {
    try {
      const updatedOutlet = {
        name: outlet.name,
        address: outlet.address,
        contactNumber: outlet.contactNumber,
        email: outlet.email,
        openingTime: outlet.openingTime,
        closingTime: outlet.closingTime,
        localityId: outlet.locality.id,
        active: !outlet.active,
      };

      const result = await OutletService.updateOutlet(outlet?.id, updatedOutlet);

      if (result && result?.status === 'SUCCESS') {
        showNotification(
          `Outlet ${!outlet?.active ? 'activated' : 'deactivated'} successfully`,
          'success'
        );
        // Refetch outlets to ensure our state is synced with the backend
        fetchOutlets();
      } else {
        showNotification(
          `Failed to update outlet status: ${result?.message || 'Unknown error'}`,
          'error'
        );
      }
    } catch (error) {
      showNotification(
        `Error updating status: ${error instanceof Error ? error?.message : 'Unknown error'}`,
        'error'
      );
    }
  };

  // Define columns for the data table
  const columns = [
    {
      id: 'name',
      label: 'Outlet Name',
      render: (item: OutletResponse) => (
        <Typography variant="body2" fontWeight="medium">
          {item?.name}
        </Typography>
      ),
    },
    {
      id: 'address',
      label: 'Address',
      render: (item: OutletResponse) => item?.address,
    },
    {
      id: 'contactNumber',
      label: 'Contact',
      render: (item: OutletResponse) => item?.contactNumber,
    },
    {
      id: 'location',
      label: 'Location',
      render: (item: OutletResponse) => (
        <Box>
          <Typography variant="body2">
            {item?.locality?.name}, {item?.locality?.pincode}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {item?.city?.name}, {item?.state?.name}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'timings',
      label: 'Timings',
      render: (item: OutletResponse) => {
        if (!item?.openingTime && !item?.closingTime) return 'N/A';
        return `${item?.openingTime || 'N/A'} - ${item?.closingTime || 'N/A'}`;
      },
    },
    {
      id: 'status',
      label: 'Status',
      render: (item: OutletResponse) => (
        <Chip
          size="small"
          label={item?.active ? 'Active' : 'Inactive'}
          color={item?.active ? 'success' : 'warning'}
        />
      ),
      align: 'center' as const,
    },
  ];

  // Define actions for the data table
  const actions: Action<OutletResponse>[] = [
    {
      icon: (_item: OutletResponse) => <EditIcon />,
      label: 'Edit Outlet',
      onClick: (item: OutletResponse) => {
        navigate(`/outlets/${item?.id}`);
      },
      color: 'primary',
    },
    {
      icon: (item: OutletResponse) => (item?.active ? <ToggleOnIcon /> : <ToggleOffIcon />),
      label: 'Toggle Status',
      onClick: handleToggleStatus,
      color: (item: OutletResponse) => (item?.active ? 'success' : 'default'),
    },
    {
      icon: (_item: OutletResponse) => <DeleteIcon />,
      label: 'Delete Outlet',
      onClick: (item: OutletResponse) => {
        setSelectedOutlet(item);
        setDeleteDialogOpen(true);
      },
      color: 'error',
    },
  ];

  return (
    <Box>
      <PageHeader title="Outlets" addButtonLabel="Add Outlet" addButtonPath="/outlets/new" />

      <DataTable
        data={outlets}
        columns={columns}
        actions={actions}
        loading={loading}
        error={error}
        onRetry={fetchOutlets}
        keyExtractor={item => item.id}
        emptyMessage="No outlets found. Add your first outlet to get started."
      />

      {/* Confirm Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Outlet</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedOutlet?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteOutlet} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OutletList;

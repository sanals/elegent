import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';

// Valid MUI button colors including "default"
type ButtonColor =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | 'default';

interface Column<T> {
  id: string;
  label: string;
  render: (item: T) => React.ReactNode;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

// Export Action interface for reuse
export interface Action<T> {
  icon: React.ReactNode | ((item: T) => React.ReactNode);
  label: string;
  onClick: (item: T) => void;
  color?: ButtonColor | ((item: T) => ButtonColor);
  disabled?: (item: T) => boolean;
  hide?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  keyExtractor: (item: T) => string | number;
}

/**
 * Reusable data table component for displaying entity lists with actions
 */
function DataTable<T>({
  data,
  columns,
  actions = [],
  loading = false,
  error = null,
  onRetry,
  emptyMessage = 'No data found',
  keyExtractor,
}: DataTableProps<T>) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Helper to get the icon for an action
  const getActionIcon = (action: Action<T>, item: T): React.ReactNode => {
    if (typeof action.icon === 'function') {
      return action.icon(item);
    }
    return action.icon;
  };

  // Helper to get the color for an action
  const getActionColor = (action: Action<T>, item: T): ButtonColor => {
    if (typeof action.color === 'function') {
      return action.color(item);
    }
    // If in dark mode and the color is 'primary' (usually edit icons), use 'info' for better visibility
    if (
      isDarkMode &&
      (action.color === 'primary' || action.color === undefined || action.color === 'inherit')
    ) {
      return 'info';
    }
    return action.color || 'inherit';
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: '#fff8f8' }}>
        <Typography color="error">Error: {error}</Typography>
        {onRetry && (
          <Button variant="outlined" color="primary" onClick={onRetry} sx={{ mt: 2 }}>
            Retry
          </Button>
        )}
      </Paper>
    );
  }

  // Show empty state
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {emptyMessage}
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.id} align={column.align}>
                {column.label}
              </TableCell>
            ))}
            {actions.length > 0 && <TableCell align="center">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => (
            <TableRow key={keyExtractor(item)}>
              {columns.map(column => (
                <TableCell key={`${keyExtractor(item)}-${column.id}`} align={column.align}>
                  {column.render(item)}
                </TableCell>
              ))}

              {actions.length > 0 && (
                <TableCell>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {actions.map((action, index) => {
                      // Check if the action should be hidden for this item
                      if (action.hide && action.hide(item)) {
                        return null;
                      }

                      // Get dynamic color and handle "default" color
                      const color = getActionColor(action, item);
                      // MUI IconButton doesn't accept "default" as a valid color prop
                      // Use theme default color by setting it to undefined
                      const buttonColor = color === 'default' ? undefined : color;

                      // Filter out any props that shouldn't be passed to IconButton
                      const { icon: _icon, label, onClick, color: _actionColor, ...otherActionProps } = action;
                      // Only pass valid props to IconButton
                      const validButtonProps = {
                        size: "small" as const,
                        color: buttonColor,
                        onClick: () => onClick(item),
                        disabled: otherActionProps.disabled ? otherActionProps.disabled(item) : false,
                        'aria-label': label
                      };

                      return (
                        <IconButton
                          key={index}
                          {...validButtonProps}
                        >
                          {getActionIcon(action, item)}
                        </IconButton>
                      );
                    })}
                  </Stack>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;

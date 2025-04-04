import { Card, CardContent, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import React from 'react';
import { formatDate } from '../../utils/date-utils';

interface Product {
  id: number;
  name: string;
  price: number;
  category: {
    name: string;
  };
  updatedAt: string | any[]; // Handles both string and array formats
}

interface RecentActivityProps {
  recentProducts: Product[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ recentProducts }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>

        {!recentProducts || recentProducts.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No recent activity to display
          </Typography>
        ) : (
          <List>
            {recentProducts.map((product, index) => (
              <React.Fragment key={product.id || index}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={product.name}
                    secondary={`${product.category?.name || 'Uncategorized'} - ₹${(product.price || 0).toFixed(2)} - ${formatDate(product.updatedAt)}`}
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity; 
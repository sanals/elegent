import { Add, BarChart, ViewList } from '@mui/icons-material';
import { Button, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              fullWidth
              onClick={() => navigate('/products/new')}
            >
              Add Product
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant={isDarkMode ? "contained" : "outlined"}
              color={isDarkMode ? "info" : "primary"}
              startIcon={<ViewList />}
              fullWidth
              onClick={() => navigate('/products')}
              sx={{
                borderColor: isDarkMode ? 'primary.main' : undefined,
                '&:hover': {
                  borderColor: isDarkMode ? 'primary.main' : undefined,
                }
              }}
            >
              View Products
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant={isDarkMode ? "contained" : "outlined"}
              color="secondary"
              startIcon={<BarChart />}
              fullWidth
              onClick={() => navigate('/categories')}
            >
              Manage Categories
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions; 
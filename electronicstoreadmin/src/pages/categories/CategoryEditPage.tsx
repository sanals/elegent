import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryForm } from '../../components';
import { CategoryService } from '../../services/category.service';
import { CategorySummary } from '../../types/api-responses';
import { showNotification } from '../../utils/notification';

const CategoryEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewCategory = !id || id === 'new';
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all categories for parent category dropdown
    setLoading(true);
    CategoryService.getAllCategories()
      .then(response => {
        if (response?.status === 'SUCCESS' && response.data) {
          // Extract the content array from the paginated response
          if (response.data.content && Array.isArray(response.data.content)) {
            console.log('Setting categories from paginated response content');
            setCategories(response.data.content);
          } else if (Array.isArray(response.data)) {
            console.log('Setting categories from direct array response');
            setCategories(response.data);
          } else {
            console.error('Unexpected categories response format:', response.data);
            setCategories([]);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        showNotification('Failed to load categories', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleBack = () => {
    navigate('/categories');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mr: 2 }}>
            Back to Categories
          </Button>
          <Typography variant="h4" component="h1">
            {isNewCategory ? 'Add New Category' : `Edit Category #${id}`}
          </Typography>
        </Box>

        <CategoryForm
          categories={categories}
          mode={isNewCategory ? 'create' : 'edit'}
          categoryId={!isNewCategory && id ? parseInt(id) : undefined}
        />
      </Box>
    </Container>
  );
};

export default CategoryEditPage;

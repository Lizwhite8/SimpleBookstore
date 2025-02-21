import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  Paper,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import { Add, ArrowBack, Category, LocalLibrary } from '@mui/icons-material';
import { fetchCategories, addCategory } from '../redux/categorySlice';
import { RootState, AppDispatch } from '../redux/store';

export default function Categories(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [newCategory, setNewCategory] = useState<string>('');
  const { categories, status } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = (e: React.FormEvent): void => {
    e.preventDefault();
    if (newCategory.trim()) {
      dispatch(addCategory({ name: newCategory }));
      setNewCategory('');
    }
  };

  const viewCategoryBooks = (categoryId: number): void => {
    navigate(`/?categoryId=${categoryId}`);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', my: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 4 }}
      >
        Back to Bookstore
      </Button>

      <Typography variant="h4" gutterBottom fontWeight="bold">
        Book Categories
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Category
        </Typography>
        <Box component="form" onSubmit={handleAddCategory} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<Add />}
          >
            Add
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Available Categories
      </Typography>

      {status === 'loading' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : categories.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
          No categories found. Add your first category above!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item key={category.id} xs={12} sm={6} md={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Category color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      {category.name}
                    </Typography>
                  </Box>
                  
                  {category.bookCount && category.bookCount > 0 && (
                    <Chip 
                      label={`${category.bookCount} ${category.bookCount === 1 ? 'Book' : 'Books'}`}
                      color="primary"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  )}
                  
                  <Typography variant="body2" color="text.secondary">
                    {category.bookCount && category.bookCount > 0 
                      ? `This category contains ${category.bookCount} books in your collection.`
                      : 'No books in this category yet.'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    startIcon={<LocalLibrary />}
                    fullWidth
                    variant="contained"
                    onClick={() => viewCategoryBooks(category.id)}
                    disabled={!category.bookCount || category.bookCount === 0}
                  >
                    View Books
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
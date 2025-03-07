import React, { useState, useEffect, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Autocomplete
} from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { addBook, BookInput } from '../redux/bookSlice';
import { fetchCategories } from '../redux/categorySlice';
import { RootState, AppDispatch } from '../redux/store';

// Generate a cover image filename based on book title
const generateCoverImagePath = (title: string): string => {
  // Try to find an appropriate image from our collection
  // For simplicity, we'll just select one of the images we have
  const images = [
    'image-1.jpg',
    'image-2.jpg',
    'image-3.jpg',
    'image-4.jpg',
    'image-5.jpg',
    'image-6.jpg',
    'image-7.jpg',
    'lord-of-the-rings.jpg'
  ];
  
  // Use title length as a crude way to select an image
  // In a real app, you might match by genre or other metadata
  const imageIndex = title.length % images.length;
  return `/images/cover/${images[imageIndex]}`;
};

export default function AddBook(): ReactElement {
  const [book, setBook] = useState<BookInput>({ 
    title: "", 
    author: "", 
    category: "", 
    description: "" 
  });
  const [categoryInput, setCategoryInput] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!book.title || !book.author || !book.category) {
      return;
    }
    
    // Generate a local book cover path instead of using an external service
    const bookCoverPath = generateCoverImagePath(book.title);
    
    // Add the book with the local image path
    dispatch(addBook({ 
      ...book, 
      image: bookCoverPath,
      // If no description, it will use the default from the backend
    }));
    
    // Reset the form
    setBook({ title: "", author: "", category: "", description: "" });
    setCategoryInput("");
  };

  // Get existing category names for autocomplete
  const categoryOptions = categories.map(category => category.name);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
        Add a New Book
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              required
              label="Book Title"
              value={book.title}
              onChange={(e) => setBook({ ...book, title: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              required
              label="Author"
              value={book.author}
              onChange={(e) => setBook({ ...book, author: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              options={categoryOptions}
              inputValue={categoryInput}
              onInputChange={(event, newInputValue) => {
                setCategoryInput(newInputValue);
                setBook({ ...book, category: newInputValue });
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Category" 
                  required
                  helperText="Select existing or create new"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Description (optional)"
              value={book.description}
              onChange={(e) => setBook({ ...book, description: e.target.value })}
              multiline
              rows={1}
              helperText="Brief description of the book"
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddCircle />}
          fullWidth
          sx={{ mt: 3 }}
        >
          Add Book
        </Button>
      </Box>
    </Paper>
  );
}
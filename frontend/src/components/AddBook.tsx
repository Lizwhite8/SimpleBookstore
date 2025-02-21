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

// Generate a colored book cover with the book title as text
const generateBookCover = (title: string, author: string | undefined): string => {
  // Generate a color based on the title length
  const colors = [
    '87CEEB', 'FFD700', '90EE90', 'FFA07A', 'FFB6C1', 
    'ADD8E6', 'F08080', 'FFDEAD', 'D8BFD8', 'DDA0DD'
  ];
  
  const colorIndex = title.length % colors.length;
  const color = colors[colorIndex];
  
  // Create the placeholder URL with the book title
  const formattedTitle = title.replace(/\s+/g, '+');
  const formattedAuthor = author ? `by+${author.replace(/\s+/g, '+')}` : '';
  
  return `https://via.placeholder.com/300x400/${color}/000000?text=${formattedTitle}${formattedAuthor ? '%0A' + formattedAuthor : ''}`;
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
    
    // Generate a custom book cover based on title and author
    const bookCover = generateBookCover(book.title, book.author);
    
    // Add the book with the generated image
    dispatch(addBook({ 
      ...book, 
      image: bookCover,
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
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button,
  Box,
  Divider,
  Chip,
  Paper,
  Menu,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { 
  Info, 
  FilterList, 
  Clear,
  BookmarkBorder,
  KeyboardArrowDown
} from '@mui/icons-material';
import { fetchBooks, Book } from '../redux/bookSlice';
import { fetchCategories } from '../redux/categorySlice';
import { RootState, AppDispatch } from '../redux/store';

export default function BookList(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { books, status } = useSelector((state: RootState) => state.books);
  const { categories } = useSelector((state: RootState) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Fetch books and categories on component mount
  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Update filtered books whenever books or selected category changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(
        books.filter(book => book.categoryId === parseInt(selectedCategory))
      );
    }
  }, [books, selectedCategory]);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (categoryId: string): void => {
    setSelectedCategory(categoryId);
    handleMenuClose();
  };

  const clearFilter = (): void => {
    setSelectedCategory("all");
    handleMenuClose();
  };

  const handleBookClick = (id: number): void => {
    navigate(`/book/${id}`);
  };

  // Get the current category name
  const getCurrentCategoryName = (): string => {
    if (selectedCategory === "all") return "All Categories";
    const category = categories.find(c => c.id === parseInt(selectedCategory));
    return category ? category.name : "All Categories";
  };

  return (
    <Box>
      <Divider sx={{ my: 3 }} />
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          mb: 4, 
          display: 'flex', 
          flexDirection: {xs: 'column', sm: 'row'}, 
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            Available Books
          </Typography>
          
          {selectedCategory !== "all" && (
            <Chip 
              label={`Category: ${getCurrentCategoryName()}`}
              onDelete={clearFilter}
              color="primary"
              sx={{ ml: 2 }}
            />
          )}
        </Box>
        
        {categories.length > 0 && (
          <Box>
            <Button
              id="category-button"
              aria-controls={open ? 'category-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="outlined"
              onClick={handleMenuClick}
              endIcon={<KeyboardArrowDown />}
              startIcon={<FilterList />}
            >
              {selectedCategory === "all" ? "Filter by Category" : getCurrentCategoryName()}
            </Button>
            <Menu
              id="category-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'category-button',
              }}
            >
              <MenuItem 
                onClick={() => handleCategorySelect("all")}
                selected={selectedCategory === "all"}
              >
                <Typography fontWeight={selectedCategory === "all" ? "bold" : "normal"}>
                  All Categories
                </Typography>
              </MenuItem>
              
              <Divider />
              
              {categories.map((category) => (
                <MenuItem 
                  key={category.id} 
                  onClick={() => handleCategorySelect(category.id.toString())}
                  selected={selectedCategory === category.id.toString()}
                >
                  <Typography fontWeight={selectedCategory === category.id.toString() ? "bold" : "normal"}>
                    {category.name}
                  </Typography>
                </MenuItem>
              ))}
              
              {selectedCategory !== "all" && (
                <>
                  <Divider />
                  <MenuItem onClick={clearFilter}>
                    <Typography color="error" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Clear fontSize="small" sx={{ mr: 1 }} /> Clear Filter
                    </Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        )}
      </Paper>

      {status === 'loading' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress />
        </Box>
      ) : filteredBooks.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {selectedCategory === "all" ? 
              "No books available. Add your first book above!" : 
              "No books found in this category."}
          </Typography>
          {selectedCategory !== "all" && (
            <Button 
              variant="outlined" 
              onClick={clearFilter}
              startIcon={<Clear />}
              sx={{ mt: 2 }}
            >
              Clear Filter
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredBooks.map((book) => (
            <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={book.image || "https://via.placeholder.com/300x400?text=No+Image"}
                  alt={book.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {book.author}
                  </Typography>
                  
                  {book.Category && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                      <BookmarkBorder fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                      <Chip 
                        label={book.Category.name} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        onClick={() => handleCategorySelect(book.categoryId.toString())}
                      />
                    </Box>
                  )}
                  
                  <Button
                    variant="contained"
                    startIcon={<Info />}
                    fullWidth
                    onClick={() => handleBookClick(book.id)}
                    sx={{ mt: 'auto' }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
import React, { ReactElement, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Paper,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  Delete, 
  ArrowBack, 
  BookmarkBorder
} from '@mui/icons-material';
import { deleteBook, fetchBookById } from '../redux/bookSlice';
import { RootState, AppDispatch } from '../redux/store';

interface RouteParams {
  id: string;
  [key: string]: string;
}

// Fallback cover generator function
const generateFallbackCover = (title: string, author: string): ReactElement => {
  // Generate a deterministic background color based on title
  const getColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - color.length) + color;
  };

  // Get contrast color for text
  const getContrastColor = (hexColor: string): string => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const bgColor = getColor(title);
  const textColor = getContrastColor(bgColor);

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%', 
        minHeight: 400,
        backgroundColor: bgColor,
        color: textColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        textAlign: 'center'
      }}
    >
      <Typography variant="h4" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h6">
        by {author}
      </Typography>
    </Box>
  );
};

export default function BookDetails(): ReactElement {
  const { id } = useParams<RouteParams>() as RouteParams;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Fetch specific book on component mount
  useEffect(() => {
    dispatch(fetchBookById(id));
  }, [dispatch, id]);

  const { currentBook, status } = useSelector((state: RootState) => state.books);
  const [imageError, setImageError] = React.useState(false);

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentBook) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', my: 5 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Book not found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The book you're looking for doesn't exist or has been removed.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Store
        </Button>
      </Paper>
    );
  }

  const handleDelete = (): void => {
    dispatch(deleteBook(currentBook.id));
    navigate('/');
  };

  const handleCategoryClick = (): void => {
    if (currentBook.Category) {
      navigate(`/?categoryId=${currentBook.categoryId}`);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 3 }}>
      <Card sx={{ display: { md: 'flex' }, mb: 4 }}>
        {!imageError ? (
          <CardMedia
            component="img"
            sx={{ 
              width: { xs: '100%', md: 300 },
              height: { xs: 400, md: 'auto' },
              objectFit: 'cover'
            }}
            image={currentBook.image}
            alt={currentBook.title}
            onError={handleImageError}
          />
        ) : (
          <Box sx={{ width: { xs: '100%', md: 300 } }}>
            {generateFallbackCover(currentBook.title, currentBook.author)}
          </Box>
        )}
        <CardContent sx={{ flex: '1 1 auto', p: 4 }}>
          <Typography variant="h4" component="div" gutterBottom>
            {currentBook.title}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            by {currentBook.author}
          </Typography>
          
          {currentBook.Category && (
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <BookmarkBorder fontSize="small" color="primary" sx={{ mr: 1 }} />
              <Chip 
                label={currentBook.Category.name} 
                color="primary" 
                variant="outlined" 
                onClick={handleCategoryClick}
                clickable
              />
            </Box>
          )}
          
          <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 3 }}>
            {currentBook.description}
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
              fullWidth
            >
              Delete Book
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              fullWidth
            >
              Back to Store
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  CssBaseline, 
  Box,
  Paper,
  Divider
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LibraryBooks } from '@mui/icons-material';

import BookList from "./components/BookList";
import BookDetails from "./components/BookDetails";
import AddBook from "./components/AddBook";
import Categories from "./components/Categories";

// Create a theme with blue primary color
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function App(): ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <Typography 
                variant="h5" 
                component="a"
                href="/"
                sx={{ 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <LibraryBooks /> My Online Bookstore
              </Typography>
            </Toolbar>
          </AppBar>

          <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route
                path="/"
                element={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: 3, 
                        backgroundImage: 'linear-gradient(to right, #1976d2, #2196f3)',
                        color: 'white'
                      }}
                    >
                      <Typography variant="h4" gutterBottom fontWeight="bold">
                        Welcome to My Online Bookstore
                      </Typography>
                      <Typography variant="body1">
                        Browse our collection, add new books, and organize them by categories.
                      </Typography>
                    </Paper>
                    <AddBook />
                    <BookList />
                  </Box>
                }
              />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/categories" element={<Categories />} />
            </Routes>
          </Container>

          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: (theme) => theme.palette.grey[200],
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © 2025 My Online Bookstore. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
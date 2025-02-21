import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Category } from "./categorySlice";

// Define types
export interface Book {
  id: number;
  title: string;
  author: string;
  image?: string;
  description?: string;
  categoryId: number;
  Category?: Category;
}

interface BookState {
  books: Book[];
  currentBook: Book | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface BookInput {
  title: string;
  author: string;
  category: string;
  description?: string;
  image?: string;
}

export interface DeleteBookResponse {
  message: string;
  categoryDeleted: boolean;
  categoryId: number | null;
}

const API_URL = "http://localhost:5000/books";

export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  try {
    const response = await axios.get<Book[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
});

export const fetchBookById = createAsyncThunk(
  "books/fetchBookById", 
  async (id: number | string) => {
    try {
      const response = await axios.get<Book>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching book:", error);
      throw error;
    }
  }
);

export const fetchBooksByCategory = createAsyncThunk(
  "books/fetchBooksByCategory", 
  async (categoryId: number | string) => {
    try {
      const response = await axios.get<Book[]>(`${API_URL}/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching books by category:", error);
      throw error;
    }
  }
);

export const addBook = createAsyncThunk(
  "books/addBook", 
  async (book: BookInput) => {
    try {
      // Generate a random description if not provided
      if (!book.description) {
        book.description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";
      }
      
      const response = await axios.post<Book>(API_URL, book);
      return response.data;
    } catch (error) {
      console.error("Error adding book:", error);
      throw error;
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook", 
  async (id: number, { dispatch }) => {
    try {
      const response = await axios.delete<DeleteBookResponse>(`${API_URL}/${id}`);
      
      // If a category was also deleted, refresh the categories list
      if (response.data.categoryDeleted) {
        dispatch({ type: 'categories/categoryDeleted', payload: response.data.categoryId });
      }
      
      return id;
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  }
);

const initialState: BookState = { 
  books: [], 
  currentBook: null,
  status: 'idle', 
  error: null 
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch books
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      // Fetch book by ID
      .addCase(fetchBookById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookById.fulfilled, (state, action: PayloadAction<Book>) => {
        state.status = 'succeeded';
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      // Fetch books by category
      .addCase(fetchBooksByCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBooksByCategory.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.books = action.payload;
      })
      .addCase(fetchBooksByCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      // Add book
      .addCase(addBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.books.push(action.payload);
      })
      // Delete book
      .addCase(deleteBook.fulfilled, (state, action: PayloadAction<number>) => {
        state.books = state.books.filter(book => book.id !== action.payload);
        if (state.currentBook && state.currentBook.id === action.payload) {
          state.currentBook = null;
        }
      });
  },
});

export default bookSlice.reducer;
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types
export interface Category {
  id: number;
  name: string;
  bookCount?: number;
}

interface CategoryState {
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const API_URL = "http://localhost:5000/categories";

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  try {
    const response = await axios.get<Category[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
});

export const addCategory = createAsyncThunk(
  "categories/addCategory", 
  async (category: { name: string }) => {
    try {
      const response = await axios.post<Category>(API_URL, category);
      return response.data;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  }
);

const initialState: CategoryState = { 
  categories: [], 
  status: 'idle', 
  error: null 
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    categoryDeleted(state, action: PayloadAction<number>) {
      // Remove the category from the state when it's deleted via book deletion
      state.categories = state.categories.filter(category => category.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      // Add category
      .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.categories.push(action.payload);
      });
  },
});

export const { categoryDeleted } = categorySlice.actions;
export default categorySlice.reducer;
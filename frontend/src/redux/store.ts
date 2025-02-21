import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./bookSlice";  // Changed from ../redux/bookSlice
import categoryReducer from "./categorySlice";  // Changed from ../redux/categorySlice

export const store = configureStore({
  reducer: {
    books: bookReducer,
    categories: categoryReducer,
  },
});

// Infer the RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
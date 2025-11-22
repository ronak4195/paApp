// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './categoriesSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    // add other slices here later
  },
});

// Optional: TypeScript users would export RootState / AppDispatch here

export default store;

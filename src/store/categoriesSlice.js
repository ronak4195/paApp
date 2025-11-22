// // src/store/categoriesSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { fetchCategories as apiFetchCategories } from '../api/categories';

// // Thunk: fetch from backend
// export const fetchCategoriesThunk = createAsyncThunk(
//   'api/v1/categories',
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await apiFetchCategories(); // expects array
//       return data;
//     } catch (err) {
//       return rejectWithValue(
//         err?.response?.data?.message || 'Failed to fetch categories'
//       );
//     }
//   }
// );
// console.log('Fetched categories:', fetchCategoriesThunk);
// const initialState = {
//   entities: {}, // { [id]: category }
//   ids: [],      // [id1, id2, ...]
//   loading: false,
//   error: null,
// };

// const categoriesSlice = createSlice({
//   name: 'categories',
//   initialState,
//   reducers: {
//     // if you want to add local reducers later (addCategory, updateCategory, etc.)
//     upsertCategory(state, action) {
//       const cat = action.payload;
//       const id = cat.id || cat._id;
//       if (!id) return;
//       state.entities[id] = cat;
//       if (!state.ids.includes(id)) {
//         state.ids.push(id);
//       }
//     },
//     removeCategory(state, action) {
//       const id = action.payload;
//       if (!id) return;
//       delete state.entities[id];
//       state.ids = state.ids.filter((x) => x !== id);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCategoriesThunk.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.error = null;

//         const entities = {};
//         const ids = [];
//         for (const cat of action.payload || []) {
//           const id = cat.id || cat._id;
//           if (!id) continue;
//           entities[id] = cat;
//           ids.push(id);
//         }
//         state.entities = entities;
//         state.ids = ids;
//       })
//       .addCase(fetchCategoriesThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to load categories';
//       });
//   },
// });

// export const { upsertCategory, removeCategory } = categoriesSlice.actions;

// // Selectors
// export const selectCategoriesState = (state) => state.categories;

// export const selectAllCategories = (state) => {
//   const { ids, entities } = state.categories;
//   return ids.map((id) => entities[id]);
// };

// export const selectCategoryById = (state, id) =>
//   state.categories.entities[id] || null;

// export const selectTopLevelCategories = (state) =>
//   selectAllCategories(state).filter((c) => !c.parentId);

// export const selectSubcategoriesFor = (state, parentId) =>
//   selectAllCategories(state).filter((c) => c.parentId === parentId);

// export default categoriesSlice.reducer;


// src/store/categoriesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategories as apiFetchCategories } from '../api/categories';

// Thunk: fetch from backend
export const fetchCategoriesThunk = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // apiFetchCategories is probably: res.data => { data: [...] }
      const res = await apiFetchCategories();

      // If apiFetchCategories returns { data: [...] }
      const categories = res.data ?? res; // fallback in case you return array directly

      if (!Array.isArray(categories)) {
        throw new Error('Invalid categories response shape');
      }

      return categories; // Now fulfilled gets an ARRAY
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || 'Failed to fetch categories'
      );
    }
  }
);

const initialState = {
  entities: {}, // { [id]: category }
  ids: [],      // [id1, id2, ...]
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // if you want to add local reducers later (addCategory, updateCategory, etc.)
    upsertCategory(state, action) {
      const cat = action.payload;
      const id = cat.id || cat._id;
      if (!id) return;
      state.entities[id] = cat;
      if (!state.ids.includes(id)) {
        state.ids.push(id);
      }
    },
    removeCategory(state, action) {
      const id = action.payload;
      if (!id) return;
      delete state.entities[id];
      state.ids = state.ids.filter((x) => x !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const entities = {};
        const ids = [];

        // action.payload is now the array: [{ id, name, parentId }, ...]
        for (const cat of action.payload || []) {
          const id = cat.id || cat._id;
          if (!id) continue;
          entities[id] = cat;
          ids.push(id);
        }

        state.entities = entities;
        state.ids = ids;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load categories';
      });
  },
});

export const { upsertCategory, removeCategory } = categoriesSlice.actions;

// Selectors
export const selectCategoriesState = (state) => state.categories;

export const selectAllCategories = (state) => {
  const { ids, entities } = state.categories;
  return ids.map((id) => entities[id]);
};

export const selectCategoryById = (state, id) =>
  state.categories.entities[id] || null;

export const selectTopLevelCategories = (state) =>
  selectAllCategories(state).filter((c) => !c.parentId);

export const selectSubcategoriesFor = (state, parentId) =>
  selectAllCategories(state).filter((c) => c.parentId === parentId);

export default categoriesSlice.reducer;

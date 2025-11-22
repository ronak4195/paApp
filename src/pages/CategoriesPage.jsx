// // src/pages/CategoriesPage.jsx
// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   IconButton,
//   Button,
//   TextField,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import {
//   fetchCategories,
//   createCategory,
//   updateCategory,
//   deleteCategory,
// } from '../api/categories';
// import LoadingSpinner from '../components/common/LoadingSpinner';
// import ErrorAlert from '../components/common/ErrorAlert';
// import ConfirmDialog from '../components/common/ConfirmDialog';

// const CategoriesPage = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [dialog, setDialog] = useState({
//     open: false,
//     mode: 'create',
//     parentId: null,
//     category: null,
//   });
//   const [deleteState, setDeleteState] = useState({
//     open: false,
//     id: null,
//   });
//   const [formName, setFormName] = useState('');

//   const loadCategories = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const data = await fetchCategories();
//       setCategories(data);
//     } catch (err) {
//       setError('Failed to load categories.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   // const topLevel = useMemo(
//   //   () => categories.filter((c) => !c.parentId),
//   //   [categories]
//   // );

//   // const childrenByParent = useMemo(() => {
//   //   const map = {};
//   //   categories.forEach((c) => {
//   //     if (c.parentId) {
//   //       if (!map[c.parentId]) map[c.parentId] = [];
//   //       map[c.parentId].push(c);
//   //     }
//   //   });
//   //   return map;
//   // }, [categories]);

//   const openCreate = (parentId = null) => {
//     setDialog({ open: true, mode: 'create', parentId, category: null });
//     setFormName('');
//   };
//   const openEdit = (category) => {
//     setDialog({
//       open: true,
//       mode: 'edit',
//       parentId: category.parentId || null,
//       category,
//     });
//     setFormName(category.name);
//   };
//   const closeDialog = () => {
//     setDialog((d) => ({ ...d, open: false }));
//   };

//   const handleSave = async () => {
//     if (!formName.trim()) return;
//     try {
//       if (dialog.mode === 'create') {
//         await createCategory({
//           name: formName.trim(),
//           parentId: dialog.parentId,
//         });
//       } else {
//         await updateCategory(dialog.category.id || dialog.category._id, {
//           name: formName.trim(),
//         });
//       }
//       closeDialog();
//       loadCategories();
//     } catch (err) {
//       setError('Failed to save category.');
//     }
//   };

//   const confirmDelete = (id) => setDeleteState({ open: true, id });
//   const closeDelete = () => setDeleteState({ open: false, id: null });

//   const handleDelete = async () => {
//     try {
//       await deleteCategory(deleteState.id);
//       closeDelete();
//       loadCategories();
//     } catch (err) {
//       setError('Failed to delete category.');
//     }
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Categories
//       </Typography>
//       {error && <ErrorAlert message={error} />}

//       <Paper sx={{ p: 2 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//           <Typography variant="h6">Manage Categories</Typography>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => openCreate(null)}
//           >
//             Add Category
//           </Button>
//         </Box>
//         {/* <List>
//           {topLevel.map((cat) => (
//             <Box key={cat.id || cat._id}>
//               <ListItem
//                 secondaryAction={
//                   <Box>
//                     <IconButton onClick={() => openCreate(cat.id || cat._id)}>
//                       <AddIcon fontSize="small" />
//                     </IconButton>
//                     <IconButton onClick={() => openEdit(cat)}>
//                       <EditIcon fontSize="small" />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => confirmDelete(cat.id || cat._id)}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </Box>
//                 }
//               >
//                 <ListItemText primary={cat.name} />
//               </ListItem>
//               {(childrenByParent[cat.id || cat._id] || []).map((sub) => (
//                 <ListItem
//                   key={sub.id || sub._id}
//                   sx={{ pl: 4 }}
//                   secondaryAction={
//                     <ListItemSecondaryAction>
//                       <IconButton onClick={() => openEdit(sub)}>
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton
//                         onClick={() => confirmDelete(sub.id || sub._id)}
//                       >
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </ListItemSecondaryAction>
//                   }
//                 >
//                   <ListItemText primary={`↳ ${sub.name}`} />
//                 </ListItem>
//               ))}
//             </Box>
//           ))}
//           {!topLevel.length && (
//             <Typography variant="body2" sx={{ p: 1 }}>
//               No categories yet. Add one to get started.
//             </Typography>
//           )}
//         </List> */}
//       </Paper>

//       {/* Add/Edit Modal (simple inline card) */}
//       {dialog.open && (
//         <Box
//           sx={{
//             position: 'fixed',
//             inset: 0,
//             backgroundColor: 'rgba(0,0,0,0.3)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 1300,
//           }}
//         >
//           <Paper sx={{ p: 3, minWidth: 320 }}>
//             <Typography variant="h6" gutterBottom>
//               {dialog.mode === 'create'
//                 ? dialog.parentId
//                   ? 'Add Subcategory'
//                   : 'Add Category'
//                 : 'Edit Category'}
//             </Typography>
//             <TextField
//               label="Name"
//               fullWidth
//               margin="normal"
//               value={formName}
//               onChange={(e) => setFormName(e.target.value)}
//             />
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//               <Button onClick={closeDialog} sx={{ mr: 1 }}>
//                 Cancel
//               </Button>
//               <Button variant="contained" onClick={handleSave}>
//                 Save
//               </Button>
//             </Box>
//           </Paper>
//         </Box>
//       )}

//       <ConfirmDialog
//         open={deleteState.open}
//         title="Delete Category"
//         message="Are you sure you want to delete this category? Subcategories may also be affected."
//         onCancel={closeDelete}
//         onConfirm={handleDelete}
//       />
//     </Box>
//   );
// };

// export default CategoriesPage;


// src/pages/CategoriesPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategoriesThunk,
  selectAllCategories,
} from '../store/categoriesSlice';

import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import ConfirmDialog from '../components/common/ConfirmDialog';

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const allCategories = useSelector(selectAllCategories);
  const { loading, error } = useSelector((state) => state.categories);

  const [dialog, setDialog] = useState({
    open: false,
    mode: 'create',
    parentId: null,
    category: null,
  });
  const [deleteState, setDeleteState] = useState({
    open: false,
    id: null,
  });
  const [formName, setFormName] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const topLevel = useMemo(
    () => allCategories.filter((c) => !c.parentId),
    [allCategories]
  );

  const childrenByParent = useMemo(() => {
    const map = {};
    allCategories.forEach((c) => {
      if (c.parentId) {
        if (!map[c.parentId]) map[c.parentId] = [];
        map[c.parentId].push(c);
      }
    });
    return map;
  }, [allCategories]);

  const openCreate = (parentId = null) => {
    setDialog({ open: true, mode: 'create', parentId, category: null });
    setFormName('');
    setLocalError('');
  };

  const openEdit = (category) => {
    setDialog({
      open: true,
      mode: 'edit',
      parentId: category.parentId || null,
      category,
    });
    setFormName(category.name);
    setLocalError('');
  };

  const closeDialog = () => {
    setDialog((d) => ({ ...d, open: false }));
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setLocalError('Name is required');
      return;
    }
    try {
      if (dialog.mode === 'create') {
        await createCategory({
          name: formName.trim(),
          parentId: dialog.parentId,
        });
      } else {
        await updateCategory(dialog.category.id || dialog.category._id, {
          name: formName.trim(),
        });
      }
      closeDialog();
      dispatch(fetchCategoriesThunk()); // refresh store
    } catch (err) {
      setLocalError('Failed to save category.');
    }
  };

  const confirmDelete = (id) => setDeleteState({ open: true, id });
  const closeDelete = () => setDeleteState({ open: false, id: null });

  const handleDelete = async () => {
    try {
      await deleteCategory(deleteState.id);
      closeDelete();
      dispatch(fetchCategoriesThunk());
    } catch (err) {
      setLocalError('Failed to delete category.');
    }
  };

  if (loading && !allCategories.length) {
    return <LoadingSpinner />;
  }

  console.log('Categories loaded:', allCategories);
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>
      {error && <ErrorAlert message={error} />}
      {localError && <ErrorAlert message={localError} />}

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Manage Categories</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openCreate(null)}
          >
            Add Category
          </Button>
        </Box>
        <List>
          {topLevel.map((cat) => (
            <Box key={cat.id || cat._id}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton onClick={() => openCreate(cat.id || cat._id)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => openEdit(cat)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => confirmDelete(cat.id || cat._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText primary={cat.name} />
              </ListItem>
              {(childrenByParent[cat.id || cat._id] || []).map((sub) => (
                <ListItem
                  key={sub.id || sub._id}
                  sx={{ pl: 4 }}
                  secondaryAction={
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => openEdit(sub)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => confirmDelete(sub.id || sub._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  }
                >
                  <ListItemText primary={`↳ ${sub.name}`} />
                </ListItem>
              ))}
            </Box>
          ))}
          {!topLevel.length && (
            <Typography variant="body2" sx={{ p: 1 }}>
              No categories yet. Add one to get started.
            </Typography>
          )}
        </List>
      </Paper>

      {/* Same dialog & ConfirmDialog as before... */}
    </Box>
  );
};

export default CategoriesPage;

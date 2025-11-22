// // src/routes/AppRouter.jsx
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import PrivateRoute from '../components/common/PrivateRoute';
// import Layout from '../components/layout/Layout';

// import LoginPage from '../pages/auth/LoginPage';
// import SignupPage from '../pages/auth/SignupPage';
// import DashboardPage from '../pages/DashboardPage';
// import CategoriesPage from '../pages/CategoriesPage';
// import TransactionsListPage from '../pages/TransactionsListPage';
// import TransactionFormPage from '../pages/TransactionFormPage';
// import ReportsPage from '../pages/ReportsPage';
// import RemindersListPage from '../pages/RemindersListPage';
// import ReminderFormPage from '../pages/ReminderFormPage';
// import ProfilePage from '../pages/ProfilePage';

// const AppRouter = () => {
//   return (
//     <Routes>
//       {/* Public */}
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/signup" element={<SignupPage />} />

//       {/* Protected layout */}
//       <Route
//         path="/"
//         element={
//           <PrivateRoute>
//             <Layout />
//           </PrivateRoute>
//         }
//       >
//         <Route index element={<Navigate to="/dashboard" replace />} />
//         <Route path="dashboard" element={<DashboardPage />} />
//         <Route path="categories" element={<CategoriesPage />} />

//         <Route path="transactions" element={<TransactionsListPage />} />
//         <Route path="transactions/new" element={<TransactionFormPage />} />
//         <Route path="transactions/:id/edit" element={<TransactionFormPage />} />

//         <Route path="reports" element={<ReportsPage />} />

//         <Route path="reminders" element={<RemindersListPage />} />
//         <Route path="reminders/new" element={<ReminderFormPage />} />
//         <Route path="reminders/:id/edit" element={<ReminderFormPage />} />

//         <Route path="profile" element={<ProfilePage />} />
//       </Route>

//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// };

// export default AppRouter;


// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/common/PrivateRoute';
import Layout from '../components/layout/Layout';

import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import CategoriesPage from '../pages/CategoriesPage';
import TransactionsListPage from '../pages/TransactionsListPage';
import TransactionFormPage from '../pages/TransactionFormPage';
import ReportsPage from '../pages/ReportsPage';
import RemindersListPage from '../pages/RemindersListPage';
import ReminderFormPage from '../pages/ReminderFormPage';
import ProfilePage from '../pages/ProfilePage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected area */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />

          <Route path="transactions" element={<TransactionsListPage />} />
          <Route path="transactions/new" element={<TransactionFormPage />} />
          <Route path="transactions/:id/edit" element={<TransactionFormPage />} />

          <Route path="reports" element={<ReportsPage />} />

          <Route path="reminders" element={<RemindersListPage />} />
          <Route path="reminders/new" element={<ReminderFormPage />} />
          <Route path="reminders/:id/edit" element={<ReminderFormPage />} />

          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;

// // src/components/layout/Layout.jsx
// import React from 'react';
// import { Box, Toolbar } from '@mui/material';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';

// const Layout = ({ children }) => {
//   return (
//     <Box sx={{ display: 'flex', minHeight: '100vh' }}>
//       <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1200 }}>
//         <Navbar />
//       </Box>
//       <Sidebar />
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           mt: 8,
//           ml: { xs: 0, md: '240px' },
//           backgroundColor: '#f5f5f5',
//           minHeight: '100vh',
//         }}
//       >
//         <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
//         {children}
//       </Box>
//     </Box>
//   );
// };

// export default Layout;

// src/components/layout/Layout.jsx
import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1200 }}>
        <Navbar />
      </Box>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { xs: 0, md: '240px' },
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        {/* Spacer for mobile if needed */}
        <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;

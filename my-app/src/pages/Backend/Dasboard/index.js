import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Dashboard, List as ListIcon } from '@mui/icons-material';

const DashboardPage = () => (
  <Container>
    <Typography variant="h4" gutterBottom>
      Dashboard
    </Typography>
    <p>Welcome to the dashboard page.</p>
  </Container>
);

const ProductsPage = () => (
  <Container>
    <Typography variant="h4" gutterBottom>
      Products
    </Typography>
    <p>Manage your products here.</p>
  </Container>
);

const Sidebar = () => (
  <Box sx={{ width: 250, bgcolor: 'background.paper', p: 2 }}>
    <List>
      <ListItem>
        <Button component={Link} to="/dashboard" startIcon={<Dashboard />}>
          Dashboard
        </Button>
      </ListItem>
      <ListItem>
        <Button component={Link} to="/products" startIcon={<ListIcon />}>
          Products
        </Button>
      </ListItem>
    </List>
    <Divider />
    <Button component={Link} to="/" onClick={() => alert('Logged out')} color="error">
      Logout
    </Button>
  </Box>
);

function AdminPanel() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" noWrap>
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
        <Sidebar />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: 30 }}
        >
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/" element={<DashboardPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default AdminPanel;

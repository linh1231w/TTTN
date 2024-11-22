import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Dashboard, List as ListIcon } from '@mui/icons-material';

function DashboardPage() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <p>Welcome to the dashboard page.</p>
    </Container>
  );
}

function ProductsPage() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <p>Manage your products here.</p>
    </Container>
  );
}

function Sidebar() {
  return (
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
}



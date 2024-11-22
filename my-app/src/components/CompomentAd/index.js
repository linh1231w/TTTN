import React from 'react';
import { Box, Container } from '@mui/material';

const MainContent = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
    >
      <Container>
        <h1>Welcome to the Admin Panel</h1>
        {/* Add more components and content here */}
      </Container>
    </Box>
  );
};

export default MainContent;

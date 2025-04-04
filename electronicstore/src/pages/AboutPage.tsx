import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const AboutPage: React.FC = () => {
  return (
    <Container>
      <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to Electronics Store, your one-stop destination for all your household electronic needs.
          We offer a wide range of products from fans and lighting to electrical supplies and tools.
        </Typography>
        <Typography variant="body1" paragraph>
          Our commitment is to provide high-quality electronic products at competitive prices,
          backed by excellent customer service and technical support.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AboutPage; 
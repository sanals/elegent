import { Facebook, Instagram, Twitter, YouTube } from '@mui/icons-material';
import { Box, Container, Grid, Link, Typography } from '@mui/material';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'black',
        color: 'white',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Address Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Our Address
            </Typography>
            <Typography variant="body2">
              AAN Elegent Electric, QCQV+2V4, Market Road, Thalayolaparambu, Kerala 686605
            </Typography>
          </Grid>

          {/* Social Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Get In Touch
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="#" color="inherit">
                <Facebook />
              </Link>
              <Link href="#" color="inherit">
                <Twitter />
              </Link>
              <Link href="#" color="inherit">
                <Instagram />
              </Link>
              <Link href="#" color="inherit">
                <YouTube />
              </Link>
            </Box>
          </Grid>

          {/* Copyright */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Copyright
            </Typography>
            <Typography variant="body2">
              ©2025 Elegent Electric.
              <br />
              All rights reserved.
              <br />
              Made with love.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer; 
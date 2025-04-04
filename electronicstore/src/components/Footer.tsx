import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube } from '@mui/icons-material';

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
              V.K. Industries #53, Mehta Industrial Estate, Liberty Garden Cross
              Lane No. 3, Malad (West), Mumbai - 400 064.
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
              ©2024 Elegant Electrics.
              <br />
              All rights reserved.
              <br />
              Made By The Storytellers.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer; 
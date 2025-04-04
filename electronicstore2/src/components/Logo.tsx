import React from 'react';
import { Box, Typography } from '@mui/material';
import { ElectricBolt } from '@mui/icons-material';

interface LogoProps {
  variant?: 'full' | 'icon';
  color?: 'primary' | 'white';
}

const Logo: React.FC<LogoProps> = ({ variant = 'full', color = 'primary' }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ElectricBolt sx={{ 
        fontSize: variant === 'full' ? 32 : 24,
        color: color === 'white' ? 'white' : 'primary.main'
      }} />
      {variant === 'full' && (
        <Typography
          variant="h6"
          sx={{ 
            fontWeight: 'bold',
            color: color === 'white' ? 'white' : 'primary.main',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          Elegant Electrics
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 
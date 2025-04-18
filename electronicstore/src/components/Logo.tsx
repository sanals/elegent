import { Box } from '@mui/material';
import React from 'react';
import logoImage from '../assets/images/logo.png';

interface LogoProps {
  variant?: 'full' | 'icon';
  color?: 'primary' | 'white';
}

const Logo: React.FC<LogoProps> = ({ variant = 'full' }) => {
  return (
    <Box
      component="img"
      src={logoImage}
      alt="Elegent Electric Logo"
      sx={{
        height: variant === 'full' ? 40 : 32,
        width: 'auto'
      }}
    />
  );
};

export default Logo; 
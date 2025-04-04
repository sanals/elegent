import { Menu as MenuIcon } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ThemeToggle';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Electronics Store Admin
        </Typography>

        {/* User info */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
          <Typography variant="body1" sx={{ mx: 1 }}>
            {user?.username || 'Guest'}
          </Typography>
          <Avatar sx={{ width: 32, height: 32 }}>
            {user?.username?.charAt(0).toUpperCase() || 'G'}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
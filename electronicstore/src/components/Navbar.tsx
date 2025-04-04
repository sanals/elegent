import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  Menu as MenuIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';
import { useProducts } from '../context/ProductContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (category: string) => {
    navigate(`/category/${category}`);
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        px: { xs: 1, sm: 2 },
        gap: 2
      }}>
        {/* Mobile Menu Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            sx={{ display: { xs: 'flex', md: 'none' }, p: 1 }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Updated Logo Section */}
          <Link
            to="/"
            style={{ 
              textDecoration: 'none', 
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Logo variant="full" color="white" />
          </Link>
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 2,
          ml: 'auto'
        }}>
          <Button color="inherit" onClick={handleClick}>
            Categories
          </Button>
        </Box>

        {/* Mobile Menu Drawer */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <List sx={{ width: 250 }}>
            {categories.map((category) => (
              <ListItem 
                key={category.name}
                onClick={() => {
                  handleCategorySelect(category.name);
                  setMobileMenuOpen(false);
                }}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemText primary={category.name} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Desktop Categories Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ display: { xs: 'none', md: 'block' } }}
        >
          {categories.map((category) => (
            <MenuItem 
              key={category.name}
              onClick={() => handleCategorySelect(category.name)}
            >
              {category.name}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 
import {
  Menu as MenuIcon,
  Search
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { categories } = useProducts();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (categoryId: number) => {
    navigate(`/category/${categoryId}`);
    handleClose();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
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

        {/* Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 1,
            ml: { xs: 0, md: 2 },
            mr: 2,
            flex: { xs: 1, md: 0.5 }
          }}
        >
          <InputBase
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              ml: 1,
              flex: 1,
              color: 'inherit'
            }}
          />
          <IconButton type="submit" sx={{ p: 1 }} color="inherit">
            <Search />
          </IconButton>
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
          <ThemeToggle />
        </Box>

        {/* Mobile Navigation Icons */}
        <Box sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          gap: 1
        }}>
          <ThemeToggle />
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
                key={category.id}
                onClick={() => {
                  handleCategorySelect(category.id);
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
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
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
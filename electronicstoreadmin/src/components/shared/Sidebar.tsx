import {
  Category as CategoryIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  requiredRoles?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Width for mini drawer (only icons)
  const miniDrawerWidth = 64;

  const menuItems: MenuItem[] = [
    {
      text: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      text: 'Products',
      path: '/products',
      icon: <InventoryIcon />
    },
    {
      text: 'Categories',
      path: '/categories',
      icon: <CategoryIcon />
    },
    {
      text: 'Outlets',
      path: '/outlets',
      icon: <StoreIcon />
    },
    {
      text: 'Users',
      path: '/users',
      icon: <PeopleIcon />,
      requiredRoles: ['ADMIN', 'SUPER_ADMIN']
    },
    {
      text: 'Settings',
      path: '/settings',
      icon: <SettingsIcon />
    }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    !item.requiredRoles || (user && item.requiredRoles.includes(user.role))
  );

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  // Full drawer with icons and text
  const fullDrawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  // Mini drawer with only icons
  const miniDrawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: open ? drawerWidth : miniDrawerWidth }, flexShrink: { sm: 0 } }}
    >
      {isMobile ? (
        // Mobile: Temporary drawer that overlays content
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            },
          }}
        >
          {fullDrawer}
        </Drawer>
      ) : (
        // Desktop: Permanent drawer that transitions between full and mini
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: open ? drawerWidth : miniDrawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {open ? fullDrawer : miniDrawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar; 
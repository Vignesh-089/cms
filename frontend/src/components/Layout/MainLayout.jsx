// src/components/Layout/MainLayout.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
  InputBase,
  alpha,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Event,
  CalendarToday,
  Settings,
  Notifications,
  Logout,
  Brightness4,
  Brightness7,
  ChevronLeft,
  ChevronRight,
  Search as SearchIcon,
  HelpOutline as HelpIcon,
  GridView as AppsIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ChangePasswordDialog from "../Auth/ChangePasswordDialog";
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;
const collapsedDrawerWidth = 72;

export const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const { mode, toggleColorMode } = useThemeContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Clients', icon: <People />, path: '/clients' },
    { text: 'Events', icon: <Event />, path: '/events' },
    { text: 'Calendar View', icon: <CalendarToday />, path: '/calendar' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const drawer = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: mode === 'dark' ? 'grey.900' : 'white',
      borderRight: '1px solid',
      borderColor: 'divider',
    }}>
      <Toolbar sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        px: sidebarCollapsed ? 1 : 2,
      }}>
        {!sidebarCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="span"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              SC
            </Box>
            <Typography variant="h6" noWrap fontWeight="bold" color="primary">
              Smart Calendar
            </Typography>
          </Box>
        )}
        {sidebarCollapsed && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}
          >
            SC
          </Box>
        )}
        <Tooltip title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
          <IconButton onClick={toggleSidebar} sx={{
            mx: sidebarCollapsed ? 0 : 0,
            color: 'primary.main',
            '&:hover': {
              bgcolor: mode === 'dark' ? alpha(theme.palette.primary.main, 0.15) : 'primary.light',
              color: mode === 'dark' ? 'primary.light' : 'white',
            },
          }}>
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Tooltip>
      </Toolbar>
      <Divider />

      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
            <Tooltip title={sidebarCollapsed ? item.text : ''} placement="right" arrow>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: sidebarCollapsed ? 'center' : 'initial',
                  px: sidebarCollapsed ? 2.5 : 2,
                  mx: 1,
                  borderRadius: 2,
                  // Selected state - improved for dark mode
                  '&.Mui-selected': {
                    backgroundColor: mode === 'dark' 
                      ? alpha(theme.palette.primary.main, 0.15)  // Lighter in dark mode
                      : alpha(theme.palette.primary.main, 0.08), // Light in light mode
                    color: mode === 'dark' ? 'primary.light' : 'primary.main',
                    '&:hover': {
                      backgroundColor: mode === 'dark' 
                        ? alpha(theme.palette.primary.main, 0.25)  // Slightly darker on hover
                        : alpha(theme.palette.primary.main, 0.12),
                    },
                    '& .MuiListItemIcon-root': {
                      color: mode === 'dark' ? 'primary.light' : 'primary.main',
                    },
                  },
                  // Hover state
                  '&:hover': {
                    backgroundColor: mode === 'dark'
                      ? alpha(theme.palette.primary.main, 0.08)  // Very subtle hover in dark mode
                      : alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: sidebarCollapsed ? 0 : 2,
                    justifyContent: 'center',
                    color: location.pathname === item.path 
                      ? (mode === 'dark' ? 'primary.light' : 'primary.main')
                      : 'text.secondary',
                    transition: 'color 0.2s',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!sidebarCollapsed && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        color: location.pathname === item.path 
                          ? (mode === 'dark' ? 'primary.light' : 'primary.main')
                          : 'text.primary',
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Box sx={{
        p: sidebarCollapsed ? 1 : 2,
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: sidebarCollapsed ? 'center' : 'stretch',
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          flexDirection: sidebarCollapsed ? 'column' : 'row',
          gap: sidebarCollapsed ? 1 : 0,
        }}>
          <Avatar sx={{
            width: sidebarCollapsed ? 40 : 40,
            height: sidebarCollapsed ? 40 : 40,
            mr: sidebarCollapsed ? 0 : 2,
            mb: sidebarCollapsed ? 1 : 0,
            bgcolor: 'primary.main',
            boxShadow: 2,
          }}>
            {user?.avatar || 'A'}
          </Avatar>
          {!sidebarCollapsed && (
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
              <Typography variant="body2" fontWeight="medium" noWrap>
                {user?.name || 'Admin'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email || 'admin@smartcalendar.com'}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          gap: sidebarCollapsed ? 1 : 0,
        }}>
          <Tooltip title={sidebarCollapsed ? "Toggle theme" : ""} placement="right" arrow>
            <IconButton
              size="small"
              onClick={toggleColorMode}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                },
              }}
            >
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
          <Tooltip title={sidebarCollapsed ? "Logout" : ""} placement="right" arrow>
            <IconButton
              size="small"
              onClick={handleLogout}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  bgcolor: mode === 'dark' ? alpha(theme.palette.error.main, 0.1) : 'transparent',
                },
              }}
            >
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  // Get theme for use in styles
  // const theme = {
  //   palette: {
  //     primary: {
  //       main: mode === 'dark' ? '#90caf9' : '#1976d2',
  //       light: mode === 'dark' ? '#bbdefb' : '#42a5f5',
  //       dark: mode === 'dark' ? '#42a5f5' : '#1565c0',
  //     }
  //   }
  // };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Modern Header Design */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: {
            xs: '100%',
            sm: `calc(100% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px)`
          },
          ml: { sm: sidebarCollapsed ? `${collapsedDrawerWidth}px` : `${drawerWidth}px` },
          bgcolor: mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          color: mode === 'dark' ? 'white' : 'text.primary',
          borderBottom: '1px solid',
          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 70 }}>
          {/* Left section - Page title with icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                display: { sm: 'none' },
                bgcolor: alpha(mode === 'dark' ? '#fff' : '#000', 0.04),
                '&:hover': {
                  bgcolor: alpha(mode === 'dark' ? '#fff' : '#000', 0.08),
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 1.5
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: 2,
                }}
              >
                {menuItems.find(item => item.path === location.pathname)?.icon || <Dashboard />}
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="600" letterSpacing="-0.01em">
                  {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Center - Search bar */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            flex: 1,
            maxWidth: 400,
            mx: 2,
          }}>
            <Box sx={{
              position: 'relative',
              width: '100%',
            }}>
              <Box sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
              }}>
                <SearchIcon fontSize="small" />
              </Box>
              <InputBase
                placeholder="Search clients, events..."
                sx={{
                  width: '100%',
                  pl: 5,
                  pr: 2,
                  py: 1,
                  borderRadius: 3,
                  bgcolor: mode === 'dark' ? alpha('#fff', 0.05) : alpha('#000', 0.04),
                  '&:hover': {
                    bgcolor: mode === 'dark' ? alpha('#fff', 0.08) : alpha('#000', 0.06),
                  },
                  '&.Mui-focused': {
                    bgcolor: mode === 'dark' ? alpha('#fff', 0.08) : alpha('#000', 0.06),
                    boxShadow: `0 0 0 2px ${mode === 'dark' ? alpha('#90caf9', 0.3) : alpha('#1976d2', 0.2)}`,
                  },
                  fontSize: '0.95rem',
                  transition: 'all 0.2s',
                }}
              />
            </Box>
          </Box>

          {/* Right section - Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Quick actions chips */}
            <Chip
              label="New Event"
              size="small"
              color="primary"
              onClick={() => navigate('/events/new')}
              sx={{
                display: { xs: 'none', lg: 'flex' },
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            />

            {/* Apps/Quick access */}
            <Tooltip title="Apps">
              <IconButton
                color="inherit"
                sx={{
                  bgcolor: alpha(mode === 'dark' ? '#fff' : '#000', 0.04),
                  '&:hover': {
                    bgcolor: alpha(mode === 'dark' ? '#fff' : '#000', 0.08),
                  },
                }}
              >
                <AppsIcon />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationsOpen}
                sx={{
                  bgcolor: alpha(mode === 'dark' ? '#fff' : '#000', 0.04),
                  '&:hover': {
                    bgcolor: alpha(mode === 'dark' ? '#fff' : '#000', 0.08),
                  },
                }}
              >
                <Badge badgeContent={3} color="error" variant="dot">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Theme toggle */}
            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{
                  bgcolor: alpha(mode === 'dark' ? '#fff' : '#000', 0.04),
                  '&:hover': {
                    bgcolor: alpha(mode === 'dark' ? '#fff' : '#000', 0.08),
                  },
                }}
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {/* Help */}
            <Tooltip title="Help">
              <IconButton
                color="inherit"
                sx={{
                  bgcolor: alpha(mode === 'dark' ? '#fff' : '#000', 0.04),
                  '&:hover': {
                    bgcolor: alpha(mode === 'dark' ? '#fff' : '#000', 0.08),
                  },
                  display: { xs: 'none', md: 'inline-flex' },
                }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>

            {/* User menu */}
            <Tooltip title="Account">
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                sx={{
                  ml: 0.5,
                  p: 0.5,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                  },
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.avatar || 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                width: 320,
                mt: 1.5,
                borderRadius: 2,
                boxShadow: 4,
                bgcolor: mode === 'dark' ? 'grey.900' : 'background.paper',
              },
            }}
          >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" fontWeight="600">
                Notifications
              </Typography>
              <Chip label="3 new" size="small" color="primary" />
            </Box>
            <Divider />
            <MenuItem sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}>
                  <Event fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="500">
                    New event added
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Client meeting scheduled for today
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    5 min ago
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <MenuItem sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'success.light' }}>
                  <People fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="500">
                    New client registered
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sarah Johnson joined
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    1 hour ago
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem sx={{ justifyContent: 'center', py: 1 }}>
              <Typography variant="body2" color="primary" fontWeight="500">
                View all notifications
              </Typography>
            </MenuItem>
          </Menu>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                width: 240,
                mt: 1.5,
                borderRadius: 2,
                boxShadow: 4,
                bgcolor: mode === 'dark' ? 'grey.900' : 'background.paper',
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                  {user?.avatar || 'A'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="600">
                    {user?.name || 'Admin User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email || 'admin@smartcalendar.com'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
            <MenuItem onClick={() => navigate('/profile')} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.light' }}>P</Avatar>
              </ListItemIcon>
              <ListItemText
                primary="Profile"
                secondary="View your profile"
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </MenuItem>
            <MenuItem onClick={() => setOpenChangePassword(true)} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Change Password"
                secondary="Update your password"
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                secondary="Account preferences"
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                secondary="Sign out of your account"
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: {
            xs: 0,
            sm: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth
          },
          flexShrink: { sm: 0 },
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: mode === 'dark' ? 'grey.900' : 'white',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth,
              transition: theme => theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: mode === 'dark' ? 'grey.900' : 'white',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            xs: '100%',
            sm: `calc(100% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px)`
          },
          maxWidth: '100%',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          mt: '70px',
          transition: theme => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>
      <ChangePasswordDialog
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </Box>
  );
};
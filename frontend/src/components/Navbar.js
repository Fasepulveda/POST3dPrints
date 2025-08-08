import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  InputBase,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, userType } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Products', path: '/products' },
    { text: 'Reels', path: '/reels' },
  ];

  if (user) {
    if (userType === 'seller') {
      menuItems.push({ text: 'Seller Dashboard', path: '/seller/dashboard' });
    } else {
      menuItems.push({ text: 'Buyer Dashboard', path: '/buyer/dashboard' });
    }
  }

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/ElongatedPOST3dPrints.png"
            alt="POST 3D Prints Logo"
            style={{
              width: '120px', // Bigger width
              height: 'auto', // Keeps aspect ratio (no squish)
            }}
          />
        </Box>

        {/* Center: Search bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: '2px solid black',
            borderRadius: 1,
            padding: '0 8px',
            width: '400px',
            bgcolor: 'background.paper',
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Search products..."
            sx={{ flex: 1 }}
          />
        </Box>

        {/* Right: Cart & User Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/cart"
            startIcon={
              <Badge badgeContent={items.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            }
          >
            Cart
          </Button>

          {user ? (
            <>
              <IconButton size="large" edge="end" color="inherit" onClick={handleMenu}>
                <PersonIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    onClick={() => {
                      handleClose();
                      navigate(item.path);
                    }}
                  >
                    {item.text}
                  </MenuItem>
                ))}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar> 
    </AppBar>
  );
};

export default Navbar;

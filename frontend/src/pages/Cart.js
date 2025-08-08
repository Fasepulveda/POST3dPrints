import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Box,
  Divider,
  IconButton,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const handleQuantityChange = (productId, increment) => {
    dispatch({
      type: 'cart/updateQuantity',
      payload: { productId, increment },
    });
  };

  const handleRemoveItem = (productId) => {
    dispatch({
      type: 'cart/removeItem',
      payload: productId,
    });
  };

  const handleCheckout = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    dispatch({
      type: 'cart/checkout',
    });
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <ShoppingCartIcon sx={{ mr: 1 }} />
        Your Cart
      </Typography>

      <Paper sx={{ p: 2 }}>
        {cartItems.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ py: 4 }}>
            Your cart is empty
          </Typography>
        ) : (
          <>
            <List>
              {cartItems.map((item) => (
                <React.Fragment key={item._id}>
                  <ListItem>
                    <ListItemText
                      primary={item.name}
                      secondary={`$${item.price} x ${item.quantity}`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={() => handleQuantityChange(item._id, -1)}
                        disabled={item.quantity === 1}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton
                        onClick={() => handleQuantityChange(item._id, 1)}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Box>
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        Remove
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Total: ${getTotal().toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Checkout
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Cart;

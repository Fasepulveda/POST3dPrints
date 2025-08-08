import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const BuyerDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Buyer Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Name" secondary={user?.name} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={user?.email} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {orders?.map((order) => (
              <Paper key={order._id} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1">
                  Order #{order._id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: ${order.totalPrice}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </Typography>
              </Paper>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BuyerDashboard;

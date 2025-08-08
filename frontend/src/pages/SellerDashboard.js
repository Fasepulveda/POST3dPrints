import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState(0);
  const [newProductDialog, setNewProductDialog] = useState(false);
  const [productFormData, setProductFormData] = useState({
    title: '',
    description: '',
    material: 'PLA',
    price: '',
    quantity: '',
    colorOptions: [],
    estimatedPrintTime: '',
    estimatedShippingTime: '',
    category: '',
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['sellerProducts', user._id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/products/seller/${user._id}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['sellerOrders', user._id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/orders/seller/${user._id}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
  });

  const handleAddProduct = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add product');
      return response.json();
    },
    onSuccess: () => {
      setNewProductDialog(false);
      window.location.reload();
    },
  });

  const handleUpdateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update order status');
      return response.json();
    },
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenNewProductDialog = () => {
    setNewProductDialog(true);
  };

  const handleCloseNewProductDialog = () => {
    setNewProductDialog(false);
    setProductFormData({
      title: '',
      description: '',
      material: 'PLA',
      price: '',
      quantity: '',
      colorOptions: [],
      estimatedPrintTime: '',
      estimatedShippingTime: '',
      category: '',
    });
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: value,
    });
  };

  const handleAddColor = () => {
    setProductFormData({
      ...productFormData,
      colorOptions: [...productFormData.colorOptions, ''],
    });
  };

  const handleRemoveColor = (index) => {
    const colors = [...productFormData.colorOptions];
    colors.splice(index, 1);
    setProductFormData({
      ...productFormData,
      colorOptions: colors,
    });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      await handleAddProduct.mutateAsync({
        ...productFormData,
        seller: user._id,
      });
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Seller Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenNewProductDialog}
          >
            Add New Product
          </Button>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mt: 2 }}>
          <Tab label="Products" />
          <Tab label="Orders" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ mt: 2 }}>
            {productsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {products?.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'contain',
                          borderRadius: '4px',
                        }}
                      />
                      <Typography variant="h6" gutterBottom>
                        {product.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.description.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" color="primary">
                          ${product.price}
                        </Typography>
                        <Box>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            {ordersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {orders?.map((order) => (
                  <Grid item xs={12} key={order._id}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Order #{order._id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Status: {order.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total: ${order.totalAmount}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {order.items.map((item) => (
                          <Box key={item.product._id} sx={{ mb: 2 }}>
                            <Typography variant="body1">
                              {item.product.title} x {item.quantity}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Color: {item.color}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            handleUpdateOrderStatus.mutate({
                              orderId: order._id,
                              status: 'processing',
                            });
                          }}
                        >
                          Process Order
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Paper>

      <Dialog open={newProductDialog} onClose={handleCloseNewProductDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmitProduct}>
            <TextField
              fullWidth
              margin="normal"
              label="Product Title"
              name="title"
              value={productFormData.title}
              onChange={handleProductFormChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              value={productFormData.description}
              onChange={handleProductFormChange}
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Material"
              name="material"
              select
              value={productFormData.material}
              onChange={handleProductFormChange}
              required
            >
              <MenuItem value="PLA">PLA</MenuItem>
              <MenuItem value="ABS">ABS</MenuItem>
              <MenuItem value="Resin">Resin</MenuItem>
              <MenuItem value="Nylon">Nylon</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              label="Price"
              name="price"
              type="number"
              value={productFormData.price}
              onChange={handleProductFormChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Quantity"
              name="quantity"
              type="number"
              value={productFormData.quantity}
              onChange={handleProductFormChange}
              required
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Color Options
              </Typography>
              {productFormData.colorOptions.map((color, index) => (
                <TextField
                  key={index}
                  fullWidth
                  margin="normal"
                  label={`Color ${index + 1}`}
                  value={color}
                  onChange={(e) => {
                    const colors = [...productFormData.colorOptions];
                    colors[index] = e.target.value;
                    setProductFormData({
                      ...productFormData,
                      colorOptions: colors,
                    });
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveColor(index)}
                      >
                        Remove
                      </IconButton>
                    ),
                  }}
                />
              ))}
              <Button
                variant="outlined"
                onClick={handleAddColor}
                sx={{ mt: 1 }}
              >
                Add Color
              </Button>
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="Estimated Print Time"
              name="estimatedPrintTime"
              value={productFormData.estimatedPrintTime}
              onChange={handleProductFormChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Estimated Shipping Time"
              name="estimatedShippingTime"
              value={productFormData.estimatedShippingTime}
              onChange={handleProductFormChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Category"
              name="category"
              value={productFormData.category}
              onChange={handleProductFormChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewProductDialog}>Cancel</Button>
          <Button type="submit" onClick={handleSubmitProduct} variant="contained" color="primary">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SellerDashboard;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  Skeleton,
  Rating,
  TextField,
  Alert,
  IconButton,
} from '@mui/material';
import {
  AddShoppingCart as AddShoppingCartIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { addToCart } from '../features/cartSlice';
import { useQuery } from '@tanstack/react-query';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },
  });

  const [selectedColor, setSelectedColor] = useState(product?.colorOptions[0] || '');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: id,
          quantity,
          color: selectedColor,
        })
      );
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={500} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Error loading product details</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={product.images[0]}
              alt={product.title}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.title}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product.description}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Material
              </Typography>
              <Chip
                label={product.material}
                size="small"
                sx={{ mr: 1 }}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Dimensions
              </Typography>
              <Chip
                label={`${product.dimensions.width}x${product.dimensions.height}x${product.dimensions.depth} ${product.dimensions.unit}`}
                size="small"
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Color Options
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {product.colorOptions.map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    size="small"
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      backgroundColor: selectedColor === color ? 'primary.main' : 'transparent',
                      color: selectedColor === color ? 'white' : 'text.primary',
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value))))}
                InputProps={{
                  inputProps: { min: 1, max: product.quantity },
                }}
                size="small"
                sx={{ width: '100px' }}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                fullWidth
                disabled={!user}
              >
                Add to Cart
              </Button>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <IconButton color="primary">
                <FavoriteIcon />
              </IconButton>
              <IconButton color="primary">
                <ShareIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Product Reviews
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={product.rating} readOnly precision={0.5} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviews.length} reviews)
          </Typography>
        </Box>

        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {product.reviews.length === 0
              ? 'Be the first to review this product!'
              : 'Showing all reviews'}
          </Typography>
        </Paper>

        {product.reviews.map((review) => (
          <Paper
            key={review._id}
            elevation={1}
            sx={{ p: 2, mb: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Rating value={review.rating} readOnly precision={0.5} />
              <Typography variant="body1" sx={{ ml: 2 }}>
                {review.comment}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default ProductDetails;

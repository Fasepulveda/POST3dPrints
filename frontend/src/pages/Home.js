import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Skeleton,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const response = await fetch(`http://localhost:${process.env.REACT_APP_API_PORT}/api/products/featured`);
      if (!response.ok) throw new Error('Failed to fetch featured products');
      return response.json();
    },
  });

  const categories = [
    '3D Models',
    'Custom Prints',
    'Resin Prints',
    'FDM Prints',
    'SLS Prints',
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to POST 3D Prints
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover and purchase unique 3D printed products from talented makers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
          onClick={() => window.location.href = '/products'}
        >
          Browse Products
        </Button>
      </Box>

      {/* Categories Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              clickable
              onClick={() => window.location.href = `/products?category=${category}`}
              sx={{
                height: '40px',
                '&:hover': {
                  bgcolor: 'primary.light',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Featured Products Section */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Featured Products
        </Typography>
        <Grid container spacing={3}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Skeleton variant="rectangular" height={200} />
                <Box sx={{ mt: 2 }}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </Box>
              </Grid>
            ))
          ) : (
            featuredProducts?.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <img src="/Logo 3D Moderne de POST Prints.png" alt="POST 3D Prints Logo" style={{ width: '60px', height: '60px', marginRight: '16px' }} />
                  <Box sx={{
                    height: 200,
                    position: 'relative',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    '&:hover': {
                      img: {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.3s ease-in-out',
                      },
                    },
                  }}>
                    <img
                      src={product.images?.[0] || `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name || '3D+Print')}`}
                      alt={product.name || '3D Print'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        {product.name || '3D Print'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {product.description || 'A beautiful 3D printed creation'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Typography variant="h6" color="primary">
                          ${product.price?.toFixed(2) || '0.00'}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => window.location.href = `/products/${product._id}`}
                          sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                            fontSize: '0.875rem',
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;

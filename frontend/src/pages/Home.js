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

  // Example dummy featured products fallback
  const exampleProducts = [
    {
      _id: 'ex1',
      name: 'Dinosaur Model',
      description: 'A detailed 3D printed dinosaur figure.',
      price: 29.99,
      images: ['/PrintPlaceholder.png'],
    },
    {
      _id: 'ex2',
      name: 'Spaceship Model',
      description: 'A cool 3D printed spaceship.',
      price: 39.99,
      images: ['/PrintPlaceholder.png'],
    },
    {
      _id: 'ex3',
      name: 'Robot Model',
      description: 'A futuristic robot figurine.',
      price: 45.50,
      images: ['/PrintPlaceholder.png'],
    },
    {
      _id: 'ex4',
      name: 'Chess Set',
      description: '3D printed custom chess set.',
      price: 49.99,
      images: ['/PrintPlaceholder.png'],
    },
    {
      _id: 'ex5',
      name: 'Mechanical Gear',
      description: 'Intricate mechanical gear model.',
      price: 19.99,
      images: ['/PrintPlaceholder.png'],
    },
    {
      _id: 'ex6',
      name: 'Phone Stand',
      description: 'Practical 3D printed phone stand.',
      price: 14.99,
      images: ['/PrintPlaceholder.png'],
    },
    {
      _id: 'ex7',
      name: 'Keychain',
      description: 'Customizable keychain model.',
      price: 9.99,
      images: ['/PrintPlaceholder.png'],
    },
    {
      _id: 'ex8',
      name: 'Puzzle Cube',
      description: '3D printed puzzle cube.',
      price: 24.99,
      images: ['/PrintPlaceholder.png'],
    },
    {
      _id: 'ex9',
      name: 'Vase',
      description: 'Elegant 3D printed vase.',
      price: 34.99,
      images: ['/PrintPlaceholder.png'],
    },
  ];

  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:${process.env.REACT_APP_API_PORT}/api/products/featured`
      );
      if (!response.ok) throw new Error('Failed to fetch featured products');
      return response.json();
    },
  });

  const productsToShow =
    featuredProducts && featuredProducts.length > 0
      ? featuredProducts.slice(0, 9)
      : exampleProducts;

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
          onClick={() => (window.location.href = '/products')}
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
              onClick={() =>
                (window.location.href = `/products?category=${category}`)
              }
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
          {isLoading
            ? Array.from({ length: 9 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '12px' }} />
                  <Box sx={{ mt: 2 }}>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </Box>
                </Grid>
              ))
            : productsToShow.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '12px',
                      transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 300,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        mb: 2,
                      }}
                    >
                      <img
                        src={
                          product.images?.[0] ||
                          `https://via.placeholder.com/400x300?text=${encodeURIComponent(
                            product.name || '3D+Print'
                          )}`
                        }
                        alt={product.name || '3D Print'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {product.name || '3D Print'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {product.description || 'A beautiful 3D printed creation'}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 'auto',
                      }}
                    >
                      <Typography variant="h6" color="primary">
                        ${product.price?.toFixed(2) || '0.00'}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => (window.location.href = `/products/${product._id}`)}
                        sx={{
                          borderRadius: '20px',
                          textTransform: 'none',
                          fontSize: '0.875rem',
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;

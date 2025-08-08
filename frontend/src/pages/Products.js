import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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

const Products = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          Error loading products. Please try again later.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>

      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Skeleton variant="rectangular" height={200} />
                  <Box sx={{ mt: 2 }}>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </Box>
                </Paper>
              </Grid>
            ))
          : products?.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                  <Box sx={{ flexGrow: 1, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={product.material}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={`${product.dimensions.width}x${product.dimensions.height}x${product.dimensions.depth} ${product.dimensions.unit}`}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>
                    {user && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/products/${product._id}`);
                        }}
                      >
                        View Details
                      </Button>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default Products;

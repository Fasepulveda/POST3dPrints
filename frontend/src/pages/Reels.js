import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
  TextField,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

const Reels = () => {
  const [activeReel, setActiveReel] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const { data: reels, isLoading, error } = useQuery({
    queryKey: ['reels'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/reels');
      if (!response.ok) throw new Error('Failed to fetch reels');
      return response.json();
    },
  });

  const handleLike = async (reelId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reels/${reelId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to like reel');
      // Refresh the reels data
      window.location.reload();
    } catch (error) {
      console.error('Failed to like reel:', error);
    }
  };

  const handleComment = async (reelId) => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/reels/${reelId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ comment: newComment }),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      
      // Clear comment input and refresh comments
      setNewComment('');
      window.location.reload();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Skeleton variant="rectangular" width={300} height={500} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Error loading reels</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Build Showcases
      </Typography>

      <Grid container spacing={3}>
        {reels?.map((reel) => (
          <Grid item xs={12} sm={6} md={4} key={reel._id}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  mb: 2,
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                onClick={() => setActiveReel(reel._id)}
              >
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(reel._id);
                    }}
                  >
                    {reel.likes.includes(localStorage.getItem('userId')) ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                {reel.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {reel.description}
              </Typography>

              {activeReel === reel._id && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleComment(reel._id)}
                    disabled={!newComment.trim()}
                  >
                    Comment
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Reels;

import { authFetch } from './client';

export const postsAPI = {
  // GET /api/posts?limit&offset
  getAll: async ({ limit = 50, offset = 0 } = {}) => {
    return authFetch(`/posts?limit=${limit}&offset=${offset}`);
  },

  // GET /api/posts/:postId
  getById: async (postId) => {
    return authFetch(`/posts/${postId}`);
  },

  // GET /api/posts/user/:userId
  getByUser: async (userId) => {
    return authFetch(`/posts/user/${userId}`);
  },

  // POST /api/posts (requires auth)
  create: async ({ postType = 'status', locationId, content, imageUrl, videoUrl }) => {
    return authFetch('/posts', {
      method: 'POST',
      body: JSON.stringify({ postType, locationId, content, imageUrl, videoUrl }),
    });
  },

  // POST /api/posts/:postId/like (requires auth)
  toggleLike: async (postId) => {
    return authFetch(`/posts/${postId}/like`, { method: 'POST' });
  },

  getByLocation: async (locationId) => {
    return authFetch(`/posts/location/${locationId}`);
  },

  // GET /api/posts/:postId/comments
  getComments: async (postId) => {
    return authFetch(`/posts/${postId}/comments`);
  },

  // POST /api/posts/:postId/comments (requires auth)
  addComment: async (postId, { content, rating }) => {
    return authFetch(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, rating }),
    });
  },

  // GET /api/posts/liked (requires auth)
  getLiked: async () => {
    return authFetch('/posts/liked');
  },
};

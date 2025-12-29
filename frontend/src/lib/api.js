const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token;
};

// Helper function for authenticated requests
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Post APIs
export const postAPI = {
  // Get all posts
  getAllPosts: async (limit = 50, offset = 0) => {
    return authFetch(`${API_BASE}/posts?limit=${limit}&offset=${offset}`);
  },

  // Get single post
  getPost: async (postId) => {
    return authFetch(`${API_BASE}/posts/${postId}`);
  },

  // Get posts by user
  getUserPosts: async (userId) => {
    return authFetch(`${API_BASE}/posts/user/${userId}`);
  },

  // Create post
  createPost: async (postData) => {
    return authFetch(`${API_BASE}/posts`, {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  // Toggle like
  toggleLike: async (postId) => {
    return authFetch(`${API_BASE}/posts/${postId}/like`, {
      method: 'POST',
    });
  },

  // Get comments
  getComments: async (postId) => {
    return authFetch(`${API_BASE}/posts/${postId}/comments`);
  },

  // Add comment
  addComment: async (postId, content, rating) => {
    return authFetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, rating }),
    });
  },
};

// Location APIs
export const locationAPI = {
  // Create location
  createLocation: async (locationData) => {
    return authFetch(`${API_BASE}/locations`, {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  },

  // Get nearby locations
  getNearbyLocations: async (params) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API_BASE}/locations/nearby?${query}`);
  },
};

// Auth APIs (if you need to update them)
export const authAPI = {
  register: async (userData) => {
    return authFetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email, password) => {
    return authFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getProfile: async () => {
    return authFetch(`${API_BASE}/auth/profile`);
  },
};
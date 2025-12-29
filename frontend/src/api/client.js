const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Read auth token from localStorage
const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token;
  } catch {
    return undefined;
  }
};

// Unified authenticated fetch wrapper
export const authFetch = async (path, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // Attempt to parse JSON error body
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      message = body?.error || body?.message || message;
    } catch {}
    throw new Error(message);
  }

  // Some endpoints (e.g., 204) may have no body
  if (response.status === 204) return null;
  return response.json();
};

export const apiBase = API_BASE;

import { authFetch } from './client';

export const locationsAPI = {
  // POST /api/locations
  create: async (payload) => {
    return authFetch('/locations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // GET /api/locations/nearby?userId&lat&lng&radius
  nearby: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`/locations/nearby?${query}`);
  },
  // GET /api/locations/:id
  getById: async (id) => {
    return authFetch(`/locations/${id}`);
  },
};

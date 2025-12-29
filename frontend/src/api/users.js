import { authFetch } from './client';

export const usersAPI = {
  getById: async (userId) => {
    return authFetch(`/auth/user/${userId}`);
  },
};

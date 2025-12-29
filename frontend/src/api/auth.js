import { authFetch } from './client';

export const authAPI = {
  register: async ({ name, email, password, language = 'ja', homeLat, homeLng }) => {
    // Backend expects name, email, password (+ optional fields)
    return authFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, language, homeLat, homeLng }),
    });
  },

  login: async (email, password) => {
    const res = await authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // shape: { user, token }
    return res;
  },

  getProfile: async () => {
    return authFetch('/auth/profile');
  },
  googleLogin: async (idToken) => {
    return authFetch('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },
};

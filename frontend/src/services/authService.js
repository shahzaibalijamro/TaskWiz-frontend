import api from './api';

export const authService = {
  signup: async (username, password) => {
    const response = await api.post('/user/auth/signup', {
      username: username.toLowerCase().trim(),
      password,
    });
    return response.data;
  },

  signin: async (username, password) => {
    const response = await api.post('/user/auth/signin', {
      username: username.trim(),
      password,
    });
    return response.data;
  },
};
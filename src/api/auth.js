import { apiClient } from './client.js';

export const authApi = {
  async register(email, password, displayName) {
    return apiClient.post('/auth/register', { email, password, displayName });
  },

  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.success && response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  async logout() {
    apiClient.setToken(null);
    return { success: true };
  },

  isAuthenticated() {
    return !!apiClient.token;
  }
};

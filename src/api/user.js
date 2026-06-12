import { apiClient } from './client.js';

export const userApi = {
  async getProfile() {
    return apiClient.get('/users/profile');
  },

  async updateProfile(updates) {
    return apiClient.put('/users/profile', updates);
  },

  async getPreferences() {
    return apiClient.get('/users/preferences');
  },

  async updatePreferences(preferences) {
    return apiClient.put('/users/preferences', preferences);
  },

  async deleteAccount() {
    return apiClient.delete('/users/account');
  }
};

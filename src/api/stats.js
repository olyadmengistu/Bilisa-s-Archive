import { apiClient } from './client.js';

export const statsApi = {
  async getUserStats() {
    return apiClient.get('/stats');
  },

  async getActivityStats(days = 30) {
    return apiClient.get('/stats/activity', { days });
  },

  async getStudySessionStats() {
    return apiClient.get('/stats/study-sessions');
  },

  async getRecentActivity(limit = 20) {
    return apiClient.get('/stats/recent-activity', { limit });
  },

  async getStorageUsage() {
    return apiClient.get('/stats/storage');
  }
};

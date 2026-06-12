import { apiClient } from './client.js';

export const backupApi = {
  async exportData() {
    return apiClient.get('/backup/export');
  },

  async importData(data) {
    return apiClient.post('/backup/import', { data });
  },

  async createBackup() {
    return apiClient.post('/backup/create');
  },

  async listBackups() {
    return apiClient.get('/backup/list');
  },

  async deleteBackup(backupId) {
    return apiClient.delete(`/backup/${backupId}`);
  }
};

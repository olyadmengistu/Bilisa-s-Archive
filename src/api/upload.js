import { apiClient } from './client.js';

export const uploadApi = {
  async uploadPdf(file) {
    return apiClient.upload('/upload/pdf', file);
  },

  async uploadMultiplePdfs(files) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const url = `${apiClient.baseURL}/upload/pdfs`;
    const config = {
      method: 'POST',
      headers: apiClient.token ? { 'Authorization': `Bearer ${apiClient.token}` } : {},
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
};

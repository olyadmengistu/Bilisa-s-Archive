import { apiClient } from './client.js';

export const searchApi = {
  async fullTextSearch(query, filters = {}) {
    return apiClient.get('/search', { q: query, ...filters });
  },

  async searchByKeywords(keywords, filters = {}) {
    return apiClient.get('/search/keywords', { 
      keywords: Array.isArray(keywords) ? keywords.join(',') : keywords,
      ...filters 
    });
  },

  async searchByTags(tags, filters = {}) {
    return apiClient.get('/search/tags', { 
      tags: Array.isArray(tags) ? tags.join(',') : tags,
      ...filters 
    });
  },

  async advancedSearch(searchParams) {
    return apiClient.post('/search/advanced', searchParams);
  },

  async getSuggestions(term) {
    return apiClient.get('/search/suggestions', { term });
  }
};

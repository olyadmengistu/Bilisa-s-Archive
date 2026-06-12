import { apiClient } from './client.js';

export const notesApi = {
  async getAllNotes(filters = {}) {
    return apiClient.get('/notes', filters);
  },

  async getNoteById(id) {
    return apiClient.get(`/notes/${id}`);
  },

  async createNote(noteData) {
    return apiClient.post('/notes', noteData);
  },

  async updateNote(id, updateData) {
    return apiClient.put(`/notes/${id}`, updateData);
  },

  async deleteNote(id) {
    return apiClient.delete(`/notes/${id}`);
  },

  async getNotesBySubject(subject) {
    return apiClient.get(`/notes/subject/${subject}`);
  },

  async getFavoriteNotes() {
    return apiClient.get('/notes/favorites/list');
  },

  async getArchivedNotes() {
    return apiClient.get('/notes/archived/list');
  }
};

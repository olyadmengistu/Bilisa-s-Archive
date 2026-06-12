// API client for communicating with Vercel serverless functions

const API_BASE = '/api';

// Helper function to get user ID from localStorage
const getUserId = () => {
  return localStorage.getItem('userId');
};

// Helper function to set user ID in localStorage
const setUserId = (userId) => {
  localStorage.setItem('userId', userId);
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const userId = getUserId();
  return {
    'Content-Type': 'application/json',
    'X-User-Id': userId || ''
  };
};

// Auth API
export const authAPI = {
  async signup(email, password, displayName) {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName })
    });
    return response.json();
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }
};

// Notes API
export const notesAPI = {
  async getAllNotes() {
    const response = await fetch(`${API_BASE}/notes`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  async getNoteById(id) {
    const response = await fetch(`${API_BASE}/notes?id=${id}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  async createNote(noteData) {
    const response = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData)
    });
    return response.json();
  },

  async updateNote(id, updateData) {
    const response = await fetch(`${API_BASE}/notes?id=${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return response.json();
  },

  async deleteNote(id) {
    const response = await fetch(`${API_BASE}/notes?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  async searchNotes(filters) {
    const params = new URLSearchParams({
      search: 'true',
      ...filters
    });
    const response = await fetch(`${API_BASE}/notes?${params}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  async getStats() {
    const response = await fetch(`${API_BASE}/notes?stats=true`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

export { getUserId, setUserId };

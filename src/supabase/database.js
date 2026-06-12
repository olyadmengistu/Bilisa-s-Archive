import { supabase } from './config';

// Table names
const NOTES_TABLE = 'notes';

export const supabaseDbService = {
  // Add a new note
  async addNote(userId, noteData) {
    try {
      console.log('supabaseDbService.addNote called with userId:', userId);
      console.log('supabaseDbService.addNote noteData:', noteData);

      const noteWithTimestamp = {
        ...noteData,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        keywords: this.extractKeywords(noteData.content || '')
      };

      const { data, error } = await supabase
        .from(NOTES_TABLE)
        .insert(noteWithTimestamp)
        .select()
        .single();

      if (error) throw error;

      console.log('Note added successfully with ID:', data.id);
      return { success: true, id: data.id };
    } catch (error) {
      console.error('Error in supabaseDbService.addNote:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all notes for a user
  async getAllNotes(userId) {
    try {
      const { data, error } = await supabase
        .from(NOTES_TABLE)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, notes: data || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get a single note by ID
  async getNoteById(userId, noteId) {
    try {
      const { data, error } = await supabase
        .from(NOTES_TABLE)
        .select('*')
        .eq('id', noteId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return { success: true, note: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update a note
  async updateNote(userId, noteId, updateData) {
    try {
      const noteWithTimestamp = {
        ...updateData,
        updated_at: new Date().toISOString(),
        keywords: this.extractKeywords(updateData.content || '')
      };

      const { error } = await supabase
        .from(NOTES_TABLE)
        .update(noteWithTimestamp)
        .eq('id', noteId)
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete a note
  async deleteNote(userId, noteId) {
    try {
      const { error } = await supabase
        .from(NOTES_TABLE)
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search notes with filters
  async searchNotes(userId, filters = {}) {
    try {
      let query = supabase
        .from(NOTES_TABLE)
        .select('*')
        .eq('user_id', userId);

      // Apply filters
      if (filters.grade && filters.grade !== 'all') {
        query = query.eq('grade', filters.grade);
      }

      if (filters.subject && filters.subject !== 'all') {
        query = query.eq('subject', filters.subject);
      }

      if (filters.unit && filters.unit !== 'all') {
        query = query.eq('unit', filters.unit);
      }

      // Always order by creation date
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      let notes = data || [];

      // Client-side filtering for keywords
      if (filters.keywords && filters.keywords.trim()) {
        const searchTerm = filters.keywords.toLowerCase();
        notes = notes.filter(note =>
          note.content?.toLowerCase().includes(searchTerm) ||
          note.title?.toLowerCase().includes(searchTerm) ||
          note.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm))
        );
      }

      return { success: true, notes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get statistics
  async getStats(userId) {
    try {
      const { data, error } = await supabase
        .from(NOTES_TABLE)
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const totalNotes = data?.length || 0;
      const gradeStats = {};

      data?.forEach(note => {
        gradeStats[note.grade] = (gradeStats[note.grade] || 0) + 1;
      });

      return { success: true, stats: { totalNotes, gradeStats } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Real-time listener for notes
  onNotesChange(userId, callback) {
    const subscription = supabase
      .channel(`notes:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: NOTES_TABLE,
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          // Fetch all notes when change occurs
          const result = await this.getAllNotes(userId);
          if (result.success) {
            callback(result.notes);
          }
        }
      )
      .subscribe();

    // Initial fetch
    this.getAllNotes(userId).then(result => {
      if (result.success) {
        callback(result.notes);
      }
    });

    return () => {
      supabase.removeChannel(subscription);
    };
  },

  // Extract keywords from content
  extractKeywords(content) {
    if (!content) return [];

    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could'].includes(word));

    return [...new Set(words)].slice(0, 20);
  }
};

export default supabaseDbService;

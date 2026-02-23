import type { Prompt } from '../models/Prompt';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'prompt-manager-prompts';
const TABLE_NAME = 'prompts';
const IS_PROD = import.meta.env.PROD;

const isStorageMisconfigured = () => IS_PROD && !isSupabaseConfigured();

const getMisconfigurationError = () =>
  new Error(
    'Cloud sync is not configured for this deployed app. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in hosting environment settings, then redeploy.'
  );

// Local Storage Operations (fallback)
const localStorageOps = {
  getPrompts: (): Prompt[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  savePrompts: (prompts: Prompt[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  addPrompt: (prompt: Prompt): Prompt[] => {
    const prompts = localStorageOps.getPrompts();
    const updatedPrompts = [...prompts, prompt];
    localStorageOps.savePrompts(updatedPrompts);
    return updatedPrompts;
  },

  updatePrompt: (updatedPrompt: Prompt): Prompt[] => {
    const prompts = localStorageOps.getPrompts();
    const updatedPrompts = prompts.map((p) =>
      p.id === updatedPrompt.id ? updatedPrompt : p
    );
    localStorageOps.savePrompts(updatedPrompts);
    return updatedPrompts;
  },

  deletePrompt: (id: string): Prompt[] => {
    const prompts = localStorageOps.getPrompts();
    const updatedPrompts = prompts.filter((p) => p.id !== id);
    localStorageOps.savePrompts(updatedPrompts);
    return updatedPrompts;
  },
};

// Supabase Operations
const supabaseOps = {
  getPrompts: async (): Promise<Prompt[]> => {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching from Supabase:', error);
      return [];
    }
    
    // Transform snake_case to camelCase
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      color: item.color,
    }));
  },

  addPrompt: async (prompt: Prompt): Promise<Prompt[]> => {
    if (!supabase) return [];
    
    const { error } = await supabase
      .from(TABLE_NAME)
      .insert([{
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        color: prompt.color,
        created_at: prompt.createdAt,
        updated_at: prompt.updatedAt,
      }]);
    
    if (error) {
      console.error('Error adding to Supabase:', error);
    }
    
    return supabaseOps.getPrompts();
  },

  updatePrompt: async (updatedPrompt: Prompt): Promise<Prompt[]> => {
    if (!supabase) return [];
    
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({
        title: updatedPrompt.title,
        description: updatedPrompt.description,
        color: updatedPrompt.color,
        updated_at: updatedPrompt.updatedAt,
      })
      .eq('id', updatedPrompt.id);
    
    if (error) {
      console.error('Error updating in Supabase:', error);
    }
    
    return supabaseOps.getPrompts();
  },

  deletePrompt: async (id: string): Promise<Prompt[]> => {
    if (!supabase) return [];
    
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting from Supabase:', error);
    }
    
    return supabaseOps.getPrompts();
  },
};

// Unified Storage Service
export const storageService = {
  isUsingSupabase: isSupabaseConfigured(),
  isMisconfigured: isStorageMisconfigured(),

  getPrompts: async (): Promise<Prompt[]> => {
    if (isSupabaseConfigured()) {
      return supabaseOps.getPrompts();
    }
    if (isStorageMisconfigured()) {
      throw getMisconfigurationError();
    }
    return localStorageOps.getPrompts();
  },

  addPrompt: async (prompt: Prompt): Promise<Prompt[]> => {
    if (isSupabaseConfigured()) {
      return supabaseOps.addPrompt(prompt);
    }
    if (isStorageMisconfigured()) {
      throw getMisconfigurationError();
    }
    return localStorageOps.addPrompt(prompt);
  },

  updatePrompt: async (updatedPrompt: Prompt): Promise<Prompt[]> => {
    if (isSupabaseConfigured()) {
      return supabaseOps.updatePrompt(updatedPrompt);
    }
    if (isStorageMisconfigured()) {
      throw getMisconfigurationError();
    }
    return localStorageOps.updatePrompt(updatedPrompt);
  },

  deletePrompt: async (id: string): Promise<Prompt[]> => {
    if (isSupabaseConfigured()) {
      return supabaseOps.deletePrompt(id);
    }
    if (isStorageMisconfigured()) {
      throw getMisconfigurationError();
    }
    return localStorageOps.deletePrompt(id);
  },
};

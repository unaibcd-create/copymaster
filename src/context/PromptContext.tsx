import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useDeferredValue,
  type ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Prompt } from '../models/Prompt';
import { storageService } from '../services/storageService';

interface PromptContextType {
  prompts: Prompt[];
  selectedPrompt: Prompt | null;
  searchQuery: string;
  isLoading: boolean;
  setSelectedPrompt: (prompt: Prompt | null) => void;
  setSearchQuery: (query: string) => void;
  addPrompt: (title: string, description: string, color?: string) => Promise<void>;
  updatePrompt: (prompt: Prompt) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  refreshPrompts: () => Promise<void>;
  filteredPrompts: Prompt[];
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider = ({ children }: { children: ReactNode }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const refreshPrompts = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedPrompts = await storageService.getPrompts();
      setPrompts(loadedPrompts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshPrompts();
  }, [refreshPrompts]);

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredPrompts = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();
    if (!query) {
      return prompts;
    }

    return prompts.filter((prompt) => {
      return (
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query)
      );
    });
  }, [prompts, deferredSearchQuery]);

  const addPrompt = useCallback(async (title: string, description: string, color?: string) => {
    const now = new Date().toISOString();
    const newPrompt: Prompt = {
      id: uuidv4(),
      title,
      description,
      createdAt: now,
      updatedAt: now,
      color,
    };
    const updatedPrompts = await storageService.addPrompt(newPrompt);
    setPrompts(updatedPrompts);
  }, []);

  const updatePrompt = useCallback(async (updatedPrompt: Prompt) => {
    const prompt: Prompt = {
      ...updatedPrompt,
      updatedAt: new Date().toISOString(),
    };

    const updatedPrompts = await storageService.updatePrompt(prompt);
    setPrompts(updatedPrompts);
    setSelectedPrompt((current) => (current?.id === prompt.id ? prompt : current));
  }, []);

  const deletePrompt = useCallback(async (id: string) => {
    const updatedPrompts = await storageService.deletePrompt(id);
    setPrompts(updatedPrompts);
    setSelectedPrompt((current) => (current?.id === id ? null : current));
  }, []);

  const contextValue = useMemo(
    () => ({
      prompts,
      selectedPrompt,
      searchQuery,
      isLoading,
      setSelectedPrompt,
      setSearchQuery,
      addPrompt,
      updatePrompt,
      deletePrompt,
      refreshPrompts,
      filteredPrompts,
    }),
    [
      prompts,
      selectedPrompt,
      searchQuery,
      isLoading,
      addPrompt,
      updatePrompt,
      deletePrompt,
      refreshPrompts,
      filteredPrompts,
    ]
  );

  return <PromptContext.Provider value={contextValue}>{children}</PromptContext.Provider>;
};

export const usePrompts = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  return context;
};

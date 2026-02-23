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
  storageError: string | null;
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
  const [storageError, setStorageError] = useState<string | null>(null);

  const toErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'Unexpected storage error';

  const fetchPrompts = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    }

    try {
      const loadedPrompts = await storageService.getPrompts();
      setPrompts(loadedPrompts);
      setStorageError(null);
    } catch (error) {
      setStorageError(toErrorMessage(error));
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  }, []);

  const refreshPrompts = useCallback(async () => {
    await fetchPrompts(true);
  }, [fetchPrompts]);

  useEffect(() => {
    const cachedPrompts = storageService.getCachedPrompts();
    if (cachedPrompts.length > 0) {
      setPrompts(cachedPrompts);
      setIsLoading(false);
      void fetchPrompts(false);
      return;
    }

    void fetchPrompts(true);
  }, [fetchPrompts]);

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
    try {
      const updatedPrompts = await storageService.addPrompt(newPrompt);
      setPrompts(updatedPrompts);
      setStorageError(null);
    } catch (error) {
      setStorageError(toErrorMessage(error));
    }
  }, []);

  const updatePrompt = useCallback(async (updatedPrompt: Prompt) => {
    const prompt: Prompt = {
      ...updatedPrompt,
      updatedAt: new Date().toISOString(),
    };

    try {
      const updatedPrompts = await storageService.updatePrompt(prompt);
      setPrompts(updatedPrompts);
      setSelectedPrompt((current) => (current?.id === prompt.id ? prompt : current));
      setStorageError(null);
    } catch (error) {
      setStorageError(toErrorMessage(error));
    }
  }, []);

  const deletePrompt = useCallback(async (id: string) => {
    try {
      const updatedPrompts = await storageService.deletePrompt(id);
      setPrompts(updatedPrompts);
      setSelectedPrompt((current) => (current?.id === id ? null : current));
      setStorageError(null);
    } catch (error) {
      setStorageError(toErrorMessage(error));
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      prompts,
      selectedPrompt,
      searchQuery,
      isLoading,
      storageError,
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
      storageError,
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

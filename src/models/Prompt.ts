export interface Prompt {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  color?: string;
}

export const PROMPT_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#0ea5e9', // Sky
  '#64748b', // Slate
] as const;

export type PromptColor = typeof PROMPT_COLORS[number];

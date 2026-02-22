export interface Prompt {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  color?: string;
}

export const PROMPT_COLORS = [
  '#22c55e', // Green
  '#8b5cf6', // Purple
  '#f97316', // Orange
] as const;

export type PromptColor = typeof PROMPT_COLORS[number];

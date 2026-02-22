import type { Prompt } from '../../models/Prompt';
import { usePrompts } from '../../context/PromptContext';
import { PromptCard } from '../PromptCard/PromptCard';
import './PromptGrid.css';

interface PromptGridProps {
  onLongPressEdit: (prompt: Prompt) => void;
}

export const PromptGrid = ({ onLongPressEdit }: PromptGridProps) => {
  const { filteredPrompts, isLoading } = usePrompts();

  if (isLoading) {
    return (
      <div className="prompt-grid-loading">
        <div className="loading-spinner"></div>
        <p>Loading prompts...</p>
      </div>
    );
  }

  if (filteredPrompts.length === 0) {
    return (
      <div className="prompt-grid-empty">
        <div className="empty-icon">📝</div>
        <h3>No prompts yet</h3>
        <p>Click the + button to add your first prompt</p>
      </div>
    );
  }

  return (
    <div className="prompt-grid">
      {filteredPrompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} onLongPressEdit={onLongPressEdit} />
      ))}
    </div>
  );
};

import { usePrompts } from '../../context/PromptContext';
import { PromptCard } from '../PromptCard/PromptCard';
import './PromptGrid.css';

export const PromptGrid = () => {
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
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
};

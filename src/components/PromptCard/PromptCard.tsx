import type { Prompt } from '../../models/Prompt';
import { usePrompts } from '../../context/PromptContext';
import { useToast } from '../../context/ToastContext';
import './PromptCard.css';

interface PromptCardProps {
  prompt: Prompt;
}

export const PromptCard = ({ prompt }: PromptCardProps) => {
  const { selectedPrompt, setSelectedPrompt } = usePrompts();
  const { showToast } = useToast();

  const isSelected = selectedPrompt?.id === prompt.id;

  const handleClick = async (e: React.MouseEvent) => {
    // If shift key is pressed, select for preview instead of copy
    if (e.shiftKey) {
      setSelectedPrompt(isSelected ? null : prompt);
      return;
    }

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(prompt.description);
      showToast('Copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = prompt.description;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showToast('Copied to clipboard!');
      } catch (copyErr) {
        showToast('Failed to copy');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div
      className={`prompt-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={{ '--card-color': prompt.color || '#6366f1' } as React.CSSProperties}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
      aria-label={`Prompt: ${prompt.title}. Click to copy, Shift+Click to preview.`}
    >
      <div className="prompt-card-header">
        <div className="prompt-card-color-bar"></div>
      </div>
      <div className="prompt-card-content">
        <h3 className="prompt-card-title">{prompt.title}</h3>
        <p className="prompt-card-description">
          {prompt.description.length > 80
            ? `${prompt.description.substring(0, 80)}...`
            : prompt.description}
        </p>
      </div>
    </div>
  );
};

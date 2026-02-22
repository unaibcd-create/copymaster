import { useEffect, useRef } from 'react';
import type { Prompt } from '../../models/Prompt';
import { usePrompts } from '../../context/PromptContext';
import { useToast } from '../../context/ToastContext';
import './PromptCard.css';

interface PromptCardProps {
  prompt: Prompt;
  onLongPressEdit: (prompt: Prompt) => void;
}

const LONG_PRESS_MS = 1000;

export const PromptCard = ({ prompt, onLongPressEdit }: PromptCardProps) => {
  const { selectedPrompt, setSelectedPrompt } = usePrompts();
  const { showToast } = useToast();
  const longPressTimeoutRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);

  const isSelected = selectedPrompt?.id === prompt.id;

  const handleClick = async (e: React.MouseEvent) => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }

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

  const clearLongPress = () => {
    if (longPressTimeoutRef.current !== null) {
      window.clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimeoutRef.current !== null) {
        window.clearTimeout(longPressTimeoutRef.current);
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) {
      return;
    }

    longPressTriggeredRef.current = false;
    clearLongPress();
    longPressTimeoutRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      setSelectedPrompt(prompt);
      onLongPressEdit(prompt);
    }, LONG_PRESS_MS);
  };

  return (
    <div
      className={`prompt-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={clearLongPress}
      onPointerLeave={clearLongPress}
      onPointerCancel={clearLongPress}
      style={{ '--card-color': prompt.color || '#6366f1' } as React.CSSProperties}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
      aria-label={`Prompt: ${prompt.title}. Click to copy, Shift+Click to preview, press and hold for one second to edit.`}
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

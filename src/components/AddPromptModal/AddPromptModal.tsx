import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePrompts } from '../../context/PromptContext';
import { PROMPT_COLORS, type PromptColor } from '../../models/Prompt';
import './AddPromptModal.css';

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPromptModal = ({ isOpen, onClose }: AddPromptModalProps) => {
  const { addPrompt } = usePrompts();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState<PromptColor>(PROMPT_COLORS[0]);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setSelectedColor(PROMPT_COLORS[0]);
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addPrompt(title.trim(), description.trim(), selectedColor);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay add-prompt-modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal-content add-prompt-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header add-prompt-modal-header">
          <h2>Add New Prompt</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form add-prompt-modal-form">
          <div className="form-group add-prompt-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter prompt title"
              className={errors.title ? 'error' : ''}
              autoFocus
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group add-prompt-group">
            <label htmlFor="description">Prompt</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your prompt text..."
              rows={6}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group add-prompt-group">
            <label>Color</label>
            <div className="color-picker add-prompt-color-picker" role="radiogroup" aria-label="Prompt color">
              {PROMPT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ background: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                  aria-pressed={selectedColor === color}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions add-prompt-modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

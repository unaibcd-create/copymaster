import { useState } from 'react';
import { usePrompts } from '../../context/PromptContext';
import { useToast } from '../../context/ToastContext';
import { Edit2, Trash2, Copy, X } from 'lucide-react';
import './PromptPreview.css';

interface PromptPreviewProps {
  onEdit: () => void;
}

export const PromptPreview = ({ onEdit }: PromptPreviewProps) => {
  const { selectedPrompt, setSelectedPrompt, deletePrompt } = usePrompts();
  const { showToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedPrompt) {
    return (
      <div className="prompt-preview prompt-preview-empty">
        <div className="preview-empty-content">
          <div className="preview-empty-icon">👆</div>
          <h3>Select a prompt</h3>
          <p>Shift+Click on a card to preview it here</p>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedPrompt.description);
      showToast('Copied to clipboard!');
    } catch (err) {
      showToast('Failed to copy');
    }
  };

  const handleDelete = () => {
    deletePrompt(selectedPrompt.id);
    setShowDeleteConfirm(false);
    showToast('Prompt deleted');
  };

  return (
    <div className="prompt-preview">
      <div className="preview-header">
        <div
          className="preview-color-bar"
          style={{ background: selectedPrompt.color || '#6366f1' }}
        ></div>
        <div className="preview-header-content">
          <h2 className="preview-title">{selectedPrompt.title}</h2>
          <button
            className="preview-close"
            onClick={() => setSelectedPrompt(null)}
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="preview-content">
        <div className="preview-description">
          <p>{selectedPrompt.description}</p>
        </div>

        <div className="preview-meta">
          <span className="preview-date">
            Created: {new Date(selectedPrompt.createdAt).toLocaleDateString()}
          </span>
          {selectedPrompt.updatedAt !== selectedPrompt.createdAt && (
            <span className="preview-date">
              Updated: {new Date(selectedPrompt.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="preview-actions">
        <button className="preview-action-btn copy" onClick={handleCopy}>
          <Copy size={18} />
          <span>Copy</span>
        </button>
        <button className="preview-action-btn edit" onClick={onEdit}>
          <Edit2 size={18} />
          <span>Edit</span>
        </button>
        <button
          className="preview-action-btn delete"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Delete Prompt?</h3>
            <p>This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button
                className="delete-confirm-btn cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="delete-confirm-btn confirm"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

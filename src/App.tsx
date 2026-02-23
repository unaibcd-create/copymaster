import { lazy, Suspense, useState } from 'react';
import type { Prompt } from './models/Prompt';
import { PromptProvider, usePrompts } from './context/PromptContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { storageService } from './services/storageService';
import { PromptGrid } from './components/PromptGrid/PromptGrid';
import { SearchBar } from './components/SearchBar/SearchBar';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { FloatingActionButton } from './components/FloatingActionButton/FloatingActionButton';
import { Toast } from './components/Toast/Toast';
import './App.css';

const PromptPreview = lazy(() =>
  import('./components/PromptPreview/PromptPreview').then((module) => ({
    default: module.PromptPreview,
  }))
);

const AddPromptModal = lazy(() =>
  import('./components/AddPromptModal/AddPromptModal').then((module) => ({
    default: module.AddPromptModal,
  }))
);

const EditPromptModal = lazy(() =>
  import('./components/EditPromptModal/EditPromptModal').then((module) => ({
    default: module.EditPromptModal,
  }))
);

const AppContent = () => {
  const { selectedPrompt, setSelectedPrompt, storageError } = usePrompts();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isUsingSupabase = storageService.isUsingSupabase;
  const isMisconfigured = storageService.isMisconfigured;

  const handleLongPressEdit = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsEditModalOpen(true);
  };

  const statusClassName = isUsingSupabase
    ? 'online'
    : isMisconfigured
      ? 'error'
      : 'offline';
  const statusLabel = isUsingSupabase
    ? 'Cloud Sync'
    : isMisconfigured
      ? 'Setup Required'
      : 'Local Only';
  const statusAriaLabel = isUsingSupabase
    ? 'Cloud sync enabled'
    : isMisconfigured
      ? 'Cloud sync setup required'
      : 'Local storage only';

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-title-group">
            <h1 className="header-title">Prompt Manager</h1>
            <span
              className={`sync-status ${statusClassName}`}
              aria-label={statusAriaLabel}
              title={statusAriaLabel}
            >
              {statusLabel}
            </span>
          </div>
          <div className="header-actions">
            <SearchBar />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {storageError && (
        <div className="storage-error-banner" role="alert">
          {storageError}
        </div>
      )}

      <main className="main-content">
        <div className="grid-column">
          <PromptGrid onLongPressEdit={handleLongPressEdit} />
        </div>
        <div className={`preview-column ${selectedPrompt ? 'visible' : ''}`}>
          {selectedPrompt ? (
            <Suspense fallback={<div className="prompt-preview prompt-preview-empty">Loading preview...</div>}>
              <PromptPreview onEdit={() => setIsEditModalOpen(true)} />
            </Suspense>
          ) : (
            <div className="prompt-preview prompt-preview-empty">
              <div className="preview-empty-content">
                <div className="preview-empty-icon">Select</div>
                <h3>Select a prompt</h3>
                <p>Shift+Click to preview, or press and hold a card for 1 second to edit</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

      {isAddModalOpen && (
        <Suspense fallback={null}>
          <AddPromptModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </Suspense>
      )}

      {isEditModalOpen && selectedPrompt && (
        <Suspense fallback={null}>
          <EditPromptModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            prompt={selectedPrompt}
          />
        </Suspense>
      )}

      <Toast />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <PromptProvider>
          <AppContent />
        </PromptProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

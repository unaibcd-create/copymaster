import { Plus } from 'lucide-react';
import './FloatingActionButton.css';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <button
      className="fab"
      onClick={onClick}
      aria-label="Add new prompt"
    >
      <Plus size={24} />
    </button>
  );
};

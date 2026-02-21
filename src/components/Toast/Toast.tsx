import { useToast } from '../../context/ToastContext';
import './Toast.css';

export const Toast = () => {
  const { message, isVisible } = useToast();

  if (!isVisible) return null;

  return (
    <div className="toast" role="alert" aria-live="polite">
      <span className="toast-icon">✓</span>
      <span className="toast-message">{message}</span>
    </div>
  );
};

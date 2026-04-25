import { useToast } from '../hooks';
import './Toast.css';

export const Toast = ({ id, message, type }) => {
  return (
    <div className={`toast toast-${type}`}>
      {type === 'error' && '✕ '}
      {type === 'success' && '✓ '}
      {type === 'info' && 'ℹ '}
      {message}
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts } = useToast();
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

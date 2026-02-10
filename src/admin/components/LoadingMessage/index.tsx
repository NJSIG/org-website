import { LoaderCircleIcon } from 'lucide-react';
import './index.scss';

type LoadingMessageProps = {
  message?: string;
};

export const LoadingMessage: React.FC<LoadingMessageProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="loading">
      <LoaderCircleIcon className="loading__spinner" size={32} />
      <span className="loading__text">{message}</span>
    </div>
  );
};

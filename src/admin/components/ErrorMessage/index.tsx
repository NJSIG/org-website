import { TriangleAlertIcon } from 'lucide-react';
import './index.scss';

type ErrorMessageProps = {
  message?: string;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'An unknown error occurred.',
}) => {
  return (
    <div className="error-message">
      <div className="card error-message__container">
        <h3 className="card__title error-message__title">
          <TriangleAlertIcon size={24} />
          <span>Error</span>
        </h3>
        <div className="error-message__text">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

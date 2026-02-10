import { InfoIcon } from 'lucide-react';
import './index.scss';

type Props = {
  tips: string[];
};

export const TipComponent: React.FC<Props> = ({ tips }) => {
  return (
    <div className="ui-field-tip">
      <span className="icon">
        <InfoIcon size={16} />
      </span>
      <div>
        {tips.map((tip, index) => (
          <p key={index} style={{ margin: 0, paddingBottom: index < tips.length - 1 ? '8px' : 0 }}>
            {tip}
          </p>
        ))}
      </div>
    </div>
  );
};

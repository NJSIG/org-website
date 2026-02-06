import { formatChange } from '@/lib/plausible';

interface CardProps {
  title: string;
  value: string | number;
  change?: number | null;
  formatter?: (value: unknown) => string;
  isPositiveGood?: boolean;
}

export const Card = (props: CardProps) => {
  const { title, value, change, formatter, isPositiveGood } = props;
  const formattedValue = formatter ? formatter(value) : value;
  const changeData = formatChange(change || null);
  const isPositive = isPositiveGood ? changeData.isPositive : !changeData.isPositive;

  return (
    <li>
      <div className="card" style={{ flexDirection: 'column' }}>
        <h3 className="card__title">{title}</h3>
        <div style={{ fontSize: '2rem' }}>{formattedValue}</div>
        {change !== undefined && (
          <div style={{ color: isPositive ? 'green' : 'red' }}>
            {changeData.text} from previous period
          </div>
        )}
      </div>
    </li>
  );
};

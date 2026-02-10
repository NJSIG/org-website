import { formatChange } from '@/lib/plausible';
import { cn } from '@/utilities/cn';
import { ArrowDownRightIcon, ArrowUpRightIcon } from 'lucide-react';
import './index.scss';

interface CardProps {
  title: string;
  value: string | number;
  change?: number | null;
  formatter?: (value: unknown) => string;
  isPositiveGood?: boolean;
}

export const KPICard = (props: CardProps) => {
  const { title, value, change, formatter, isPositiveGood } = props;
  const formattedValue = formatter ? formatter(value) : value;
  const changeData = formatChange(change || null);
  const isPositive = isPositiveGood ? changeData.isPositive : !changeData.isPositive;
  const hasDelta = changeData.text !== '0' && changeData.text !== '0%';

  return (
    <li>
      <div className="card" style={{ flexDirection: 'column' }}>
        <h3 className="card__title">{title}</h3>
        <div
          className={cn('card__kpi', {
            'card__kpi--positive': hasDelta && isPositive,
            'card__kpi--negative': hasDelta && !isPositive,
          })}
        >
          <div className="kpi__value">
            <span>{formattedValue}</span>
            {change !== undefined && hasDelta && (
              <>{isPositive ? <ArrowUpRightIcon size={36} /> : <ArrowDownRightIcon size={36} />}</>
            )}
          </div>
          {change !== undefined && (
            <div className="kpi__change">
              <span>{changeData.text} change from last period</span>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

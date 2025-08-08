import { IconNames } from '@/fields/lucideIconPicker/types';
import { cn } from '@/utilities/cn';
import DynamicIcon from '../DynamicIcon';

export type BentoProps = {
  className?: string;
  children: React.ReactNode;
};

export type BentoItemProps = {
  icon: IconNames;
  label: string;
  className?: string;
  children: React.ReactNode;
};

const Bento: React.FC<BentoProps> & { Item: React.FC<BentoItemProps> } = ({
  className,
  children,
}) => {
  return <div className={cn('grid grid-cols-1 gap-4 lg:grid-cols-2', className)}>{children}</div>;
};

Bento.Item = function Item({ icon, label, className, children }: BentoItemProps) {
  return (
    <div className={cn('rounded-3xl bg-njsig-neutral-tint p-4', className)}>
      <div className="flex items-center gap-2 mb-1">
        <DynamicIcon name={icon} size={24} className="stroke-[var(--bento-icon-stroke)]" />
        <span className="text-base font-bold">{label}</span>
      </div>
      {children}
    </div>
  );
};

export default Bento;

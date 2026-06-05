import { IconNames } from '@/fields/LucideIconPicker/types';
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

export type BentoGenericProps = {
  className?: string;
  children: React.ReactNode;
};

export type BentoPlaceholderProps = {
  className?: string;
  withPattern?: boolean;
  children?: React.ReactNode;
};

const Bento: React.FC<BentoProps> & { Item: React.FC<BentoItemProps> } & {
  Placeholder: React.FC<BentoPlaceholderProps>;
} & { Generic: React.FC<BentoGenericProps> } = ({ className, children }) => {
  return (
    <div className={cn('grid auto-cols-fr auto-rows-fr gap-x-6 gap-y-4', className)}>
      {children}
    </div>
  );
};

Bento.Generic = function Generic({ className, children }: BentoGenericProps) {
  return <div className={cn('rounded-3xl bg-njsig-neutral-tint p-4', className)}>{children}</div>;
};

Bento.Item = function Item({ icon, label, className, children }: BentoItemProps) {
  return (
    <Bento.Generic className={className}>
      <div className="flex items-center gap-2 mb-1">
        <DynamicIcon name={icon} size={24} className="stroke-(--bento-icon-stroke)" />
        <h4 className="text-base font-bold">{label}</h4>
      </div>
      {children}
    </Bento.Generic>
  );
};

Bento.Placeholder = function Placeholder({
  className,
  withPattern = true,
  children,
}: BentoPlaceholderProps) {
  return (
    <Bento.Generic className={cn('bg-transparent p-0', className)}>
      {withPattern ? (
        <div className="rounded-3xl fibers fiber-strength-10 h-full w-full">{children}</div>
      ) : (
        <>{children}</>
      )}
    </Bento.Generic>
  );
};

export default Bento;

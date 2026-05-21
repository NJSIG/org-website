import { IconNames } from '@/fields/LucideIconPicker/types';
import { Event } from '@/payload-types';
import { cn } from '@/utilities/cn';
import DynamicIcon from '../DynamicIcon';
import ResourceItem from '../ResourceItem';

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

export type BentoResourceProps = {
  resource: NonNullable<Event['resources']>[number];
  className?: string;
};

export type BentoPlaceholderProps = {
  className?: string;
  withPattern?: boolean;
  children?: React.ReactNode;
};

const Bento: React.FC<BentoProps> & { Item: React.FC<BentoItemProps> } & {
  Placeholder: React.FC<BentoPlaceholderProps>;
} & { Resource: React.FC<BentoResourceProps> } = ({ className, children }) => {
  return (
    <div className={cn('grid auto-cols-fr auto-rows-fr gap-x-6 gap-y-4', className)}>
      {children}
    </div>
  );
};

Bento.Item = function Item({ icon, label, className, children }: BentoItemProps) {
  return (
    <div className={cn('rounded-3xl bg-njsig-neutral-tint p-4', className)}>
      <div className="flex items-center gap-2 mb-1">
        <DynamicIcon name={icon} size={24} className="stroke-(--bento-icon-stroke)" />
        <h4 className="text-base font-bold">{label}</h4>
      </div>
      {children}
    </div>
  );
};

Bento.Resource = function Resource({ resource, className }: BentoResourceProps) {
  return <ResourceItem item={resource} className={className} />;
};

Bento.Placeholder = function Placeholder({
  className,
  withPattern = false,
  children,
}: BentoPlaceholderProps) {
  return (
    <div className={cn('rounded-3xl bg-(--bento-placeholder)/30', className)}>
      {withPattern ? (
        <div className="rounded-3xl fibers fiber-strength-4 h-full w-full">{children}</div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default Bento;

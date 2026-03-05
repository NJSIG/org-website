import DynamicIcon from '@/components/DynamicIcon';
import { MetricsBlock as MetricsBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';

export const MetricsBlock: React.FC<MetricsBlockProps> = ({ columns, items }) => {
  return (
    <div
      className={cn('grid grid-cols-2 gap-8 py-4', {
        'grid-cols-1': columns === 'one',
        'md:grid-cols-3': columns === 'three',
        'md:grid-cols-4': columns === 'four',
      })}
    >
      {items?.map(({ id, icon, iconBackgroundColor, value, label }) => (
        <div key={id} className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'flex items-center justify-center size-20 rounded-full text-foreground-inverted',
              {
                'bg-njsig-midtone': iconBackgroundColor === 'azureMidtone',
                'bg-ericnorth-midtone': iconBackgroundColor === 'ceruleanMidtone',
                'bg-bacceic-midtone': iconBackgroundColor === 'glacialMidtone',
                'bg-njeif-midtone': iconBackgroundColor === 'raspberryMidtone',
                'bg-caip-midtone': iconBackgroundColor === 'seaGreenMidtone',
                'bg-ericsouth-midtone': iconBackgroundColor === 'sushiMidtone',
                'bg-mocssif-midtone': iconBackgroundColor === 'tahitiGoldMidtone',
                'bg-ericwest-midtone': iconBackgroundColor === 'trendyPinkMidtone',
              },
            )}
          >
            <DynamicIcon name={icon} size={40} />
          </div>
          <dl className="flex flex-col-reverse items-center">
            <dt className="text-lg text-center">{label}</dt>
            <dd className="text-3xl font-extrabold">{value}</dd>
          </dl>
        </div>
      ))}
    </div>
  );
};

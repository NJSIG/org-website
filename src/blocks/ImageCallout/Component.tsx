import { CalloutCard } from '@/components/CalloutCard';
import { Media } from '@/components/Media';
import TitleTheme from '@/components/TitleTheme';
import { ImageCalloutBlock as ImageCalloutBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';

export const ImageCalloutBlock: React.FC<ImageCalloutBlockProps> = ({
  calloutContent,
  calloutImage,
}) => {
  return (
    <div
      className={cn('relative pb-12', {
        'xl:pl-12': calloutContent.position === 'left',
        'xl:pr-12': calloutContent.position === 'right',
      })}
    >
      <div
        className={cn({
          'p-2 rounded-2xl': calloutImage.border !== 'none',
          'bg-njsig-midtone': calloutImage.border === 'primaryMidtone',
        })}
      >
        <Media
          resource={calloutImage.image}
          height={calloutImage.height}
          width={calloutImage.width}
          priority={calloutImage.priority}
          placeholder={calloutImage.placeholder ? 'blur' : 'empty'}
          className={cn('overflow-hidden', {
            'rounded-lg': calloutImage.border !== 'none',
            'rounded-2xl': calloutImage.border === 'none',
          })}
        />
      </div>
      <div
        className={cn('absolute bottom-0 left-1/2 -translate-x-1/2 xl:translate-0', {
          'xl:left-0': calloutContent.position === 'left',
          'xl:left-auto xl:right-0': calloutContent.position === 'right',
        })}
      >
        <CalloutCard shadow={calloutContent.position} className="w-80 h-52 gap-4">
          {calloutContent.theme && (
            <TitleTheme size="responsive" animated={false} className="mr-auto">
              {calloutContent.theme}
            </TitleTheme>
          )}
          <p className="text-lg xl:text-xl font-extrabold">{calloutContent.content}</p>
        </CalloutCard>
      </div>
    </div>
  );
};

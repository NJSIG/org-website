import { ButtonLink } from '@/components/ButtonLink';
import { LinkAppearanceHelper } from '@/fields/link/types';
import { CMSButtonBlock as CMSButtonBlockProps } from '@/payload-types';

// We limit the options the user can set for the button in the CMS
// so we're setting the missing options here
const cmsButtonAppearance: LinkAppearanceHelper<'button'> = {
  sizeVariant: 'medium',
  iconPosition: 'after',
  icon: 'arrow-up-right',
  microInteraction: 'upRight',
};

export const CMSButtonBlock: React.FC<CMSButtonBlockProps> = ({ cmsButtonLink, analytics }) => {
  const classNames = [];

  if (analytics?.hasAnalyticsEvent) {
    if (analytics.eventName) {
      classNames.push(`plausible-event-name=${analytics.eventName}`);
    }

    if (analytics.properties && analytics.properties.length > 0) {
      analytics.properties.map(({ propertyName, propertyValue }) => {
        classNames.push(`plausible-event-${propertyName}=${propertyValue}`);
      });
    }
  }

  return (
    <ButtonLink
      link={{
        ...cmsButtonLink,
        ...cmsButtonAppearance,
      }}
      className={classNames.length > 0 ? classNames.join(' ') : ''}
    />
  );
};

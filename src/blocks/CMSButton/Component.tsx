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

export const CMSButtonBlock: React.FC<CMSButtonBlockProps> = ({ cmsButtonLink }) => {
  return (
    <ButtonLink
      link={{
        ...cmsButtonLink,
        ...cmsButtonAppearance,
      }}
    />
  );
};

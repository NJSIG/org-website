import { LinkAppearanceHelper } from '@/fields/link/types';
import { CMSButtonBlock as CMSButtonBlockProps } from '@/payload-types';

// We limit the options the user can set for the button in the CMS
// so we're setting the missing options here
const cmsButtonAppearance: LinkAppearanceHelper<'button'> = {
  sizeVariant: 'medium',
  iconPosition: 'after',
  icon: 'arrow-up-right',
};

export const CMSButtonBlock: React.FC<CMSButtonBlockProps> = ({ link }) => {
  return <p>CMS Button Block Works!</p>;
};

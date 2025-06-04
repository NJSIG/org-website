import { blurHashToDataURL } from '@/utilities/blurhashToDataUrl';
import Image from 'next/image';
import { useMemo } from 'react';

type Props = {
  blurhash?: string | null;
};

export const ImageHash = ({ blurhash, ...props }: React.ComponentProps<typeof Image> & Props) => {
  const blurDataUrl = useMemo(() => {
    if (blurhash) {
      const dataurl = blurHashToDataURL(blurhash);
      console.log('Generated blurDataUrl:', dataurl);
      return dataurl;
    }

    return null;
  }, [blurhash]);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image {...props} placeholder="blur" blurDataURL={blurDataUrl || undefined} />
  );
};

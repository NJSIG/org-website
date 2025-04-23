import { HeaderClient } from './Component.client';

import type { Header } from '@/payload-types';
import { getCachedGlobal } from '@/utilities/getCachedGlobal';

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)();

  return <HeaderClient data={headerData} />;
}

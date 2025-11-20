import type { Footer } from '@/payload-types';
import { getCachedGlobal } from '@/utilities/getCachedGlobal';
import { FooterClient } from './Component.client';

export async function Footer() {
  const footerData: Footer = (await getCachedGlobal('footer', 1)()) as Footer;

  return <FooterClient data={footerData} />;
}

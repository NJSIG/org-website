import { Logo } from '@/components/Logo/Logo';
import type { Footer } from '@/payload-types';
import { getCachedGlobal } from '@/utilities/getCachedGlobal';
import { Phone, Printer } from 'lucide-react';

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)();
  const navGroups = footerData?.navGroups || [];

  return (
    <footer className="mt-auto bg-muted text-muted-foreground flex flex-col items-center">
      <div className="flex flex-col mx-4 my-6 gap-8">
        <div className="flex flex-col gap-8">
          <Logo style="full" height={100} width={254} className="self-center" />
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold">New Jersey Schools Insurance Group</p>
            <div aria-description="Mailing Address">
              <p>6000 Midlantic Drive</p>
              <p>Suite 300 North</p>
              <p>Mount Laurel, NJ 08054</p>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2" aria-description="Phone Number">
                <Phone size={16} />
                <a href="tel:+16093866060" className="text-foreground-link">
                  609-386-6060
                </a>
              </div>
              <div className="flex items-center gap-2" aria-description="Fax Number">
                <Printer size={16} />
                <a href="tel:+6093868877" className="text-foreground-link">
                  609-386-8877
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2" aria-description="Phone Number">
              <p className="font-bold grow">Off Hours Emergency Claims:</p>
              <Phone size={16} />
              <a href="tel:+16093866060" className="text-foreground-link">
                609-386-6060
              </a>
            </div>
            <div className="flex items-center gap-2" aria-description="Phone Number">
              <p className="font-bold grow">Workers&apos; Compensation Intake:</p>
              <Phone size={16} />
              <a href="tel:+16095433377" className="text-foreground-link">
                609-543-3377
              </a>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-border"></div>
      </div>
    </footer>
  );
}

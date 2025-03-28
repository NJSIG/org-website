import { Hyperlink } from '@/components/Hyperlink';
import { Logo } from '@/components/Logo';
import type { Footer } from '@/payload-types';
import { getCachedGlobal } from '@/utilities/getCachedGlobal';
import { Phone, Printer } from 'lucide-react';

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)();
  const navGroups = footerData?.navGroups || [];

  // Divide the navGroups into two columns
  const midIndex = Math.ceil(navGroups.length / 2);

  // Left Column will be the top section on small screens
  const leftColumn = navGroups.slice(0, midIndex);

  // Right Column will be the bottom section on small screens
  const rightColumn = navGroups.slice(midIndex);

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
        {navGroups.length > 0 && (
          <>
            <div className="h-[1px] w-full bg-border"></div>
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              <div className="flex flex-col gap-8">
                {leftColumn.map((group) => (
                  <div key={group.id} className="flex flex-col gap-4">
                    <p className="text-xl">{group.label}</p>
                    <ul className="flex flex-col gap-2">
                      {group.links?.map((item) => (
                        <li key={item.id}>
                          <Hyperlink link={item.link} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-8">
                {rightColumn.map((group) => (
                  <div key={group.id} className="flex flex-col gap-4">
                    <p className="text-xl">{group.label}</p>
                    <ul className="flex flex-col gap-2">
                      {group.links?.map((item) => (
                        <li key={item.id}>
                          <Hyperlink link={item.link} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}

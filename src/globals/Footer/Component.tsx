import { Hyperlink } from '@/components/Hyperlink';
import { Logo } from '@/components/Logo';
import type { Footer } from '@/payload-types';
import { getCachedGlobal } from '@/utilities/getCachedGlobal';
import { Phone, Printer } from 'lucide-react';
import Link from 'next/link';

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)();
  const navGroups = footerData?.navGroups || [];
  const policyLinks = footerData?.policyLinks || [];

  // Divide the navGroups into two columns
  const midIndex = Math.ceil(navGroups.length / 2);

  // Left Column will be the top section on small screens
  const leftColumn = navGroups.slice(0, midIndex);

  // Right Column will be the bottom section on small screens
  const rightColumn = navGroups.slice(midIndex);

  return (
    <footer className="mt-auto bg-muted text-muted-foreground flex flex-col items-center">
      <div className="flex flex-col px-4 py-6 gap-8 lg:flex-row lg:max-w-7xl lg:px-6 lg:py-16 lg:w-full">
        <div className="flex flex-col gap-8">
          <Link href="/" className="self-center lg:self-start">
            <Logo style="full" height={100} width={254} />
          </Link>
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
                <Hyperlink link={{ url: 'tel:+16093866060' }}>609-386-6060</Hyperlink>
              </div>
              <div className="flex items-center gap-2" aria-description="Fax Number">
                <Printer size={16} />
                <Hyperlink link={{ url: 'tel:+6093868877' }}>609-386-8877</Hyperlink>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2" aria-description="Phone Number">
              <p className="font-bold grow">Off Hours Emergency Claims:</p>
              <Phone size={16} />
              <Hyperlink link={{ url: 'tel:+16093866060' }}>609-386-6060</Hyperlink>
            </div>
            <div className="flex items-center gap-2" aria-description="Phone Number">
              <p className="font-bold grow">Workers&apos; Compensation Intake:</p>
              <Phone size={16} />
              <Hyperlink link={{ url: 'tel:+16095433377' }}>609-543-3377</Hyperlink>
            </div>
          </div>
        </div>
        {navGroups.length > 0 && (
          <>
            <div className="h-px w-full bg-border lg:w-px lg:h-auto"></div>
            <div className="flex flex-wrap gap-x-12 gap-y-6 lg:grow lg:justify-center">
              <div className="flex flex-col gap-8">
                {leftColumn.map((group) => (
                  <div key={group.id} className="flex flex-col gap-4">
                    <p className="text-xl">{group.label}</p>
                    <ul className="flex flex-col gap-2">
                      {group.links?.map((item) => (
                        <li key={item.id}>
                          <Hyperlink link={item.link}>{item.link.label}</Hyperlink>
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
                          <Hyperlink link={item.link}>{item.link.label}</Hyperlink>
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
      <div className="bg-azure-to-r text-foreground-inverted text-center w-full">
        <div className="flex flex-col gap-4 p-4 items-center lg:flex-row lg:justify-between lg:max-w-7xl mx-auto">
          <p>
            Copyright &copy; New Jersey Schools Insurance Group.
            <br className="md:hidden" /> All rights reserved.
          </p>
          {policyLinks.length > 0 && (
            <ul className="flex gap-3">
              {policyLinks.map((item) => (
                <li key={item.id}>
                  <Hyperlink link={item.link} className="text-foreground-inverted underline">
                    {item.link.label}
                  </Hyperlink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}

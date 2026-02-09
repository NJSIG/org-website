'use client';

import { Link, NavGroup } from '@payloadcms/ui';
import { usePathname } from 'next/navigation';

export const AfterNavLinks: React.FC = () => {
  const pathname = usePathname();
  const href = '/admin/analytics';
  const active = pathname === href || pathname.startsWith(href + '/');

  return (
    <NavGroup label="Views">
      <Link
        href={href}
        className="nav__link"
        id="nav-analytics"
        style={{ cursor: active ? 'default' : 'pointer', pointerEvents: active ? 'none' : 'auto' }}
      >
        {active && <div className="nav__link-indicator"></div>}
        <span className="nav__link-label">Analytics</span>
      </Link>
    </NavGroup>
  );
};

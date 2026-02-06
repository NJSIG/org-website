'use client';

import { Link, NavGroup } from '@payloadcms/ui';
import { usePathname } from 'next/navigation';

export const AfterNavLinks: React.FC = () => {
  const pathname = usePathname();
  const href = '/admin/analytics';
  const active = pathname.includes(href);

  return (
    <NavGroup label="Views">
      <Link
        href={href}
        className="nav__link"
        id="nav-analytics"
        style={{ cursor: active ? 'pointer' : 'default', pointerEvents: active ? 'none' : 'auto' }}
      >
        {active && (
          <div className="nav__link-indicator">
            <span className="nav__link-label">Analytics</span>
          </div>
        )}
      </Link>
    </NavGroup>
  );
};

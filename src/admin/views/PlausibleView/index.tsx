import { DefaultTemplate, MinimalTemplate } from '@payloadcms/next/templates';
import { Button, Gutter, SetStepNav, type StepNavItem } from '@payloadcms/ui';
import { ShieldAlertIcon } from 'lucide-react';
import type { AdminViewServerProps } from 'payload';
import React from 'react';
import { AnalyticsClient } from './index.client';

export const AnalyticsView: React.FC<AdminViewServerProps> = ({
  initPageResult,
  params,
  searchParams,
}) => {
  if (!initPageResult.req.user) {
    return (
      <MinimalTemplate className="njsig-minimal">
        <div className="error">
          <div className="error__title">
            <ShieldAlertIcon size={36} />
            <h2>Unauthorized</h2>
          </div>
          <div className="error__description">
            <p>You must be logged in to see this page.</p>
          </div>
          <div className="error__actions">
            <Button
              el="link"
              to="/"
              size="large"
              buttonStyle="secondary"
              className="error__button error__button--wide"
            >
              Go Back Home
            </Button>
            <Button
              el="link"
              to="/admin/login"
              size="large"
              buttonStyle="primary"
              className="error__button"
            >
              Login
            </Button>
          </div>
        </div>
      </MinimalTemplate>
    );
  }

  const steps: StepNavItem[] = [
    {
      url: '/analytics',
      label: 'Analytics',
    },
  ];

  return (
    <DefaultTemplate
      visibleEntities={initPageResult.visibleEntities}
      i18n={initPageResult.req.i18n}
      payload={initPageResult.req.payload}
      locale={initPageResult.locale}
      params={params}
      permissions={initPageResult.permissions}
      user={initPageResult.req.user || undefined}
      searchParams={searchParams}
      className="njsig analytics"
    >
      <SetStepNav nav={steps} />
      <Gutter>
        <AnalyticsClient />
      </Gutter>
    </DefaultTemplate>
  );
};

export default AnalyticsView;

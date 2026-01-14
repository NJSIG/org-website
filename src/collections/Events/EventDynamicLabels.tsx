'use client';

import { Event } from '@/payload-types';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';
import React from 'react';

type PresenterLabel = NonNullable<Event['presenters']>[number];
type CreditLabel = NonNullable<Event['credits']>[number];

const EventDynamicLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<PresenterLabel | CreditLabel>();

  if (isPresenter(data)) {
    return <div>{data.name}</div>;
  }

  if (isCredit(data)) {
    return <div>{data.credit}</div>;
  }

  return <div>{`Item ${rowNumber}`}</div>;
};

function isPresenter(data: PresenterLabel | CreditLabel): data is PresenterLabel {
  if ('name' in data) {
    return true;
  }

  return false;
}

function isCredit(data: PresenterLabel | CreditLabel): data is CreditLabel {
  if ('credit' in data) {
    return true;
  }

  return false;
}

export default EventDynamicLabel;

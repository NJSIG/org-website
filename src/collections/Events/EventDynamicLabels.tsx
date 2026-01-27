'use client';

import { Event } from '@/payload-types';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';
import React from 'react';

type PresenterLabel = NonNullable<Event['presenters']>[number];
type CreditLabel = NonNullable<Event['credits']>[number];

const EventDynamicLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<PresenterLabel | CreditLabel>();
  let label = 'Item';

  if (data && isPresenter(data)) {
    label = 'Presenter';

    if (data.name?.length > 0) {
      return <div>{data.name}</div>;
    }
  }

  if (data && isCredit(data)) {
    label = 'Credit';

    if (data.credit?.length > 0) {
      return <div>{data.credit}</div>;
    }
  }

  return <div>{`${label} ${(rowNumber || 0) + 1}`}</div>;
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

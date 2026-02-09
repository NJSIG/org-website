import React from 'react';

import './index.scss';

export const viewHeaderClass = 'view-header';

type ViewHeaderProps = {
  readonly Actions?: React.ReactNode[];
  readonly AfterViewHeaderContent?: React.ReactNode;
  readonly className?: string;
  readonly title: string;
  readonly TitleActions?: React.ReactNode[];
};
export const ViewHeader: React.FC<ViewHeaderProps> = (props) => {
  return (
    <header className={[viewHeaderClass, props.className].filter(Boolean).join(' ')}>
      <div className={`${viewHeaderClass}__content`}>
        <div className={`${viewHeaderClass}__title-and-actions`}>
          <h1 className={`${viewHeaderClass}__title`}>{props.title}</h1>
          {props.TitleActions?.length ? (
            <div className={`${viewHeaderClass}__title-actions`}>{props.TitleActions}</div>
          ) : null}
        </div>
        {props.Actions?.length ? (
          <div className={`${viewHeaderClass}__actions`}>{props.Actions}</div>
        ) : null}
      </div>
      {props.AfterViewHeaderContent ? (
        <div className={`${viewHeaderClass}__after-header-content`}>
          {props.AfterViewHeaderContent}
        </div>
      ) : null}
    </header>
  );
};

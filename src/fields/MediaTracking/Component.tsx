import { JSONFieldServerComponent } from 'payload';
import { MediaTrackingFieldClientComponent } from './Component.client';

export const MediaTrackingFieldComponent: JSONFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <MediaTrackingFieldClientComponent
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  );
};

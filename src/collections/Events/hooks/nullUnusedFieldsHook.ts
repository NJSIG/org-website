import { FieldHook } from 'payload';
import { AttendanceOptionValues, EventTypeValues } from '..';

export const nullUnusedFieldsHook: FieldHook = ({ siblingData, field, value }) => {
  if (field.name !== undefined) {
    // Clear fields based on event type
    switch (siblingData.eventType) {
      case EventTypeValues.ImportantDate:
        if (
          [
            'presenter',
            'credits',
            'endDate',
            'registrationTime',
            'endTime',
            'contact',
            'attendanceOptions',
            'virtualProvider',
            'virtualLink',
            'virtualPasscode',
          ].includes(field.name)
        ) {
          return null;
        }

        if (field.name === 'important') {
          return false;
        }
        break;
      case EventTypeValues.TrusteeMeeting:
        if (['presenter', 'credits'].includes(field.name)) {
          return null;
        }
        break;
    }

    // Clear fields based on attendance type
    if (siblingData.eventType !== EventTypeValues.ImportantDate) {
      switch (siblingData.attendanceOptions) {
        case AttendanceOptionValues.InPerson:
          if (['virtualProvider', 'virtualLink', 'virtualPasscode'].includes(field.name)) {
            return null;
          }
          break;
        case AttendanceOptionValues.Virtual:
          if (['location'].includes(field.name)) {
            return null;
          }
          break;
      }
    }
  }

  return value;
};

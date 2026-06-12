import { FieldHook } from 'payload';
import { AttendanceOptions, EventTypes } from '../types';

export const nullUnusedFieldsHook: FieldHook = ({ siblingData, field, value }) => {
  if (field.name !== undefined) {
    // Clear fields based on event type
    switch (siblingData.eventType) {
      case EventTypes.ImportantDate.value:
        if (
          [
            'presenters',
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
      case EventTypes.TrusteeMeeting.value:
        if (['presenters', 'credits'].includes(field.name)) {
          return null;
        }
        break;
    }

    // Clear fields based on attendance type
    if (siblingData.eventType !== EventTypes.ImportantDate.value) {
      switch (siblingData.attendanceOptions) {
        case AttendanceOptions.InPerson.value:
          if (['virtualProvider', 'virtualLink', 'virtualPasscode'].includes(field.name)) {
            return null;
          }
          break;
        case AttendanceOptions.Virtual.value:
          if (['location'].includes(field.name)) {
            return null;
          }
          break;
      }
    }
  }

  return value;
};

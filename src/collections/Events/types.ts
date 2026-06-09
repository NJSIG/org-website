// We're defining this object as a constant and using enum style casing because we are treating it
// as a set of fixed values, but Typescript does not support object enums.
export const EventTypes = {
  TrusteeMeeting: { label: 'Trustee Meeting', value: 'trusteeMeeting' },
  SubfundMeeting: { label: 'Sub-fund Meeting', value: 'subfundMeeting' },
  ImportantDate: { label: 'Important Date', value: 'importantDate' },
  NjsigEvent: { label: 'NJSIG Event', value: 'njsigEvent' },
  OtherEvent: { label: 'Other Event', value: 'otherEvent' },
} as const;

export type EventTypes = keyof typeof EventTypes;

// We're defining this object as a constant and using enum style casing because we are treating it
// as a set of fixed values, but Typescript does not support object enums.
export const AttendanceOptions = {
  InPerson: { label: 'In-Person', value: 'inPerson' },
  Virtual: { label: 'Virtual', value: 'virtual' },
  Hybrid: { label: 'Hybrid', value: 'hybrid' },
} as const;

export type AttendanceOptions = keyof typeof AttendanceOptions;

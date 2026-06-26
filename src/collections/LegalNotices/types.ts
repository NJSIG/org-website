// We're defining this object as a constant and using enum style casing because we are treating it
// as a set of fixed values, but Typescript does not support object enums.
export const LegalNoticeTypes = {
  LegalNotice: { label: 'Legal Notice', value: 'legalNotice' },
  RFP: { label: 'RFP', value: 'rfp' },
  RFPAward: { label: 'RFP Award', value: 'rfpAward' },
} as const;

export type LegalNoticeTypes = keyof typeof LegalNoticeTypes;

export type LegalNoticeTypeValue =
  (typeof LegalNoticeTypes)[keyof typeof LegalNoticeTypes]['value'];

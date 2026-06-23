const suffixes: Map<string, string> = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
]);

const formatter = new Intl.PluralRules('en-US', { type: 'ordinal' });

export const appendOrdinalSuffix = (num: number): string => {
  const rule = formatter.select(num);
  const suffix = suffixes.get(rule) ?? '';

  return `${num}${suffix}`;
};

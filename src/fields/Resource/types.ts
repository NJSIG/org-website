import { Field, GroupField } from 'payload';
import { LinkDestinations } from '../Link/types';
import { IconNames } from '../LucideIconPicker/types';

// Helper type for options
type Options = { label: string; value: string };

export type ResourceTypes = 'document' | 'audioVideo' | 'link';
export type ResourceTypeOptions = Record<ResourceTypes, Options>;

export type ResourceField = (options?: {
  resourceTypes?: ResourceTypes[];
  linkDestinations?: LinkDestinations[];
  forceIcon?: IconNames;
  overrides?: Partial<GroupField>;
}) => Field;

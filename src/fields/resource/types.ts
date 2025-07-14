import { Field, GroupField } from 'payload';
import { LinkDestinations } from '../link/types';

// Helper type for options
type Options = { label: string; value: string };

export type ResourceTypes = 'document' | 'audioVideo' | 'link';
export type ResourceTypeOptions = Record<ResourceTypes, Options>;

export type ResourceField = (options?: {
  resourceTypes?: ResourceTypes[];
  linkDestinations?: LinkDestinations[];
  overrides?: Partial<GroupField>;
}) => Field;

import { GoogleMapClient, type MapClientProps } from './client';

export type MapProps = Omit<MapClientProps, 'apiKey'> & { apiKey?: string };

/**
 * GoogleMap Component
 * 
 * Uses the Maps API key from MapApiKeyProvider context (set in root layout).
 * Can be used anywhere in the app (client or server components, admin panel, etc.)
 * without needing to pass the API key as a prop.
 * 
 * The API key can optionally be overridden by passing it as a prop.
 */
export const GoogleMap = GoogleMapClient;

// Re-export for convenience
export { GoogleMapClient };

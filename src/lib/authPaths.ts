/**
 * Every URL that has to line up across Payload, Better Auth, scripts, and emails
 * triggered by Better Auth are defined here so they can't drift.
 *
 * Payload view paths are RELATIVE to `routes.admin`. Better Auth's redirects
 * (`redirectTo` / `callbackURL`) are plain app URLs that the browser is sent to
 * as-is, so they need the admin prefix. Both forms are derived from one source path.
 */

// Payload's default is "/admin", we are using that here
export const ADMIN_ROUTE = '/admin';

// Relative to the admin route: use in `payload.config.ts` (`routes` and `views[].path`)
export const SIGN_IN_PATH = '/auth/sign-in';
export const RESET_PASSWORD_PATH = '/auth/reset-password';

// Full app URLs: use anywhere Better Auth or a browser needs a real destination.
export const SIGN_IN_URL = `${ADMIN_ROUTE}${SIGN_IN_PATH}`;
export const RESET_PASSWORD_URL = `${ADMIN_ROUTE}${RESET_PASSWORD_PATH}`;

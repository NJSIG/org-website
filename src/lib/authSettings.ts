/**
 * Some auth related settings need to stay in sync between Payload and Better Auth.
 * Those settings are defined here for easy reference.
 */

// Session expiration in seconds used by Better Auth and Payload, should remain in sync
export const SESSION_EXPIRATION = 60 * 60 * 4; // 4 hours

// Trust device duration in seconds, only used by Better Auth currently
export const TRUST_DEVICE_DURATION = 60 * 60 * 24 * 7; // 7 days

// Password reset token expiration in seconds, only used by Better Auth currently
export const RESET_TOKEN_EXPIRATION = 60 * 60; // 1 hour

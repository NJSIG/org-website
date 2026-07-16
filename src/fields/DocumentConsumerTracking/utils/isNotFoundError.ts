/**
 * A utility function to determine if an error is a "not found" error based on its properties.
 * This function checks for common patterns in error objects that indicate a resource was not found.
 * It looks for status codes, status properties, and specific message content to make this determination.
 *
 * @param error The error object to check.
 * @returns True if the error indicates a "not found" condition, false otherwise.
 */
export function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const typedError = error as {
    status?: number;
    statusCode?: number;
    data?: { status?: number };
    message?: string;
  };

  const status = typedError.status ?? typedError.statusCode ?? typedError.data?.status;
  if (status === 404) {
    return true;
  }

  const message = typedError.message?.toLowerCase() ?? '';

  return message.includes('not found') || message.includes('no document');
}

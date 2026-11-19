import { Auth, getAuth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const respond = (method: 'GET' | 'POST') => async (request: Request) => {
  let auth: Auth;

  try {
    auth = await getAuth();
  } catch (error) {
    console.error('[auth] failed to initialize', error);
    return Response.json({ message: 'Authentication is unavailable.' }, { status: 503 });
  }

  return toNextJsHandler(auth)[method](request);
};

export const GET = respond('GET');
export const POST = respond('POST');

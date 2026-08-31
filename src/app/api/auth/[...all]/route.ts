import { getAuth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const GET = async (request: Request) => {
  const { GET: handler } = toNextJsHandler(await getAuth());

  return handler(request);
};

export const POST = async (request: Request) => {
  const { POST: handler } = toNextJsHandler(await getAuth());

  return handler(request);
};

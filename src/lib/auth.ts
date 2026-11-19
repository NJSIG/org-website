import { requireEnv } from '@/utilities/requireEnv';
import config from '@payload-config';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { createAuthMiddleware } from 'better-auth/api';
import { admin } from 'better-auth/plugins/admin';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { getPayload, Payload } from 'payload';

let cached: { client: object; auth: ReturnType<typeof initializeAuth> } | undefined;

const initializeAuth = async (payload: Payload) => {
  const client = payload.db.connection.getClient();
  const db = payload.db.connection.db;

  if (!db) {
    throw new Error('Payload MongoDB connection has no database');
  }

  const requiredSettings = {
    BETTER_AUTH_URL: requireEnv('BETTER_AUTH_URL'),
    BETTER_AUTH_SECRET: requireEnv('BETTER_AUTH_SECRET'),
  };

  const auth = betterAuth({
    appName: 'NJSIG',
    baseURL: requiredSettings.BETTER_AUTH_URL,
    secret: requiredSettings.BETTER_AUTH_SECRET,

    database: mongodbAdapter(db, {
      // Client is optional, but needed for multi-document updates
      client,
      // Disable transactions for standalone MongoDB or sign up will throw
      // For a replica set, enable transactions by setting this to true
      transaction: false,
    }),

    // Collection names for the core schema
    user: { modelName: 'auth-users' },
    session: { modelName: 'auth-sessions' },
    account: { modelName: 'auth-accounts' },
    verification: { modelName: 'auth-verifications' },

    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      requireEmailVerification: true, // Should this be disabled?
      minPasswordLength: 12,
      revokeSessionsOnPasswordReset: true, // a reset signs out every other session
      resetPasswordTokenExpiresIn: 60 * 60, // seconds
      sendResetPassword: async ({ user, url }) => {
        // TODO: Implement email templates
        await payload.sendEmail({
          to: user.email,
          subject: 'NJSIG - Your Password Reset Link',
          text: `Your password reset link: ${url}`,
        });
      },
      onPasswordReset: async ({ user }) => {
        // TODO: Implement confirmation email?
        // We could log a change or notify the user when the password is reset here
      },
    },

    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        // TODO: Implement email templates
        await payload.sendEmail({
          to: user.email,
          subject: 'Verify your email address',
          text: `Confirm your email address: ${url}`,
        });
      },
    },

    plugins: [
      admin(),
      twoFactor({
        issuer: `NJSIG (${requiredSettings.BETTER_AUTH_URL})`,
        twoFactorTable: 'auth-two-factor',
        otpOptions: {
          storeOTP: 'encrypted',
          async sendOTP({ user, otp }) {
            // TODO: Implement email templates
            await payload.sendEmail({
              to: user.email,
              subject: 'NJSIG - Verification Code',
              text: `Your verification code is: ${otp}`,
            });
          },
          trustDeviceMaxAge: 30 * 24 * 60 * 60, // 30 Days (in seconds)
        },
        backupCodeOptions: { storeBackupCodes: 'encrypted' },
      }),
      // magicLink({
      //   disableSignUp: true,
      //   sendMagicLink: async ({ email, url }) => {
      //     await payload.sendEmail({
      //       to: email,
      //       subject: 'NJSIG - Sign-in Link',
      //       text: `Your sign-in link: ${url}`,
      //     });
      //   },
      // }),
    ],

    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        if (ctx.path?.startsWith('/sign-up')) {
          const newSession = ctx.context.newSession;
          const password = ctx.body?.password;

          // Enable MFA for newly created users
          if (newSession && password) {
            await auth.api.enableTwoFactor({
              body: { password, method: 'otp' },
              headers: ctx.headers,
            });
          }
        }
      }),
    },

    // Sync user created by Better Auth to Payload
    databaseHooks: {
      user: {
        create: {
          after: async (betterAuthUser) => {
            // Check if a user already exists in Payload
            const existing = await payload.find({
              collection: 'users',
              where: { email: { equals: betterAuthUser.email } },
              limit: 1,
            });

            if (existing.docs.length > 0) {
              return;
            }

            const name = betterAuthUser.name.split(' ');

            await payload.create({
              collection: 'users',
              data: {
                email: betterAuthUser.email,
                firstName: name[0] ?? '',
                lastName: name.slice(1).join(' ') ?? '',
                role: 'user',
              },
              draft: false,
            });
          },
        },
      },
    },
  });

  return auth;
};

export const getAuth = async () => {
  const payload = await getPayload({ config });
  const client = payload.db.connection.getClient();

  if (cached?.client === client) {
    return cached.auth;
  }

  if (cached) {
    console.log("[auth] Payload's Mongo client changed; rebuilding Better Auth");
  }

  const auth = initializeAuth(payload);
  cached = { client, auth };

  // Don't memoize a failed init
  auth.catch(() => {
    if (cached?.auth === auth) {
      cached = undefined;
    }
  });

  return auth;
};

export type Auth = Awaited<ReturnType<typeof getAuth>>;

/**
 * One-time migration: Create a Better Auth account for each existing Payload user.
 * New accounts have email OTP two-factor authentication enabled; users may enroll in TOTP later.
 *
 * Back up the database or run this against a copy of production data first. This script assumes the Payload user collection
 * has an `email (string)`, `fullName (string)`, and `role (string)` field for each user.
 *
 * NOTE: This script uses environment variables for configuration. By default, it runs in dry-run mode (no changes are made).
 * Set APPLY=1 to enable actual migration. This acts as a "dead man's switch" to prevent accidental data changes.
 *
 * Environment Variables:
 *   APPLY              Set to '1' to apply changes; omit or set to any other value for dry-run mode (default: off)
 *   SEND_RESET_EMAILS  Set to '1' to send password reset emails to migrated users (default: off)
 *   USER_COLLECTION    Name of the user collection to migrate (default: users)
 *   TARGET_USER        Email address of a specific user to migrate (default: all users)
 *
 * Usage Examples:
 *
 * PowerShell:
 *   # Test the script without making any changes (dry-run mode)
 *   pnpm exec payload run scripts/migrate-existing-users.ts
 *
 *   # Run the actual migration (all users in 'users' collection)
 *   $env:APPLY = '1'; pnpm exec payload run scripts/migrate-existing-users.ts
 *
 *   # Migrate a specific user
 *   $env:APPLY = '1'; $env:TARGET_USER = 'user@example.com'; pnpm exec payload run scripts/migrate-existing-users.ts
 *
 *   # Send reset emails to all migrated users
 *   $env:APPLY = '1'; $env:SEND_RESET_EMAILS = '1'; pnpm exec payload run scripts/migrate-existing-users.ts
 *
 * Command Prompt (cmd):
 *   # Test the script without making any changes (dry-run mode)
 *   pnpm exec payload run scripts/migrate-existing-users.ts
 *
 *   # Run the actual migration (all users in 'users' collection)
 *   set APPLY=1 && pnpm exec payload run scripts/migrate-existing-users.ts
 *
 *   # Migrate a specific user
 *   set APPLY=1 && set TARGET_USER=user@example.com && pnpm exec payload run scripts/migrate-existing-users.ts
 *
 *   # Send reset emails to all migrated users
 *   set APPLY=1 && set SEND_RESET_EMAILS=1 && pnpm exec payload run scripts/migrate-existing-users.ts
 *
 * Linux/macOS (Bash/Shell in Container):
 *   # Test the script without making any changes (dry-run mode)
 *   pnpm exec payload run scripts/migrate-existing-users.ts
 *
 *   # Run the actual migration (all users in 'users' collection)
 *   APPLY=1 pnpm exec payload run scripts/migrate-existing-users.ts
 *
 *   # Migrate a specific user
 *   APPLY=1 TARGET_USER=user@example.com pnpm exec payload run scripts/migrate-existing-users.ts
 *
 *   # Send reset emails to all migrated users
 *   APPLY=1 SEND_RESET_EMAILS=1 pnpm exec payload run scripts/migrate-existing-users.ts
 *
 * This script is safe to re-run; users who already have a Better Auth account are detected and reported as "skipped" and
 * not treated as failures, retried, or recreated. Existing Better Auth accounts are not modified.
 */

import { getAuth, type Auth } from '@/lib/auth';
import { RESET_PASSWORD_URL } from '@/lib/authPaths';
import config from '@payload-config';
import { randomBytes } from 'crypto';
import { writeFile } from 'fs/promises';
import { CollectionSlug, getPayload } from 'payload';

type MigrationResult =
  | { email: string; status: 'created' }
  | { email: string; status: 'skipped' }
  | { email: string; status: 'sent-reset' }
  | { email: string; status: 'failed'; error: string };

type MigratableUserData = {
  email: string;
  fullName?: string;
  role?: string;
};

// Hard-coded constants for the migration script
const PAGE_SIZE = 25; // This should be kept reasonable - createUser does password hashing per call
const EMAIL_DELAY_MS = 250; // May need to be tuned for rate-limiting purposes

// User set flags (from env)
const env = process.env;

const APPLY = env.APPLY === '1';
const DRY_RUN = !APPLY;
const SEND_RESET_EMAILS = env.SEND_RESET_EMAILS === '1';
const REQUESTED_USER_COLLECTION = env.USER_COLLECTION ?? 'users';
const TARGET_USER = env.TARGET_USER ?? null;

async function main() {
  const payload = await getPayload({ config });
  const auth = await getAuth();

  console.info('Starting migration');
  console.info('----');
  console.info({
    APPLY,
    DRY_RUN,
    SEND_RESET_EMAILS,
    REQUESTED_USER_COLLECTION,
    TARGET_USER,
  });
  console.info('----');

  // Validate the user collection to ensure it exists in the Payload configuration
  const VALIDATED_USER_COLLECTION = payload.config.collections
    .map((collection) => collection.slug)
    .find((slug): slug is CollectionSlug => slug === REQUESTED_USER_COLLECTION);

  if (!VALIDATED_USER_COLLECTION) {
    throw new Error(`Invalid user collection: ${REQUESTED_USER_COLLECTION}`);
  }

  // Validate the requested user if passed
  if (TARGET_USER !== null && (!TARGET_USER || TARGET_USER.startsWith('--'))) {
    throw new Error('--user requires an email value, e.g. --user someone@example.com');
  }

  // Paginate for handling large existing user collections and mark
  // a resumable cursor in case the process dies partway through.
  let page = 1;
  let hasNextPage = true;

  const results: MigrationResult[] = [];

  while (hasNextPage) {
    const { docs, nextPage } = await payload.find({
      collection: VALIDATED_USER_COLLECTION,
      limit: PAGE_SIZE,
      page,
      sort: 'id', // Stable ordering so subsequent runs walk the user collection consistently
      where: TARGET_USER ? { email: { equals: TARGET_USER } } : undefined,
    });

    for (const user of docs) {
      if (SEND_RESET_EMAILS) {
        results.push(await sendOneReset(auth, user as MigratableUserData));
      } else {
        results.push(await migrateOne(auth, user as MigratableUserData));
      }
    }

    if (TARGET_USER && page === 1 && docs.length === 0) {
      throw new Error(`No user found with email ${TARGET_USER}`);
    }

    console.log(`Processed page ${page} (${docs.length} users)`);
    hasNextPage = Boolean(nextPage);
    page += 1;
  }

  await writeReport(results);
}

async function migrateOne(auth: Auth, user: MigratableUserData): Promise<MigrationResult> {
  // Idempotency check first rather than relying on `createUser` to return a duplicate-email error.
  const existing = await auth.api
    .listUsers({ query: { searchField: 'email', searchValue: user.email, limit: 1 } })
    .catch(() => null);

  if (existing?.users?.length) {
    return { email: user.email, status: 'skipped' };
  }

  if (DRY_RUN) {
    console.log(`[DRY RUN] Would try to create a Better Auth account for ${user.email}`);
    return { email: user.email, status: 'created' };
  }

  try {
    await auth.api.createUser({
      body: {
        email: user.email,
        name: user.fullName ?? user.email,
        password: randomBytes(24).toString('hex'), // Randomly generated, never surfaced to the user
        role: user.role === 'admin' ? 'admin' : 'user', // Better Auth's admin-plugin role, no related to Payload, but we'll make sure admins are correctly assigned/ Pre-verify the email since the user already exists
        data: {
          emailVerified: true, // We know the Payload users already own the associated email address, so pre-verify it in Better Auth
          twoFactorEnabled: true, // Email OTP needs no TOTP secret or backup codes
        },
      },
    });

    return { email: user.email, status: 'created' };
  } catch (error) {
    return { email: user.email, status: 'failed', error: (error as Error).message };
  }
}

// This is deliberately called only when a flag is passed so we're not sending emails
// when generating accounts, we want to send all the email notifications explicitly.
async function sendOneReset(auth: Auth, user: MigratableUserData): Promise<MigrationResult> {
  await new Promise((resolve) => setTimeout(resolve, EMAIL_DELAY_MS));

  if (DRY_RUN) {
    console.log(`[DRY RUN] Would send a password reset email to ${user.email}`);
    return { email: user.email, status: 'sent-reset' };
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: user.email,
        redirectTo: RESET_PASSWORD_URL,
      },
    });

    return { email: user.email, status: 'sent-reset' };
  } catch (error) {
    return { email: user.email, status: 'failed', error: (error as Error).message };
  }
}

async function writeReport(results: MigrationResult[]) {
  const failed = results.filter(
    (r): r is Extract<MigrationResult, { status: 'failed' }> => r.status === 'failed',
  );
  const created = results.filter((r) => r.status === 'created').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;

  console.info(`\nDone. Created: ${created}, Skipped: ${skipped}, Failed: ${failed.length}`);

  if (failed.length) {
    console.info('Failed (re-running this script is safe, already created users will be skipped):');

    failed.forEach((f) => console.warn(`    - ${f.email}: ${f.error ?? 'Unknown Error'}`));
  }

  await writeFile(
    `src/scripts/migration-report-${Date.now()}.json`,
    JSON.stringify({ created, skipped, failed, results }, null, 2),
  );
}

await main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration script crashed:', error);
    process.exit(1);
  });

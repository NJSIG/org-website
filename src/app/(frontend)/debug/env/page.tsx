import { headers } from 'next/headers';

/**
 * Diagnostic page to verify environment variables are loaded correctly
 * Remove this page after debugging or restrict access in production
 */
export default async function DebugEnvPage() {
  await headers(); // Force dynamic rendering

  const mapKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
  const hasKey = !!mapKey;
  const keyPrefix = mapKey ? `${mapKey.substring(0, 10)}...` : 'NOT SET';

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Environment Variables Debug</h1>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Google Maps API Key (Server Side)
            </h2>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                {hasKey ? '✅ SET' : '❌ NOT SET'}
              </span>
              <span className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">{keyPrefix}</span>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Environment Info</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Node ENV:</strong>{' '}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {process.env.NODE_ENV}
                </span>
              </div>
              <div>
                <strong>Next.js Version:</strong>{' '}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {process.env.npm_package_dependencies_next || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Security Note</h3>
            <p className="text-sm text-yellow-800">
              This debug page should be removed or access-restricted in production. It exposes
              information about your environment variables.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold text-blue-900 mb-2">🔍 Important Note</h3>
            <p className="text-sm text-blue-800">
              In production builds, Next.js inlines NEXT_PUBLIC_* environment variables at build
              time. The variables are not accessible via process.env in the browser - they are
              replaced with their actual values during the build process.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-gray-800">Expected Results:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Server-side should show ✅ SET</li>
              <li>Key prefix should start with &quot;AIza&quot; (Google Maps keys)</li>
              <li>Client-side console should also show the key is available</li>
              <li>If any check fails, review Coolify environment variable settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

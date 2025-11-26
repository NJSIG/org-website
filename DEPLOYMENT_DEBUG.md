# Google Maps API Key Debugging Guide for Coolify Deployment

## Issue Summary

The Google Maps component doesn't receive the API key in production (Coolify with Nixpacks) but works locally in development and production builds.

## Root Causes Identified & Fixed

### 1. **Hydration Mismatch** ✅ FIXED

- **Problem**: The `mounted` state caused server to render placeholder, client to render iframe
- **Solution**: Removed `useState` and `useEffect` for mounted check
- **Result**: Consistent SSR/CSR rendering

### 2. **Client-Side process.env Access** ✅ FIXED

- **Problem**: Attempted to access `process.env` in client component, which doesn't exist in browser
- **Error**: `Uncaught ReferenceError: process is not defined`
- **Solution**: API key is now passed from server component to client component as a prop
- **Result**: API key properly available in client without runtime errors

### 3. **Environment Variable Timing** ✅ VERIFIED

- **Requirement**: `NEXT_PUBLIC_*` variables must be available at build time
- **Status**: Verified working - build logs show API key is set
- **Note**: Next.js inlines these values during build, they're not accessible via `process.env` in the browser

## Verification Steps for Coolify

### Step 1: Verify Build-Time Environment Variables

Add this to your Nixpacks build phase to verify the API key is available:

```toml
[phases.build]
cmds = [
  "echo 'Checking NEXT_PUBLIC_MAPS_API_KEY at build time...'",
  "if [ -z \"$NEXT_PUBLIC_MAPS_API_KEY\" ]; then echo 'WARNING: NEXT_PUBLIC_MAPS_API_KEY is NOT set'; else echo 'NEXT_PUBLIC_MAPS_API_KEY is set'; fi",
  "next build --experimental-build-mode compile"
]
```

### Step 2: Check Coolify Environment Variable Settings

In Coolify, ensure:

1. Go to your app → Environment Variables
2. Verify `NEXT_PUBLIC_MAPS_API_KEY` is set
3. **CRITICAL**: Ensure "Build Time" checkbox is CHECKED (not just Runtime)
4. Click "Save" and redeploy

### Step 3: Add Diagnostic Logging (Temporary)

Add to `next.config.mjs`:

```javascript
console.log('Build time env check:', {
  hasMapKey: !!process.env.NEXT_PUBLIC_MAPS_API_KEY,
  keyPrefix: process.env.NEXT_PUBLIC_MAPS_API_KEY?.substring(0, 10) + '...',
});
```

### Step 4: Runtime Verification Page

Create a diagnostic page to check runtime values (already created in next steps).

## Common Coolify/Nixpacks Issues

### Issue A: Environment Variables Not Set for Build Phase

**Symptom**: API key is undefined in client component
**Solution**: In Coolify, ensure the variable is marked for "Build Time"

### Issue B: Nixpacks Cache

**Symptom**: Old build without env vars is cached
**Solution**:

1. In Coolify, go to your app
2. Click "Force Rebuild" (clear cache)
3. Redeploy

### Issue C: Next.js Standalone Output

**Symptom**: Environment variables lost in standalone build
**Solution**: Add to `next.config.mjs`:

```javascript
const nextConfig = {
  // ... existing config
  experimental: {
    // Ensure env vars are included in standalone output
    outputFileTracingIncludes: {
      '/': ['.env*'],
    },
  },
};
```

### Issue D: Static Optimization

**Symptom**: Page is statically optimized and doesn't include runtime env
**Solution**: Already handled - page uses server-side data fetching

## Testing Checklist

- [ ] Verify API key shows in Coolify environment variables
- [ ] Ensure "Build Time" is checked for `NEXT_PUBLIC_MAPS_API_KEY`
- [ ] Force rebuild to clear Nixpacks cache
- [ ] Check build logs for API key verification message
- [ ] Visit `/debug/env` page to verify runtime values
- [ ] Check browser console for any API key errors
- [ ] Verify no hydration warnings in browser console

## Expected Behavior After Fixes

✅ No hydration warnings
✅ Map loads on first render
✅ API key is available in both server and client components
✅ Consistent behavior between local and production builds

## If Issues Persist

1. Check Coolify build logs for the echo statement output
2. Verify the API key format is correct (should start with `AIza`)
3. Ensure the API key has the correct restrictions in Google Cloud Console
4. Check if Google Maps Embed API is enabled in your GCP project
5. Verify the API key allows requests from your Coolify domain

## Code Changes Made

1. **`src/components/GoogleMap/index.tsx`**
   - Removed console.warn
   - Simplified server component

2. **`src/components/GoogleMap/client.tsx`**
   - Removed `useState` and `useEffect` for mounted check
   - Removed console.log of API key
   - Simplified rendering logic to prevent hydration mismatches
   - Added fallback env variable access pattern

3. **`nixpacks.toml`** (recommended update - see below)
   - Added build-time verification

## Next Steps

1. Apply the updated `nixpacks.toml` configuration
2. Ensure Coolify environment variables are correctly configured
3. Force rebuild in Coolify
4. Deploy and test

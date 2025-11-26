# 🚀 Coolify Deployment Checklist - Google Maps Fix

## Summary of Changes

### ✅ Code Changes Made

1. **GoogleMap Server Component** (`src/components/GoogleMap/index.tsx`)
   - Removed `console.warn` that could cause SSR issues
   - Simplified API key handling

2. **GoogleMap Client Component** (`src/components/GoogleMap/client.tsx`)
   - ❌ **REMOVED** `useState` and `useEffect` for mounted check (caused hydration mismatch)
   - ❌ **REMOVED** `console.log` of API key
   - ✅ **FIXED** Consistent SSR/CSR rendering
   - ✅ **ADDED** Direct environment variable fallback

3. **Event Page Client** (`page.client.tsx`)
   - Removed debug `console.log` statement

4. **Build Configuration** (`next.config.mjs`)
   - Added build-time environment variable verification

5. **Nixpacks Configuration** (`nixpacks.toml`)
   - Added build-time logging to verify API key availability

6. **Diagnostic Tools**
   - Created `/debug/env` page to verify environment variables
   - Created `DEPLOYMENT_DEBUG.md` with troubleshooting guide

---

## 🔧 Deployment Steps for Coolify

### Step 1: Configure Environment Variables in Coolify

1. **Open your Coolify dashboard**
2. **Navigate to your app** → Environment Variables
3. **Find or add** `NEXT_PUBLIC_MAPS_API_KEY`
4. **CRITICAL**: ✅ **Check BOTH boxes**:
   - ✅ **Build Time** (must be checked!)
   - ✅ **Runtime** (optional but recommended)
5. **Save changes**

> **Why?** Next.js inlines `NEXT_PUBLIC_*` variables during build. If not available at build time, they will be `undefined` in the client bundle.

### Step 2: Clear Cache and Rebuild

1. In Coolify, go to your app
2. Click **"Force Rebuild"** or **"Clear Build Cache"**
3. Click **"Deploy"**

> **Why?** Nixpacks may cache old builds that don't have the environment variable.

### Step 3: Monitor Build Logs

Watch for these messages in the build logs:

```
=== Build Environment Check ===
NEXT_PUBLIC_MAPS_API_KEY: SET
```

And in the Next.js build output:

```
🔍 Build-time environment check:
  NEXT_PUBLIC_MAPS_API_KEY: ✅ SET
```

If you see `NOT_SET` or `❌ NOT SET`, the variable is not available at build time.

### Step 4: Test the Deployment

1. **Visit an event page** (e.g., `/events/2025/12/01/some-event`)
2. **Check for**:
   - ✅ Map loads correctly
   - ✅ No hydration warnings in console
   - ✅ No "API key" errors

3. **Visit diagnostic page**: `https://your-domain.com/debug/env`
   - Should show: `✅ SET`
   - Key prefix should show `AIza...`

4. **Check browser console**:
   - Should show client-side env check with API key available

### Step 5: Verify and Clean Up

Once everything works:

1. **Remove or restrict** the `/debug/env` page in production:
   - Delete `src/app/(frontend)/debug/env/page.tsx`, OR
   - Add authentication/IP restrictions

2. **Optional**: Remove build-time console logs from `next.config.mjs` if desired

---

## 🐛 Troubleshooting

### Issue: Map still doesn't load

**Check 1: API Key Format**

- Google Maps keys start with `AIza`
- Verify no extra spaces or quotes in Coolify env var

**Check 2: Google Cloud Console**

- Ensure **Maps Embed API** is enabled
- Check API key restrictions (should allow your domain)

**Check 3: Coolify Configuration**

```bash
# SSH into your Coolify server and check the running container
docker exec -it <container-id> printenv | grep NEXT_PUBLIC_MAPS_API_KEY
```

### Issue: Build logs show `NOT_SET`

**Solution:**

- Environment variable is not configured for build time in Coolify
- Go back to Step 1 and ensure "Build Time" checkbox is checked

### Issue: Hydration warnings still appear

**Solution:**

- The mounted check has been removed, so this should be fixed
- Clear browser cache and hard reload (Ctrl+Shift+R)
- Verify you deployed the latest code

### Issue: Different error in browser console

**Common Google Maps errors:**

- `InvalidKeyMapError`: API key is invalid or not authorized
- `RefererNotAllowedMapError`: Domain not allowed in API key restrictions
- `ApiNotActivatedMapError`: Maps Embed API not enabled in GCP

---

## 📋 Quick Reference

### Environment Variable Requirements

| Variable                   | Build Time | Runtime | Required |
| -------------------------- | ---------- | ------- | -------- |
| `NEXT_PUBLIC_MAPS_API_KEY` | ✅ YES     | ✅ YES  | ✅ YES   |

### Files Modified

- ✅ `src/components/GoogleMap/index.tsx`
- ✅ `src/components/GoogleMap/client.tsx`
- ✅ `src/app/(frontend)/events/[year]/[month]/[day]/[slug]/page.client.tsx`
- ✅ `next.config.mjs`
- ✅ `nixpacks.toml`
- ➕ `src/app/(frontend)/debug/env/page.tsx` (new)
- ➕ `DEPLOYMENT_DEBUG.md` (new)

### Key Fixes

1. ❌ Removed hydration-causing `mounted` state
2. ✅ Ensured consistent SSR/CSR rendering
3. ✅ Added build-time verification
4. ✅ Removed console statements that could cause issues
5. ✅ Added diagnostic tools

---

## 🎯 Expected Outcome

After following these steps:

- ✅ Google Maps loads on first render
- ✅ No hydration warnings
- ✅ Works in both development and production
- ✅ API key properly injected at build time
- ✅ Consistent behavior across environments

---

## 📞 Need Help?

If issues persist after following all steps:

1. Check `/debug/env` page output
2. Review Coolify build logs for env var verification
3. Verify Google Cloud Console API settings
4. Check browser console for specific error messages
5. Reference `DEPLOYMENT_DEBUG.md` for detailed troubleshooting

---

**Last Updated**: 2025-11-26
**Target Platform**: Coolify with Nixpacks
**Framework**: Next.js 15+ (App Router)

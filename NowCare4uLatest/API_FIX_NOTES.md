# API Configuration Fix - Production Deployment Issue

## Problem
Admin login was failing in production with error: `Unexpected token '<', "<!doctype "... is not valid JSON`

## Root Cause
- In development: Vite's proxy in `vite.config.ts` forwards `/api/*` requests to the backend
- In production: The proxy doesn't exist, so `/api/*` requests go to the frontend server, which returns HTML instead of JSON

## Solution
Created `/src/config/api.ts` to handle environment-specific API URLs:

```typescript
export const API_BASE_URL = import.meta.env.DEV
  ? '/api'  // Use proxy in development
  : 'https://nowcare4-u-production-acbz.vercel.app/api';  // Full URL in production

export const buildApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};
```

## Files Fixed
✅ `/src/_admin/AdminContext.tsx` - Admin login now uses `buildApiUrl('admin/login')`

## Other Files That May Need Updates (Optional)
The following files still use hardcoded `/api/...` URLs. They will work in development but may fail in production:

1. `/src/_calculator/diabetes/DiabetesRecords.tsx` (lines 46, 78)
2. `/src/_calculator/diabetes/DiabetesCalc.tsx` (line 95)
3. `/src/_calculator/kickCounter.tsx` (lines 50, 71, 90, 112, 193, 213, 231)
4. `/src/_calculator/ovulation/OvulationCalculator.tsx` (line 98)
5. `/src/_calculator/congnitiveTest/CognitiveRecords.tsx` (lines 37, 54)
6. `/src/_calculator/pregnancyWeight/PregnancyWeightCalc.tsx` (lines 18, 34)
7. `/src/_calculator/pregnancyWeight/PregnancyWeightRecords.tsx` (lines 37, 62, 80)
8. `/src/auth/PhoneLogin.tsx` (line 27)

## How to Fix Other Files
Replace:
```typescript
fetch('/api/some-endpoint', { ... })
```

With:
```typescript
import { buildApiUrl } from '../config/api';
// ...
fetch(buildApiUrl('some-endpoint'), { ... })
```

## Testing
1. Test admin login locally (should still work)
2. Build and deploy: `npm run build`
3. Test admin login in production (should now work)

## Deployment Commands
```bash
# Build the project
npm run build

# Deploy to Firebase (or your hosting platform)
firebase deploy
```

# ProjectHub

## Vercel deployment checklist

1. Create/import the project in Vercel.
2. Set all required Firebase environment variables for **Production**, **Preview**, and **Development**:

```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
vercel env add VITE_FIREBASE_MEASUREMENT_ID
```

3. Pull env vars locally (optional):

```bash
vercel env pull .env.local
```

4. Build command is already configured to validate env vars before building:

```bash
npm run build
```

## Notes
- `.npmrc` forces the public npm registry (`https://registry.npmjs.org/`) to avoid private/misconfigured registry resolution issues in CI.
- Vercel is configured for Vite and SPA rewrites in `vercel.json`.

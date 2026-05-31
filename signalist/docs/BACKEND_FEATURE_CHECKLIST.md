# Backend Feature Checklist

## Environment and Config
- [ ] `.env.local` exists with all required keys
- [ ] `npm run dev` starts without env validation errors
- [ ] MongoDB connection succeeds on first API request

## Authentication (Better Auth)
- [ ] `POST /api/auth/sign-up/email` creates a user
- [ ] `POST /api/auth/sign-in/email` signs in successfully
- [ ] `GET /api/auth/get-session` returns a user when signed in
- [ ] Session persists after page refresh
- [ ] Logout clears session and blocks dashboard access

## Middleware Protection
- [ ] Unauthenticated user visiting `/dashboard` is redirected to `/auth/login`
- [ ] Unauthenticated request to `/api/watchlist` returns `401`
- [ ] Auth endpoints (`/api/auth/*`) remain reachable without redirect loops
- [ ] Inngest route (`/api/inngest`) remains reachable

## Watchlist API
- [ ] `GET /api/watchlist` returns current user watchlist
- [ ] `POST /api/watchlist` saves symbols for current user
- [ ] Watchlist is isolated per user account
- [ ] Watchlist loads correctly in dashboard watchlist page

## Portfolio API
- [ ] `GET /api/portfolio` returns current user holdings
- [ ] `POST /api/portfolio` saves holdings for current user
- [ ] Portfolio is isolated per user account
- [ ] Portfolio reload shows persisted holdings

## Gemini Predictions
- [ ] `POST /api/predictions` accepts a symbol and returns prediction JSON
- [ ] Prediction response includes direction, confidence, target, and reason
- [ ] Prediction is saved in MongoDB `predictions` collection
- [ ] Invalid payload returns `400` with validation error

## Email + Inngest
- [ ] Inngest serve route responds at `/api/inngest`
- [ ] `user/registered` event triggers welcome email send
- [ ] SMTP credentials send mail successfully through Gmail
- [ ] Failures are visible in logs for debugging

## Security and Data Quality
- [ ] No API keys are exposed to client bundles
- [ ] Protected APIs never accept `userId` from request body
- [ ] Request bodies are schema-validated using zod
- [ ] Unauthorized requests consistently return `401`

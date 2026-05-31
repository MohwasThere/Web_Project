# Signalist Code Explainer

This file maps each product feature to its implementation so the codebase is easy to read, demo, and onboard with.

How to use this doc:
- Start with the Quick Feature Index to jump directly to the feature you want.
- Open the section link, then use the listed code links as your starting files.
- For each feature, read in this order: page/component -> API route -> model/lib.

## Jump Links

- [Quick Feature Index](#quick-feature-index)
- [Frontend Features](#frontend-features)
- [Backend Features](#backend-features)

## Quick Feature Index

### Frontend (UI)
- Home/Landing page -> [Landing page and marketing hero](#1-landing-page-and-marketing-hero)
- Login/Signup forms -> [Authentication UI (login/signup)](#2-authentication-ui-loginsignup)
- Sidebar and dashboard shell -> [Dashboard shell and sidebar navigation](#4-dashboard-shell-and-sidebar-navigation)
- Dashboard widgets -> [Dashboard overview widgets](#5-dashboard-overview-widgets)
- Stock search and chart -> [Market page: search + advanced chart](#6-market-page-search--advanced-chart)
- Watchlist UI -> [Watchlist page](#7-watchlist-page)
- AI predictions UI -> [AI predictions page](#8-ai-predictions-page)
- Portfolio simulator UI -> [Portfolio simulator page](#9-portfolio-simulator-page)
- News feed UI -> [News page](#10-news-page)
- Plans and upgrades UI -> [Subscription page](#11-subscription-page)
- User profile UI -> [Profile page](#12-profile-page)

### Backend (API/Infrastructure)
- Route guards and auth redirect -> [Route protection and session gating](#1-route-protection-and-session-gating)
- Auth provider wiring -> [Auth provider integration (better-auth)](#2-auth-provider-integration-better-auth)
- Env setup and required keys -> [Environment variable validation](#3-environment-variable-validation)
- MongoDB/Mongoose connections -> [Database connectivity](#4-database-connectivity)
- Watchlist data API -> [Watchlist API](#5-watchlist-api)
- Portfolio data API -> [Portfolio API](#6-portfolio-api)
- Subscription data API -> [Subscription API](#7-subscription-api)
- Market search/quotes API -> [Market data APIs](#8-market-data-apis)
- AI predictions API -> [AI prediction generation API](#9-ai-prediction-generation-api)
- Welcome email sending -> [Welcome email API](#10-welcome-email-api)
- Inngest background jobs -> [Inngest event/cron handler](#11-inngest-eventcron-handler)

## Frontend Features

### 1) Landing page and marketing hero
- What it does: public homepage with CTA links to signup, login, and dashboard.
- Website page: `/`
- Keywords: landing, hero, CTA, home
- Best entry file: [`app/page.tsx` (component start)](../app/page.tsx#L6)
- Main code:
  - [`app/page.tsx` (hero/nav/CTA)](../app/page.tsx#L8)

### 2) Authentication UI (login/signup)
- What it does: handles email/password sign in and sign up from the browser.
- Website page:
  - `/auth/login`
  - `/auth/signup`
- Keywords: auth, login, signup, password validation, credential errors
- Validation and UX details:
  - signup validates password rules (length, uppercase, lowercase, number, confirm match) and shows inline + toast errors.
  - login maps invalid credential responses to a clear inline + toast message: "Incorrect email or password."
- Best entry files:
  - [`app/auth/signup/page.tsx` (submit + password validation)](../app/auth/signup/page.tsx#L26)
  - [`app/auth/login/page.tsx` (submit + credential errors)](../app/auth/login/page.tsx#L31)
- Main code:
  - [`app/auth/login/page.tsx` (request + error mapping)](../app/auth/login/page.tsx#L31)
  - [`app/auth/signup/page.tsx` (password checks + submit)](../app/auth/signup/page.tsx#L22)

### 3) Global app wrapper and subscription state
- What it does: wraps the entire app with a subscription context so plan data is available across pages.
- Website page: global wrapper (applies to all pages)
- Keywords: layout, provider, context, subscription state
- Best entry file: [`app/layout.tsx` (provider wiring)](../app/layout.tsx#L11)
- Main code:
  - [`app/layout.tsx` (SubscriptionProvider wrapper)](../app/layout.tsx#L15)
  - [`app/context/SubscriptionContext.tsx` (state + API sync)](../app/context/SubscriptionContext.tsx#L15)

### 4) Dashboard shell and sidebar navigation
- What it does: persistent sidebar, active route highlight, profile avatar/name load, and responsive collapse behavior.
- Website page: all `/dashboard/*` pages
- Keywords: dashboard layout, sidebar, navigation, profile avatar
- Best entry file: [`app/dashboard/layout.tsx` (layout component)](../app/dashboard/layout.tsx#L32)
- Main code:
  - [`app/dashboard/layout.tsx` (nav items)](../app/dashboard/layout.tsx#L21)
  - [`app/dashboard/layout.tsx` (session avatar load)](../app/dashboard/layout.tsx#L38)

### 5) Dashboard overview widgets
- What it does: shows market overview and heatmap widgets on the main dashboard.
- Website page: `/dashboard`
- Keywords: dashboard, market overview, heatmap, TradingView widgets
- Best entry files:
  - [`app/dashboard/page.tsx` (dashboard page)](../app/dashboard/page.tsx#L8)
  - [`components/TradingViewWidget.tsx` (widget renderer)](../components/TradingViewWidget.tsx#L16)
- Main code:
  - [`app/dashboard/page.tsx` (overview + heatmap instances)](../app/dashboard/page.tsx#L19)
  - [`components/TradingViewWidget.tsx` (container + title)](../components/TradingViewWidget.tsx#L27)
  - [`app/hooks/useTradingview.ts` (script injection)](../app/hooks/useTradingview.ts#L13)
  - [`lib/constants.ts` (widget configs)](../lib/constants.ts#L53)

### 6) Market page: search + advanced chart
- What it does: ticker/company search, suggestion dropdown, quick-select symbols, and advanced TradingView chart loading by symbol.
- Website page: `/dashboard/market`
- Keywords: market, stock search, chart, symbol, ticker
- Best entry file: [`app/dashboard/market/page.tsx` (page component)](../app/dashboard/market/page.tsx#L36)
- Main code:
  - [`app/dashboard/market/page.tsx` (search + suggestions)](../app/dashboard/market/page.tsx#L42)
  - [`app/dashboard/market/page.tsx` (chart load)](../app/dashboard/market/page.tsx#L137)
  - [`lib/market/logos.ts` (logo candidate resolution)](../lib/market/logos.ts#L30)
  - [`lib/constants.ts` (candle chart config)](../lib/constants.ts#L195)

### 7) Watchlist page
- What it does: add/remove symbols, search suggestions, persist watchlist to backend, refresh quotes every 30 seconds, and display save status.
- Website page: `/dashboard/watchlist`
- Keywords: watchlist, add symbol, remove symbol, live quotes, autosave
- Best entry file: [`app/dashboard/watchlist/page.tsx` (page component)](../app/dashboard/watchlist/page.tsx#L45)
- Main code:
  - [`app/dashboard/watchlist/page.tsx` (load + persist)](../app/dashboard/watchlist/page.tsx#L75)
  - [`app/dashboard/watchlist/page.tsx` (quote refresh loop)](../app/dashboard/watchlist/page.tsx#L167)
  - [`lib/market/logos.ts` (symbol normalize + logos)](../lib/market/logos.ts#L22)

### 8) AI predictions page
- What it does: generates session predictions, enforces limits by plan, and lets users push a prediction into watchlist.
- Website page: `/dashboard/predictions`
- Keywords: AI predictions, plan limits, prediction usage, add to watchlist
- Best entry file: [`app/dashboard/predictions/page.tsx` (page component)](../app/dashboard/predictions/page.tsx#L45)
- Main code:
  - [`app/dashboard/predictions/page.tsx` (prediction generation + limits)](../app/dashboard/predictions/page.tsx#L64)
  - [`app/dashboard/predictions/page.tsx` (add to watchlist flow)](../app/dashboard/predictions/page.tsx#L77)
  - [`lib/subscription.ts` (plan features)](../lib/subscription.ts#L4)
  - [`app/context/SubscriptionContext.tsx` (currentPlan source)](../app/context/SubscriptionContext.tsx#L16)

### 9) Portfolio simulator page
- What it does: add/remove simulated holdings, persist portfolio to backend, live quote refresh, and P/L calculations.
- Website page: `/dashboard/portfolio`
- Keywords: portfolio, holdings, P/L, simulator, live prices
- Best entry file: [`app/dashboard/portfolio/page.tsx` (page component)](../app/dashboard/portfolio/page.tsx#L44)
- Main code:
  - [`app/dashboard/portfolio/page.tsx` (load + persist)](../app/dashboard/portfolio/page.tsx#L77)
  - [`app/dashboard/portfolio/page.tsx` (P/L calculations)](../app/dashboard/portfolio/page.tsx#L193)

### 10) News page
- What it does: displays live financial headlines through TradingView timeline widget.
- Website page: `/dashboard/news`
- Keywords: news, headlines, timeline, TradingView
- Best entry file: [`app/dashboard/news/page.tsx` (page component)](../app/dashboard/news/page.tsx#L6)
- Main code:
  - [`app/dashboard/news/page.tsx` (news widget usage)](../app/dashboard/news/page.tsx#L14)
  - [`components/TradingViewWidget.tsx` (widget renderer)](../components/TradingViewWidget.tsx#L16)
  - [`lib/constants.ts` (top stories config)](../lib/constants.ts#L130)

### 11) Subscription page
- What it does: presents plans and sends upgrade action to backend through the subscription context.
- Website page: `/dashboard/subscription`
- Keywords: subscription, plans, upgrade, billing tier
- Best entry file: [`app/dashboard/subscription/page.tsx` (page component)](../app/dashboard/subscription/page.tsx#L15)
- Main code:
  - [`app/dashboard/subscription/page.tsx` (plan cards + upgrade action)](../app/dashboard/subscription/page.tsx#L30)
  - [`app/context/SubscriptionContext.tsx` (upgradePlan POST)](../app/context/SubscriptionContext.tsx#L32)
  - [`lib/subscription.ts` (limits and feature flags)](../lib/subscription.ts#L4)

### 12) Profile page
- What it does: reads current auth session data, computes portfolio stats, displays account settings UI.
- Website page: `/dashboard/profile`
- Keywords: profile, account settings, session user, portfolio stats
- Best entry file: [`app/dashboard/profile/page.tsx` (page component)](../app/dashboard/profile/page.tsx#L7)
- Main code:
  - [`app/dashboard/profile/page.tsx` (session + portfolio fetch)](../app/dashboard/profile/page.tsx#L26)
  - [`app/dashboard/profile/page.tsx` (profile + settings UI)](../app/dashboard/profile/page.tsx#L71)

## Backend Features

### 1) Route protection and session gating
- What it does: protects `/dashboard/*` and `/api/*` routes, allows public/auth/infra routes, redirects unauthenticated users.
- Website page: affects all protected pages under `/dashboard/*` and protected APIs under `/api/*`
- Keywords: middleware, route guard, auth redirect, unauthorized
- Best entry file: [`middleware.ts` (main middleware fn)](../middleware.ts#L18)
- Main code:
  - [`middleware.ts` (public/auth route checks)](../middleware.ts#L6)
  - [`middleware.ts` (session check + redirects)](../middleware.ts#L29)

### 2) Auth provider integration (better-auth)
- What it does: configures better-auth with MongoDB adapter, auth base path, and session behavior.
- Website page: used by `/auth/login`, `/auth/signup`, and all authenticated pages
- Keywords: better-auth, session, auth config, Mongo adapter
- Best entry file: [`lib/auth.ts` (better-auth config)](../lib/auth.ts#L10)
- Main code:
  - [`lib/auth.ts` (provider + adapter + session config)](../lib/auth.ts#L10)
  - [`lib/auth-session.ts` (server session helper)](../lib/auth-session.ts#L5)
  - [`app/api/auth/[...all]/route.ts` (Next handlers)](../app/api/auth/%5B...all%5D/route.ts#L5)

### 3) Environment variable validation
- What it does: validates required env values (MongoDB, Gemini, SMTP, auth secrets) at startup with Zod.
- Website page: startup/runtime infrastructure (no direct UI page)
- Keywords: env, zod, configuration, required variables
- Best entry file: [`lib/env.ts` (schema + parse)](../lib/env.ts#L3)
- Main code:
  - [`lib/env.ts` (validation schema)](../lib/env.ts#L3)
  - [`lib/env.ts` (secret fallback guard)](../lib/env.ts#L23)

### 4) Database connectivity
- What it does: manages reusable MongoDB and Mongoose connections.
- Website page: backend infrastructure (used by watchlist, portfolio, subscription, predictions)
- Keywords: MongoDB, Mongoose, database connection, client reuse
- Best entry files:
  - [`lib/db/mongo-client.ts` (native client)](../lib/db/mongo-client.ts#L9)
  - [`lib/db/mongoose.ts` (mongoose connection)](../lib/db/mongoose.ts#L9)
- Main code:
  - [`lib/db/mongo-client.ts` (global reuse + db getter)](../lib/db/mongo-client.ts#L25)
  - [`lib/db/mongoose.ts` (cached connect)](../lib/db/mongoose.ts#L10)

### 5) Watchlist API
- What it does: GET returns user watchlist; POST validates and upserts list items for current user.
- Website page: `/dashboard/watchlist` and AI predictions "Add to Watchlist"
- Keywords: watchlist API, GET watchlist, POST watchlist, upsert
- Best entry file: [`app/api/watchlist/route.ts` (GET/POST handlers)](../app/api/watchlist/route.ts#L19)
- Main code:
  - [`app/api/watchlist/route.ts` (GET)](../app/api/watchlist/route.ts#L19)
  - [`app/api/watchlist/route.ts` (POST upsert)](../app/api/watchlist/route.ts#L49)
  - [`lib/db/models/watchlist.ts` (schema)](../lib/db/models/watchlist.ts#L3)

### 6) Portfolio API
- What it does: GET returns holdings; POST validates and upserts holdings for current user.
- Website page: `/dashboard/portfolio` and `/dashboard/profile` stats
- Keywords: portfolio API, holdings, save portfolio, get portfolio
- Best entry file: [`app/api/portfolio/route.ts` (GET/POST handlers)](../app/api/portfolio/route.ts#L18)
- Main code:
  - [`app/api/portfolio/route.ts` (GET)](../app/api/portfolio/route.ts#L18)
  - [`app/api/portfolio/route.ts` (POST upsert)](../app/api/portfolio/route.ts#L37)
  - [`lib/db/models/portfolio.ts` (schema)](../lib/db/models/portfolio.ts#L14)

### 7) Subscription API
- What it does: GET ensures user has a subscription record (default Free); POST updates plan/status.
- Website page: `/dashboard/subscription`, `/dashboard/predictions` usage limits
- Keywords: subscription API, plan update, default plan, user tier
- Best entry file: [`app/api/subscription/route.ts` (GET/POST handlers)](../app/api/subscription/route.ts#L12)
- Main code:
  - [`app/api/subscription/route.ts` (GET ensure default)](../app/api/subscription/route.ts#L20)
  - [`app/api/subscription/route.ts` (POST update)](../app/api/subscription/route.ts#L32)
  - [`lib/db/models/subscription.ts` (schema)](../lib/db/models/subscription.ts#L3)

### 8) Market data APIs
- What it does:
  - search endpoint queries Yahoo Finance symbol search.
  - quotes endpoint fetches current price and % change for one or many symbols.
- Website page:
  - `/dashboard/market` (search)
  - `/dashboard/watchlist` (quotes refresh)
  - `/dashboard/portfolio` (quotes refresh)
- Keywords: market API, Yahoo Finance, symbol search, quotes
- Best entry files:
  - [`app/api/market/search/route.ts` (search handler)](../app/api/market/search/route.ts#L11)
  - [`app/api/market/quotes/route.ts` (quotes handler)](../app/api/market/quotes/route.ts#L16)
- Main code:
  - [`app/api/market/search/route.ts` (Yahoo search request)](../app/api/market/search/route.ts#L20)
  - [`app/api/market/quotes/route.ts` (Yahoo quote request)](../app/api/market/quotes/route.ts#L32)
  - [`lib/market/logos.ts` (ticker normalization)](../lib/market/logos.ts#L22)

### 9) AI prediction generation API
- What it does: validates input, generates prediction through Gemini, and stores each prediction in MongoDB.
- Website page: intended for `/dashboard/predictions` backend integration
- Keywords: predictions API, Gemini, AI signal, prediction persistence
- Best entry file: [`app/api/predictions/route.ts` (prediction POST handler)](../app/api/predictions/route.ts#L13)
- Main code:
  - [`app/api/predictions/route.ts` (validate + persist)](../app/api/predictions/route.ts#L20)
  - [`lib/ai/gemini.ts` (prompt + parse)](../lib/ai/gemini.ts#L15)
  - [`lib/db/models/prediction.ts` (schema)](../lib/db/models/prediction.ts#L3)

### 10) Welcome email API
- What it does: builds welcome email template and sends it using SMTP transporter.
- Website page: triggered from `/auth/signup`
- Keywords: email API, welcome email, SMTP, mail transporter
- Best entry file: [`app/api/email/welcome/route.ts` (email POST handler)](../app/api/email/welcome/route.ts#L13)
- Main code:
  - [`app/api/email/welcome/route.ts` (validate + send)](../app/api/email/welcome/route.ts#L15)
  - [`lib/email/templates.ts` (template builder)](../lib/email/templates.ts#L1)
  - [`lib/email/transporter.ts` (SMTP transport)](../lib/email/transporter.ts#L5)

### 11) Inngest event/cron handler
- What it does: exposes Inngest route and registers background functions (welcome email event + quota reset cron skeleton).
- Website page: background/infrastructure feature (no direct UI page)
- Keywords: Inngest, background jobs, cron, event handler
- Best entry file: [`app/api/inngest/route.ts` (serve config)](../app/api/inngest/route.ts#L6)
- Main code:
  - [`app/api/inngest/route.ts` (registered functions)](../app/api/inngest/route.ts#L8)
  - [`lib/inngest/client.ts` (client init)](../lib/inngest/client.ts#L3)
  - [`lib/inngest/functions.ts` (function definitions)](../lib/inngest/functions.ts#L13)

# Quickstart: AI Analysis Router Pages

## What This Feature Does

Converts the AI Analysis module from a single inline-routed page (`/dashboard/ai-analysis`) into a set of nested routable sub-pages:

- `/dashboard/ai-analysis` or `/dashboard/ai-analysis/start` — start/intro screen with recommended analyses
- `/dashboard/ai-analysis/chat` — AI analysis chat workspace
- `/dashboard/ai-analysis/history` — list of past analysis sessions

Users can now bookmark, share, and refresh any AI analysis screen, and browser back/forward works as expected.

## How to Run

1. Install dependencies (if not already installed):

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the application and log in.

4. Navigate to any of the following URLs directly:

   - `http://localhost:5173/dashboard/ai-analysis`
   - `http://localhost:5173/dashboard/ai-analysis/start`
   - `http://localhost:5173/dashboard/ai-analysis/chat`
   - `http://localhost:5173/dashboard/ai-analysis/history`

## How to Test

### Manual Regression Checklist

1. **Direct URL access**
   - Open each route above and confirm the expected screen renders.
   - Confirm an unknown route such as `/dashboard/ai-analysis/unknown` redirects to `/dashboard/ai-analysis`.

2. **Browser navigation**
   - From `/dashboard/ai-analysis/start`, click a recommended analysis card and confirm the browser navigates to `/dashboard/ai-analysis/chat` and starts the analysis.
   - Click the browser back button and confirm you return to the previous page.
   - Refresh `/dashboard/ai-analysis/history` and confirm the same history list is shown.

3. **Chat workspace**
   - Start an analysis from the start page and confirm the chat workspace appears.
   - Send a follow-up question and confirm the assistant responds.
   - Click the close button on the active analysis and confirm you return to `/dashboard/ai-analysis/start`.

4. **History integration**
   - Go to `/dashboard/ai-analysis/history`.
   - Click "متابعة" on a completed analysis and confirm it opens in `/dashboard/ai-analysis/chat`.
   - Click "إعادة التشغيل" and confirm it starts a new session in `/dashboard/ai-analysis/chat`.
   - Click "تحليل جديد" and confirm it navigates to `/dashboard/ai-analysis/start`.

5. **Navigation highlighting**
   - For every route above, confirm the sidebar and mobile navigation highlight "المحلل التنفيذي الذكي".

6. **Build**
   - Run `npm run build` and confirm the production build completes without errors.

## Common Issues

- **Nested route not matching**: Ensure `routes.tsx` registers the nested `children` array under `path: 'ai-analysis'` with a catch-all `path: '*'` redirect.
- **Active nav not highlighting**: Ensure `DashboardLayout.tsx` maps any `location.pathname` starting with `/dashboard/ai-analysis` to `activeView === 'ai-analysis'`.
- **History state lost on refresh**: `continueAnalysisId`/`rerunAnalysisId` are passed through router `state`; if the chat page does not read them on mount, the session will not load.
- **Chat page renders empty on direct access**: When there is no active or loaded session, the chat page should fall back to the start empty-state or redirect to `/dashboard/ai-analysis/start`.

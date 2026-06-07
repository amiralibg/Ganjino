# Ganjino TODO

## Fixed Now (Main Problems)

- [x] Protect `POST /api/gold-history/store-today` and `POST /api/gold-history/seed` with auth + admin middleware
- [x] Remove insecure JWT secret fallback and fail fast when `JWT_SECRET` is missing
- [x] Normalize sign-in failure messages to avoid account enumeration
- [x] Prevent axios token refresh flow from running on auth endpoints (`signin`, `signup`, `refresh`, `logout`)
- [x] Add query validation/bounds in gold history controller (`days`, `limit`, date range)
- [x] Add query validation/bounds in savings logs + analytics controllers (`type`, `goalId`, `period`, dates, `limit`)
- [x] Add profile route validation for `monthlySavingsPercentage` (0-100)
- [x] Remove rewrite artifacts / dead style block comments from `savings` screen
- [x] Reduce goal enrichment N+1 calls by reusing profile and current gold price per request
- [x] Tighten backend CORS behavior with allowlist via `CORS_ORIGIN` (still permissive in local dev if unset)
- [x] Support `EXPO_PUBLIC_API_URL` / Expo `extra.apiUrl` override for mobile dev (physical device support)
- [x] De-duplicate auth failure listener registration during Fast Refresh
- [x] Align gold history source metadata/docs wording with BrsApi usage

## Next Fixes (Stability / Quality)

- [x] Add route-level validators (express-validator) for GET query params in `savings` and `gold-history` routes for consistent `400` responses and Swagger parity
- [x] Add centralized request logging + correlation IDs for backend debugging
- [x] Add rate limiting on auth endpoints (`signin`, `refresh`) and abuse-prone endpoints
- [x] Add structured environment validation (`MONGODB_URI`, `JWT_SECRET`, `GOLD_API_KEY`, `CORS_ORIGIN` in prod)
- [x] Add graceful shutdown (`SIGTERM`/`SIGINT`) to stop cron jobs and close DB connections cleanly
- [ ] Add tests for auth refresh rotation, sessions revoke/logout-all, and query validation edge cases
- [x] Add frontend error-state UX for offline/no-server mode (especially first launch and auth)

## Feature Roadmap (Prioritized)

### Phase 1 (Fast Wins - already partially supported)

- [x] Savings Analytics screen (use existing `/api/logs/analytics`)
- [x] Session Management UI in Profile (active devices, revoke session, logout all devices)
- [x] Gold Price History filters (7d / 30d / 90d / custom range)
- [x] Better onboarding/profile setup (salary + savings % on first auth)

### Phase 2 (High Value UX)

- [x] Push notifications for savings reminders and gold price alerts (MVP: device token + notification preferences saved in profile, in-app permission flow)
- [x] Offline-first savings log queue + sync when connection returns
- [x] Goal contribution allocation from each savings log (link savings to goals and reflect progress automatically)
- [x] Recurring savings plans / auto-reminder schedules per goal (MVP: recurring plan fields + UI on goal creation)

### Phase 3 (Insights / Power Features)

- [x] Create `ganjino-admin` web project (React + TypeScript) alongside backend/app with MVP dashboard wired to `/api/admin/*`
- [x] Add default seed script (`ganjino-backend npm run seed:default`) for super admin/admin + baseline demo data
- [x] Split admin access levels: `super_admin` (full control) vs `admin` (read/security insights)
- [ ] Forecasting and completion scenarios (best/base/worst case using price volatility)
- [ ] Goal strategy suggestions (cash vs gold mix based on user behavior)
- [ ] Admin dashboard v2: charts (growth, retention, suspicious activity trends), filter/sort persistence, and role-guarded actions
- [ ] Export/import data (CSV/JSON) for savings logs and goals
- [ ] Add admin audit log (who deactivated/promoted/exported what, and when)
- [ ] Add anomaly alerts (sudden failed logins, device churn spikes, high-risk sessions)
- [ ] Release readiness UX pass:
  - [ ] Empty/loading/error states consistency across app + admin
  - [ ] Accessibility pass (contrast, focus states, keyboard support, dynamic type)
  - [ ] Performance pass (query caching, list virtualization where needed, render profiling)
  - [ ] Internationalization readiness (EN/FA copy audit, RTL/LTR parity in all key screens)
- [ ] Release gates:
  - [ ] E2E smoke tests for auth, savings log flow, goals, and admin critical actions
  - [ ] API contract checks between mobile/admin clients and backend routes
  - [ ] Monitoring baseline (error rate, latency percentiles, notification failures)

## Notes

- Backend production config should set: `JWT_SECRET`, `MONGODB_URI`, `GOLD_API_KEY`, and `CORS_ORIGIN`.
- Mobile dev can now use `EXPO_PUBLIC_API_URL` (example: `http://192.168.x.x:3000/api`) for testing on a physical phone.

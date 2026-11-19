# M2.1 — Planner card overlap fix

- **Baseline:** Solace M2 UI & MedSpace update (existing project retained).
- **Root cause:** `.schedule-panel` inherited `position: sticky` for desktop; with a taller schedule, it could remain pinned over the next help card while scrolling.
- **Patch:** Override to `position: static` within the planner, ensuring both cards stay in normal flow; retain existing timeline and styling.
- **Regression:** New Playwright test generates four tasks and a commitment and checks no panel/help-card overlap while scrolling on a 1440px viewport.
- **Excluded:** No authentication added. Per-user account isolation remains M4.

## Verification
Run on Windows:

```powershell
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

No commit, deployment or remote changes made.

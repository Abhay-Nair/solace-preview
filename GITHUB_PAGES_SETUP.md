# Solace — GitHub Pages setup

The repository should contain **the contents of this `Solace` directory at its root**, including `package.json`, `src`, and `.github`.

Repository: `https://github.com/Abhay-Nair/solace-preview`

1. Review the code before uploading; do not commit secrets or personal data.
2. Publish the source to `main` with explicit approval. `node_modules`, `.env*`, `dist`, reports and test-results are ignored.
3. In GitHub: Settings → Pages → Build and deployment → Source: **GitHub Actions**.
4. Navigate to Actions and wait for `Publish Solace Preview` to succeed. If required, manually trigger with `Run workflow`.
5. The site URL is `https://abhay-nair.github.io/solace-preview/`.
6. Verify pages at `/#/planner`, `/#/medspace` and refresh. Hash routing is intentional for GitHub Pages.

The published website is **public**, has no individual user authentication, and stores guest data in browser-local IndexedDB. Do not use real personal, medical, or mood data for demonstrations. This is a non-clinical prototype; live AI is disabled.

Local dev stays at `http://127.0.0.1:5173/` with clean routes like `/planner`.

To produce the Pages build locally in PowerShell:

```powershell
$env:GITHUB_PAGES = 'true'
npm run build
Remove-Item Env:GITHUB_PAGES
```

No Git push, remote repository change, or deployment has been made by this package.

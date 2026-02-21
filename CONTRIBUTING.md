# Contributing to Cap2Cal

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repo and clone it
2. Follow the [Getting Started guide](./docs/GETTING-STARTED.md) to get the app running locally
3. Create a branch for your changes: `git checkout -b feat/your-feature`

## Development

```bash
# App (web preview)
cd app && npm install && npm run dev

# Backend (local emulator)
cd backend/functions && npm install && npm run serve

# Landing page
cd web && npm install && npm run dev
```

## Code Style

- **TypeScript** everywhere — no `any` types
- **TailwindCSS** for styling — no inline styles
- **Named exports** only — no default exports
- **i18n** — all UI text goes through i18next, never hardcode strings
- **Services** — components never call Firebase/Capacitor directly, use the service layer

## Commits

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add ticket search for new region
fix: calendar export missing end time
chore: update dependencies
refactor: extract camera logic into hook
```

## Pull Requests

1. Keep PRs focused — one feature or fix per PR
2. Make sure `npm run build` passes in `app/`, `backend/functions/`, and `web/`
3. Describe what changed and why in the PR description
4. Link related issues if applicable

## Project Structure

See the [Architecture docs](./docs/ARCHITECTURE.md) for how the codebase is organized.

## Questions?

Open an issue or start a discussion — happy to help.

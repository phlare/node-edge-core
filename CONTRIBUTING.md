# Contributing

This is an opinionated template maintained primarily by a single developer. It's open source for transparency and reuse, not specifically as a community-driven project.

## Branch strategy

- **`develop`** — active development branch. All feature branches should target `develop`.
- **`main`** — stable releases only. Only release candidate branches are merged to `main` via PR, and that will almost always be done by the maintainer.

## Bug reports

Issues are welcome. Please include steps to reproduce, expected vs actual behavior, and your Node version.

## Pull requests

Before opening a PR, please open an issue first to discuss the change. Unsolicited PRs for new features will likely be closed — this template is intentionally minimal.

If your PR addresses an existing issue:

1. Fork and branch from `develop`
2. Follow the conventions in `STYLE.md`
3. Ensure all checks pass: `npm run format:check && npm run lint && npm run typecheck && npm test`
4. Keep commits focused and atomic

## Not accepted

- Product-specific features (this is a generic template)
- Dependencies without clear justification
- Style/convention changes without prior discussion

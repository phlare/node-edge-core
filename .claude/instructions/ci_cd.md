# CI/CD

## CI

`.github/workflows/ci.yml` runs on every PR and on push to `main`. Single `test` job:

- Node via `.nvmrc` (`actions/setup-node@v6`, `cache: npm`)
- `npm install`
- `npm run format:check` (Prettier)
- `npm run lint` (ESLint 9 flat config + typescript-eslint)
- `npm run typecheck` (`tsc --noEmit`)
- `npm test` (Vitest)

## CD

No deploy job. This is a template — downstream product repos wire up their own CD.

## When forking this template into a product service

Append a `deploy` job to `ci.yml` gated on `needs: [test]` and a push-to-a-specific-branch condition. Typical shapes:

**Fly.io:**

```yaml
deploy:
  needs: [test]
  if: github.event_name == 'push' && github.ref == 'refs/heads/develop'
  runs-on: ubuntu-latest
  concurrency:
    group: deploy-staging
    cancel-in-progress: false
  steps:
    - uses: actions/checkout@v6
    - uses: superfly/flyctl-actions/setup-flyctl@master
    - run: flyctl deploy --remote-only
      env:
        FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

**Cloudflare Workers (e.g., for a Worker-flavoured fork):**

```yaml
deploy:
  needs: [test]
  if: github.event_name == 'push' && github.ref == 'refs/heads/develop'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v6
    - uses: actions/setup-node@v6
      with:
        node-version-file: ".nvmrc"
        cache: "npm"
    - run: npm install
    - uses: cloudflare/wrangler-action@v3
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        command: deploy
```

Use a `concurrency` group so overlapping deploys queue rather than race. Always have tests gate the deploy.

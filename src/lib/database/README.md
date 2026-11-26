# D1 database

The D1 binding is named `DB` in `wrangler.jsonc`. Schema changes belong in ordered SQL files under `migrations/`.

Apply migrations to the local Wrangler database with:

```sh
pnpm --filter @workspace/website-factory run db:migrate:local
```

This command uses `--local` and does not connect to a Cloudflare account or any other project's database. No database is provisioned or accessed automatically by the app.

---
name: stepstone-search
version: 1.0.0
description: >
  Use this skill whenever the user wants to search for jobs on StepStone, find
  job listings in European markets, or look up a specific job posting. StepStone
  is one of Europe's largest job boards with strong coverage in Germany, Austria,
  Switzerland, Belgium, and the Netherlands. Trigger phrases: find a job on
  stepstone, stepstone job search, search stepstone, stepstone jobs, job listings
  on stepstone, look up this stepstone job posting, european job search, german
  jobs, austrian jobs, swiss jobs.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/stepstone-search/cli/src/cli.ts *)
---

# StepStone Search Skill

Search live job listings from **StepStone** — one of Europe's largest job boards
with strong coverage across Germany, Austria, Switzerland, Belgium, the
Netherlands, and other European markets. No authentication required for public
job searches.

## ⚠️ Personal use only

This uses StepStone's public job pages; automated access may violate StepStone's
Terms of Service, so **keep volume low and don't use it commercially or for bulk
data collection.** Run it on your own responsibility.

## When to use this skill

- Search for job openings in European markets (Germany, Austria, Switzerland, etc.)
- Filter by recency (posted today / last 7 / 14 / 30 days)
- Get the full description of a specific job listing
- Search by salary range (where available)

## Commands

### Search job listings

```bash
bun run .agents/skills/stepstone-search/cli/src/cli.ts search --query "<keywords>" --location "<place>" [flags]
```

Key flags:
- `--query, -q <text>` — keyword search (title, skill, role). Recommended.
- `--location, -l <text>` — **required.** Location to search, e.g. `"Berlin, Germany"`, `"Munich, Germany"`, `"Vienna, Austria"`.
- `--jobage <days>` — posted within N days: `1`, `7`, `14`, `30`. Omit for all postings.
- `--page <n>` — page number (1-indexed).
- `--limit, -n <n>` — cap total results emitted (client-side).
- `--format json|table|plain` — default `json`.
- `--salary <amount>` — minimum salary filter (where available).
- `--contract <type>` — `permanent`, `temporary`, `freelance`, `apprenticeship`.

### Fetch full job detail

```bash
bun run .agents/skills/stepstone-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`id` is the job ID from `search` results. You may also pass a full
StepStone job URL. Returns the full description, company info, salary (if available),
and apply link.

## Usage examples

```bash
# Software engineer roles in Berlin, last 30 days
bun run .agents/skills/stepstone-search/cli/src/cli.ts search -q "software engineer" -l "Berlin, Germany" --jobage 30 --format table

# Data scientist roles in Munich
bun run .agents/skills/stepstone-search/cli/src/cli.ts search -q "data scientist" -l "Munich, Germany" --format table

# Marketing roles in Vienna with permanent contracts
bun run .agents/skills/stepstone-search/cli/src/cli.ts search -q "marketing" -l "Vienna, Austria" --contract permanent --format table

# Full details for a specific job
bun run .agents/skills/stepstone-search/cli/src/cli.ts detail 12345678 --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing IDs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- Data is from StepStone's public job pages — no credentials required.
- StepStone may rate-limit; the CLI retries 429/5xx with exponential backoff. Keep volume low (see ToS note above).
- Job IDs are numeric — pass them as-is to `detail`.
- Salary information is only available when employers include it in the listing.
- StepStone operates across multiple European countries with localized sites.

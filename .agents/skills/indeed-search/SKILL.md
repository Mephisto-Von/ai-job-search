---
name: indeed-search
version: 1.0.0
description: >
  Use this skill whenever the user wants to search for jobs on Indeed, find job
  listings, or look up a specific job posting. Indeed is one of the largest job
  boards globally with extensive coverage across industries and locations.
  Trigger phrases: find a job on indeed, indeed job search, search indeed,
  indeed jobs, job listings on indeed, look up this indeed job posting.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/indeed-search/cli/src/cli.ts *)
---

# Indeed Search Skill

Search live job listings from **Indeed** — one of the world's largest job boards
with comprehensive coverage across industries and locations. No authentication
required for public job searches.

## ⚠️ Personal use only

This uses Indeed's public job pages; automated access may violate Indeed's Terms
of Service, so **keep volume low and don't use it commercially or for bulk data
collection.** Run it on your own responsibility.

## When to use this skill

- Search for job openings in a given location (any country/city) or remotely
- Filter by recency (posted today / last 7 / 14 / 30 days)
- Get the full description of a specific job listing
- Search by salary range

## Commands

### Search job listings

```bash
bun run .agents/skills/indeed-search/cli/src/cli.ts search --query "<keywords>" --location "<place>" [flags]
```

Key flags:
- `--query, -q <text>` — keyword search (title, skill, role). Recommended.
- `--location, -l <text>` — **required.** Location to search, e.g. `"New York, NY"`, `"London, UK"`, or `"Remote"`.
- `--jobage <days>` — posted within N days: `1`, `7`, `14`, `30`. Omit for all postings.
- `--remote <mode>` — `remote`, `hybrid`, or `onsite` (workplace-type filter).
- `--page <n>` — page number (1-indexed).
- `--limit, -n <n>` — cap total results emitted (client-side).
- `--format json|table|plain` — default `json`.
- `--salary <amount>` — minimum salary filter (e.g. `--salary 50000`).
- `--jobtype <type>` — `fulltime`, `parttime`, `contract`, `internship`, `temporary`.

### Fetch full job detail

```bash
bun run .agents/skills/indeed-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`id` is the job ID from `search` results. You may also pass a full
Indeed `viewjob` URL. Returns the full description, company info, salary (if available),
and apply link.

## Usage examples

```bash
# Software engineer roles in New York, last 30 days
bun run .agents/skills/indeed-search/cli/src/cli.ts search -q "software engineer" -l "New York, NY" --jobage 30 --format table

# Remote data scientist roles
bun run .agents/skills/indeed-search/cli/src/cli.ts search -q "data scientist" -l "Remote" --remote remote --format table

# Full-time marketing roles in London
bun run .agents/skills/indeed-search/cli/src/cli.ts search -q "marketing" -l "London, UK" --jobtype fulltime --format table

# Full details for a specific job
bun run .agents/skills/indeed-search/cli/src/cli.ts detail 1234567890 --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing IDs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- Data is from Indeed's public job pages — no credentials required.
- Indeed may rate-limit; the CLI retries 429/5xx with exponential backoff. Keep volume low (see ToS note above).
- Job IDs are numeric — pass them as-is to `detail`.
- Salary information is only available when employers include it in the listing.

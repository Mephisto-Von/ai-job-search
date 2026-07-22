---
name: pakistan-search
version: 1.0.0
description: >
  Use this skill whenever the user wants to search for jobs in Pakistan, find
  Pakistani job listings, or look up a specific job posting. This skill covers
  major Pakistani job portals including Rozee.pk, Mustakbil.com, and Indeed
  Pakistan. Trigger phrases: find a job in pakistan, pakistan job search,
  search pakistani jobs, jobs in karachi, jobs in lahore, jobs in islamabad,
  rozee.pk jobs, mustakbil jobs, pakistani job listings, work in pakistan.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/pakistan-search/cli/src/cli.ts *)
---

# Pakistan Job Search Skill

Search live job listings from **Pakistan's** major job portals — including
Rozee.pk, Mustakbil.com, and Indeed Pakistan. No authentication required for
public job searches.

## ⚠️ Personal use only

This uses public job pages from Pakistani job portals; automated access may
violate their Terms of Service, so **keep volume low and don't use it
commercially or for bulk data collection.** Run it on your own responsibility.

## When to use this skill

- Search for job openings in Pakistani cities (Karachi, Lahore, Islamabad, etc.)
- Filter by recency (posted today / last 7 / 14 / 30 days)
- Get the full description of a specific job listing
- Search by salary range (where available)
- Search by industry or job type

## Commands

### Search job listings

```bash
bun run .agents/skills/pakistan-search/cli/src/cli.ts search --query "<keywords>" --location "<place>" [flags]
```

Key flags:
- `--query, -q <text>` — keyword search (title, skill, role). Recommended.
- `--location, -l <text>` — **required.** Location to search, e.g. `"Karachi"`, `"Lahore"`, `"Islamabad"`, `"Rawalpindi"`.
- `--jobage <days>` — posted within N days: `1`, `7`, `14`, `30`. Omit for all postings.
- `--page <n>` — page number (1-indexed).
- `--limit, -n <n>` — cap total results emitted (client-side).
- `--format json|table|plain` — default `json`.
- `--salary <amount>` — minimum salary filter (PKR, where available).
- `--jobtype <type>` — `fulltime`, `parttime`, `contract`, `internship`, `freelance`.
- `--source <portal>` — `rozee`, `mustakbil`, `indeed`, `all` (default: `all`).

### Fetch full job detail

```bash
bun run .agents/skills/pakistan-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`id` is the job ID from `search` results. You may also pass a full
job posting URL. Returns the full description, company info, salary (if available),
and apply link.

### Search by company

```bash
bun run .agents/skills/pakistan-search/cli/src/cli.ts company "<company-name>" [--location "<place>"]
```

Search for jobs at a specific company in Pakistan.

## Usage examples

```bash
# Software engineer roles in Karachi, last 30 days
bun run .agents/skills/pakistan-search/cli/src/cli.ts search -q "software engineer" -l "Karachi" --jobage 30 --format table

# Marketing roles in Lahore
bun run .agents/skills/pakistan-search/cli/src/cli.ts search -q "marketing manager" -l "Lahore" --format table

# Remote jobs from Pakistani portals
bun run .agents/skills/pakistan-search/cli/src/cli.ts search -q "remote" -l "Pakistan" --format table

# IT jobs in Islamabad with salary filter
bun run .agents/skills/pakistan-search/cli/src/cli.ts search -q "IT" -l "Islamabad" --salary 100000 --format table

# Jobs at a specific company
bun run .agents/skills/pakistan-search/cli/src/cli.ts company "Jazz" --location "Karachi" --format table

# Full details for a specific job
bun run .agents/skills/pakistan-search/cli/src/cli.ts detail 12345 --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing IDs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Major Portals Covered

| Portal | URL | Coverage |
|--------|-----|----------|
| **Rozee.pk** | rozee.pk | Largest Pakistani job portal |
| **Mustakbil.com** | mustakbil.com | Major job board |
| **Indeed Pakistan** | pk.indeed.com | Global portal, local listings |
| **LinkedIn** | linkedin.com | Professional network |

## Notes

- Data is from public job pages — no credentials required.
- Pakistani portals may rate-limit; the CLI retries 429/5xx with exponential backoff.
- Job IDs are portal-specific — pass them as-is to `detail`.
- Salary information is in PKR (Pakistani Rupees) when available.
- Major cities: Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan.

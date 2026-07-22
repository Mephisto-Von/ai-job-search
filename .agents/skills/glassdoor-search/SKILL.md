---
name: glassdoor-search
version: 1.0.0
description: >
  Use this skill whenever the user wants to search for jobs on Glassdoor, find
  job listings with company reviews and salary data, or look up a specific job
  posting. Glassdoor provides unique insights into company culture, salaries,
  and employee reviews alongside job listings. Trigger phrases: find a job on
  glassdoor, glassdoor job search, search glassdoor, glassdoor jobs, job
  listings on glassdoor, look up this glassdoor job posting, company reviews,
  salary data.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/glassdoor-search/cli/src/cli.ts *)
---

# Glassdoor Search Skill

Search live job listings from **Glassdoor** — a platform that combines job
listings with company reviews, salary data, and interview insights. No
authentication required for public job searches.

## ⚠️ Personal use only

This uses Glassdoor's public job pages; automated access may violate Glassdoor's
Terms of Service, so **keep volume low and don't use it commercially or for bulk
data collection.** Run it on your own responsibility.

## When to use this skill

- Search for job openings with company review context
- Filter by company ratings (e.g., only 4+ star companies)
- Get salary information alongside job listings
- Research company culture before applying
- Get the full description of a specific job listing

## Commands

### Search job listings

```bash
bun run .agents/skills/glassdoor-search/cli/src/cli.ts search --query "<keywords>" --location "<place>" [flags]
```

Key flags:
- `--query, -q <text>` — keyword search (title, skill, role). Recommended.
- `--location, -l <text>` — **required.** Location to search, e.g. `"New York, NY"`, `"London, UK"`, or `"Remote"`.
- `--jobage <days>` — posted within N days: `1`, `7`, `14`, `30`. Omit for all postings.
- `--remote <mode>` — `remote`, `hybrid`, or `onsite` (workplace-type filter).
- `--page <n>` — page number (1-indexed).
- `--limit, -n <n>` — cap total results emitted (client-side).
- `--format json|table|plain` — default `json`.
- `--minrating <rating>` — minimum company rating (1-5).
- `--minsalary <amount>` — minimum salary filter.

### Fetch full job detail

```bash
bun run .agents/skills/glassdoor-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`id` is the job ID from `search` results. You may also pass a full
Glassdoor `job-listing` URL. Returns the full description, company info,
salary (if available), ratings, and apply link.

### Company reviews

```bash
bun run .agents/skills/glassdoor-search/cli/src/cli.ts reviews <company-name> [--format json|plain]
```

Get company reviews and ratings for a specific company.

## Usage examples

```bash
# Software engineer roles in New York with 4+ star companies
bun run .agents/skills/glassdoor-search/cli/src/cli.ts search -q "software engineer" -l "New York, NY" --minrating 4 --format table

# Remote data scientist roles
bun run .agents/skills/glassdoor-search/cli/src/cli.ts search -q "data scientist" -l "Remote" --remote remote --format table

# Marketing roles in London with salary data
bun run .agents/skills/glassdoor-search/cli/src/cli.ts search -q "marketing" -l "London, UK" --minsalary 50000 --format table

# Full details for a specific job
bun run .agents/skills/glassdoor-search/cli/src/cli.ts detail 1234567890 --format plain

# Company reviews for Google
bun run .agents/skills/glassdoor-search/cli/src/cli.ts reviews "Google" --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing IDs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- Data is from Glassdoor's public job pages — no credentials required.
- Glassdoor may rate-limit; the CLI retries 429/5xx with exponential backoff. Keep volume low (see ToS note above).
- Job IDs are numeric — pass them as-is to `detail`.
- Salary information is only available when employers include it in the listing.
- Company ratings and reviews are a unique value proposition of Glassdoor.

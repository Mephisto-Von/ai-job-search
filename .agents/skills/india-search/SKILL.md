---
name: india-search
version: 1.0.0
description: >
  Use this skill whenever the user wants to search for jobs in India, find
  Indian job listings, or look up a specific job posting. This skill covers
  major Indian job portals including Naukri.com, Indeed India, Monster India,
  and LinkedIn. Trigger phrases: find a job in india, india job search,
  search indian jobs, jobs in mumbai, jobs in bangalore, jobs in delhi,
  naukri.com jobs, indeed india jobs, indian job listings, work in india,
  bangalore jobs, hyderabad jobs, chennai jobs, pune jobs.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/india-search/cli/src/cli.ts *)
---

# India Job Search Skill

Search live job listings from **India's** major job portals — including
Naukri.com, Indeed India, Monster India, and LinkedIn. No authentication
required for public job searches.

## ⚠️ Personal use only

This uses public job pages from Indian job portals; automated access may
violate their Terms of Service, so **keep volume low and don't use it
commercially or for bulk data collection.** Run it on your own responsibility.

## When to use this skill

- Search for job openings in Indian cities (Mumbai, Bangalore, Delhi, etc.)
- Filter by recency (posted today / last 7 / 14 / 30 days)
- Get the full description of a specific job listing
- Search by salary range (where available)
- Search by industry or job type
- Search for remote jobs in India

## Commands

### Search job listings

```bash
bun run .agents/skills/india-search/cli/src/cli.ts search --query "<keywords>" --location "<place>" [flags]
```

Key flags:
- `--query, -q <text>` — keyword search (title, skill, role). Recommended.
- `--location, -l <text>` — **required.** Location to search, e.g. `"Mumbai"`, `"Bangalore"`, `"Delhi NCR"`, `"Hyderabad"`, `"Chennai"`, `"Pune"`.
- `--jobage <days>` — posted within N days: `1`, `7`, `14`, `30`. Omit for all postings.
- `--page <n>` — page number (1-indexed).
- `--limit, -n <n>` — cap total results emitted (client-side).
- `--format json|table|plain` — default `json`.
- `--salary <amount>` — minimum salary filter (INR, where available).
- `--jobtype <type>` — `fulltime`, `parttime`, `contract`, `internship`, `freelance`.
- `--experience <years>` — filter by experience level.
- `--source <portal>` — `naukri`, `indeed`, `monster`, `linkedin`, `all` (default: `all`).

### Fetch full job detail

```bash
bun run .agents/skills/india-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`id` is the job ID from `search` results. You may also pass a full
job posting URL. Returns the full description, company info, salary (if available),
and apply link.

### Search by company

```bash
bun run .agents/skills/india-search/cli/src/cli.ts company "<company-name>" [--location "<place>"]
```

Search for jobs at a specific company in India.

## Usage examples

```bash
# Software engineer roles in Bangalore, last 30 days
bun run .agents/skills/india-search/cli/src/cli.ts search -q "software engineer" -l "Bangalore" --jobage 30 --format table

# Data scientist roles in Mumbai
bun run .agents/skills/india-search/cli/src/cli.ts search -q "data scientist" -l "Mumbai" --format table

# Remote jobs from Indian portals
bun run .agents/skills/india-search/cli/src/cli.ts search -q "remote" -l "India" --format table

# IT jobs in Hyderabad with salary filter
bun run .agents/skills/india-search/cli/src/cli.ts search -q "IT" -l "Hyderabad" --salary 1000000 --format table

# Marketing roles in Delhi NCR
bun run .agents/skills/india-search/cli/src/cli.ts search -q "marketing manager" -l "Delhi NCR" --format table

# Jobs at a specific company
bun run .agents/skills/india-search/cli/src/cli.ts company "TCS" --location "Bangalore" --format table

# Full details for a specific job
bun run .agents/skills/india-search/cli/src/cli.ts detail naukri-12345 --format plain
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
| **Naukri.com** | naukri.com | India's largest job portal |
| **Indeed India** | in.indeed.com | Global portal, local listings |
| **Monster India** | monsterindia.com | Major job board |
| **LinkedIn** | linkedin.com | Professional network |

## Indian IT Hubs

| City | Known For |
|------|-----------|
| **Bangalore** | IT, Startups, Product companies |
| **Mumbai** | Finance, Media, Entertainment |
| **Delhi NCR** | Corporate, Government, Consulting |
| **Hyderabad** | IT Services, Pharma, Biotech |
| **Chennai** | Manufacturing, IT Services |
| **Pune** | IT, Automotive, Education |
| **Kolkata** | Finance, Steel, Jute |
| **Ahmedabad** | Textiles, Chemicals, IT |

## Notes

- Data is from public job pages — no credentials required.
- Indian portals may rate-limit; the CLI retries 429/5xx with exponential backoff.
- Job IDs are portal-specific — pass them as-is to `detail`.
- Salary information is in INR (Indian Rupees) when available.
- Major cities: Mumbai, Bangalore, Delhi NCR, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad.
- For fresher jobs, add `--experience 0` or search for "fresher" or "entry level".

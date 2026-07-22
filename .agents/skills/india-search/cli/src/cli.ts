#!/usr/bin/env bun
// Self-contained CLI for searching jobs on Indian job portals.
// No external CLI framework, so it runs anywhere `bun` is available
// with zero install beyond the repo clone.
//
// Personal use only. This reads public job pages; automated access is
// against Terms of Service, so keep volume low and do not use it
// commercially or for bulk data collection. Run it on your own responsibility.

import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"
import { runCompany, type CompanyOpts } from "./commands/company.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", l: "location", n: "limit" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true
      } else {
        flags[key] = next
        i++
      }
    } else {
      ;(flags._ as string[]).push(a)
    }
  }
  return flags
}

const HELP = `india-cli — search jobs on Indian job portals (Naukri.com, Indeed India, Monster India)

USAGE
  bun run src/cli.ts search --query "<keywords>" --location "<place>" [flags]
  bun run src/cli.ts detail <id|url> [--format json|plain]
  bun run src/cli.ts company "<company-name>" [--location "<place>"]

SEARCH FLAGS
  --query, -q <text>      Keywords (job title, skill, or role). Recommended.
  --location, -l <text>   Location to search. REQUIRED. e.g. "Mumbai", "Bangalore",
                          "Delhi NCR", "Hyderabad", "Chennai", "Pune".
  --jobage <days>         Posted within N days: 1, 7, 14, 30. Default: all.
  --page <n>              1-indexed page. Default 1.
  --limit, -n <n>         Cap results emitted (client-side).
  --salary <amount>       Minimum salary filter (INR).
  --jobtype <type>        fulltime | parttime | contract | internship | freelance.
  --experience <years>    Filter by experience level.
  --source <portal>       naukri | indeed | monster | linkedin | all (default: all).
  --format <fmt>          json (default) | table | plain.

COMPANY FLAGS
  --location, -l <text>   Filter by location (optional).

EXAMPLES
  bun run src/cli.ts search -q "software engineer" -l "Bangalore" --jobage 30 --format table
  bun run src/cli.ts search -q "data scientist" -l "Mumbai" --format table
  bun run src/cli.ts search -q "remote" -l "India" --format table
  bun run src/cli.ts company "TCS" --location "Bangalore" --format table
  bun run src/cli.ts detail naukri-12345 --format plain

Personal use only — uses Indian job portals' public pages; keep volume low.
`

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = (flags._ as string[])[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  if (cmd === "search") {
    const location = typeof flags.location === "string" ? flags.location : undefined
    if (!location) {
      process.stderr.write(
        JSON.stringify({
          error: 'the --location/-l flag is required (e.g. -l "Mumbai", -l "Bangalore", -l "Delhi NCR")',
          code: "NO_LOCATION",
        }) + "\n",
      )
      return 1
    }
    const fmt = (flags.format as string) || "json"

    const parseIntFlag = (name: string, raw: string | boolean | string[]): number | null => {
      const val = parseInt(raw as string, 10)
      if (isNaN(val)) {
        process.stderr.write(JSON.stringify({ error: `--${name} must be a number, got "${raw}"`, code: "BAD_ARG" }) + "\n")
        return null
      }
      return val
    }

    if (flags.jobage !== undefined) {
      const v = parseIntFlag("jobage", flags.jobage)
      if (v === null) return 1
      flags.jobage = String(v)
    }
    if (flags.page !== undefined) {
      const v = parseIntFlag("page", flags.page)
      if (v === null) return 1
      flags.page = String(v)
    }
    if (flags.limit !== undefined) {
      const v = parseIntFlag("limit", flags.limit)
      if (v === null) return 1
      flags.limit = String(v)
    }
    if (flags.salary !== undefined) {
      const v = parseIntFlag("salary", flags.salary)
      if (v === null) return 1
      flags.salary = String(v)
    }

    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      location,
      jobage: flags.jobage ? parseInt(flags.jobage as string, 10) : 9999,
      page: flags.page ? Math.max(1, parseInt(flags.page as string, 10)) : 1,
      limit: flags.limit ? parseInt(flags.limit as string, 10) : undefined,
      salary: flags.salary ? parseInt(flags.salary as string, 10) : undefined,
      jobtype: typeof flags.jobtype === "string" ? flags.jobtype : undefined,
      experience: typeof flags.experience === "string" ? flags.experience : undefined,
      source: typeof flags.source === "string" ? flags.source : undefined,
      format: (["json", "table", "plain"].includes(fmt) ? fmt : "json") as SearchOpts["format"],
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const id = (flags._ as string[])[1]
    if (!id) {
      process.stderr.write(JSON.stringify({ error: "detail requires an <id|url>", code: "NO_ID" }) + "\n")
      return 1
    }
    const fmt = (flags.format as string) || "json"
    const opts: DetailOpts = {
      id,
      format: (fmt === "plain" ? "plain" : "json") as DetailOpts["format"],
    }
    return runDetail(opts)
  }

  if (cmd === "company") {
    const company = (flags._ as string[])[1]
    if (!company) {
      process.stderr.write(JSON.stringify({ error: "company requires a <company-name>", code: "NO_COMPANY" }) + "\n")
      return 1
    }
    const fmt = (flags.format as string) || "json"
    const opts: CompanyOpts = {
      company,
      location: typeof flags.location === "string" ? flags.location : undefined,
      format: (["json", "table", "plain"].includes(fmt) ? fmt : "json") as CompanyOpts["format"],
    }
    return runCompany(opts)
  }

  process.stderr.write(JSON.stringify({ error: `Unknown command "${cmd}"`, code: "BAD_CMD" }) + "\n")
  return 1
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    process.stderr.write(
      JSON.stringify({
        error: e instanceof Error ? e.message : String(e),
        code: "INTERNAL_ERROR",
      }) + "\n",
    )
    process.exit(1)
  })

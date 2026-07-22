import {
  NAUKRI_URL,
  INDEED_IN_URL,
  MONSTER_URL,
  htmlFetch,
  parseNaukriCards,
  parseIndeedINCards,
  parseMonsterCards,
  normalizeLocation,
  writeError,
  type JobCard,
} from "../helpers.js"

export interface SearchOpts {
  query?: string
  location: string
  jobage: number
  page: number
  limit?: number
  salary?: number
  jobtype?: string
  experience?: string
  source?: string
  format: "json" | "table" | "plain"
}

function buildNaukriUrl(opts: SearchOpts): string {
  const params = new URLSearchParams()
  if (opts.query) params.set("q", opts.query)
  if (opts.location) params.set("l", opts.location)
  return `${NAUKRI_URL}?${params.toString()}`
}

function buildIndeedINUrl(opts: SearchOpts): string {
  const params = new URLSearchParams()
  if (opts.query) params.set("q", opts.query)
  if (opts.location) params.set("l", opts.location)
  if (opts.jobage) params.set("fromage", String(opts.jobage))
  return `${INDEED_IN_URL}?${params.toString()}`
}

function buildMonsterUrl(opts: SearchOpts): string {
  const params = new URLSearchParams()
  if (opts.query) params.set("q", opts.query)
  if (opts.location) params.set("location", opts.location)
  return `${MONSTER_URL}?${params.toString()}`
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 40).padEnd(40)
    const company = (c.company || "—").slice(0, 24).padEnd(24)
    const loc = (c.location || "—").slice(0, 20).padEnd(20)
    const exp = (c.experience || "—").slice(0, 12).padEnd(12)
    const source = (c.source || "").slice(0, 10).padEnd(10)
    return `${c.id.slice(0, 16).padEnd(16)} ${title} ${company} ${loc} ${exp} ${source}`
  })
  const header =
    "ID".padEnd(16) +
    " " +
    "TITLE".padEnd(40) +
    " " +
    "COMPANY".padEnd(24) +
    " " +
    "LOCATION".padEnd(20) +
    " EXPERIENCE" +
    " SOURCE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const location = normalizeLocation(opts.location)
    const source = opts.source || "all"
    let allCards: JobCard[] = []

    // Fetch from selected sources
    if (source === "all" || source === "naukri") {
      try {
        const naukriHtml = await htmlFetch(buildNaukriUrl({ ...opts, location }))
        const naukriCards = parseNaukriCards(naukriHtml)
        allCards = allCards.concat(naukriCards)
      } catch (e) {
        // Continue with other sources
      }
    }

    if (source === "all" || source === "indeed") {
      try {
        const indeedHtml = await htmlFetch(buildIndeedINUrl({ ...opts, location }))
        const indeedCards = parseIndeedINCards(indeedHtml)
        allCards = allCards.concat(indeedCards)
      } catch (e) {
        // Continue with other sources
      }
    }

    if (source === "all" || source === "monster") {
      try {
        const monsterHtml = await htmlFetch(buildMonsterUrl({ ...opts, location }))
        const monsterCards = parseMonsterCards(monsterHtml)
        allCards = allCards.concat(monsterCards)
      } catch (e) {
        // Continue with other sources
      }
    }

    // Apply limit
    if (opts.limit !== undefined && opts.limit >= 0) {
      allCards = allCards.slice(0, opts.limit)
    }

    if (opts.format === "table") {
      process.stdout.write(renderTable(allCards) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        allCards
          .map(
            (c) =>
              `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.experience || "—"} · ${c.source}${c.salary ? ` · ${c.salary}` : ""}\n  id: ${c.id}\n  ${c.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          { meta: { count: allCards.length, page: opts.page, sources: source }, results: allCards },
          null,
          2,
        ) + "\n",
      )
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}

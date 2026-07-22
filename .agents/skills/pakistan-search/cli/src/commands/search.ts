import {
  ROZEE_URL,
  MUSTAKBIL_URL,
  INDEED_PK_URL,
  htmlFetch,
  parseRozeeCards,
  parseMustakbilCards,
  parseIndeedPKCards,
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
  source?: string
  format: "json" | "table" | "plain"
}

function buildRozeeUrl(opts: SearchOpts): string {
  const params = new URLSearchParams()
  if (opts.query) params.set("q", opts.query)
  if (opts.location) params.set("l", opts.location)
  if (opts.jobage) params.set("age", String(opts.jobage))
  return `${ROZEE_URL}?${params.toString()}`
}

function buildMustakbilUrl(opts: SearchOpts): string {
  const params = new URLSearchParams()
  if (opts.query) params.set("q", opts.query)
  if (opts.location) params.set("location", opts.location)
  return `${MUSTAKBIL_URL}?${params.toString()}`
}

function buildIndeedPKUrl(opts: SearchOpts): string {
  const params = new URLSearchParams()
  if (opts.query) params.set("q", opts.query)
  if (opts.location) params.set("l", opts.location)
  if (opts.jobage) params.set("fromage", String(opts.jobage))
  return `${INDEED_PK_URL}?${params.toString()}`
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 40).padEnd(40)
    const company = (c.company || "—").slice(0, 24).padEnd(24)
    const loc = (c.location || "—").slice(0, 20).padEnd(20)
    const source = (c.source || "").slice(0, 10).padEnd(10)
    const salary = (c.salary || "—").slice(0, 16).padEnd(16)
    return `${c.id.slice(0, 14).padEnd(14)} ${title} ${company} ${loc} ${source} ${salary}`
  })
  const header =
    "ID".padEnd(14) +
    " " +
    "TITLE".padEnd(40) +
    " " +
    "COMPANY".padEnd(24) +
    " " +
    "LOCATION".padEnd(20) +
    " SOURCE" +
    " SALARY"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const location = normalizeLocation(opts.location)
    const source = opts.source || "all"
    let allCards: JobCard[] = []

    // Fetch from selected sources
    if (source === "all" || source === "rozee") {
      try {
        const rozeeHtml = await htmlFetch(buildRozeeUrl({ ...opts, location }))
        const rozeeCards = parseRozeeCards(rozeeHtml)
        allCards = allCards.concat(rozeeCards)
      } catch (e) {
        // Continue with other sources
      }
    }

    if (source === "all" || source === "mustakbil") {
      try {
        const mustakbilHtml = await htmlFetch(buildMustakbilUrl({ ...opts, location }))
        const mustakbilCards = parseMustakbilCards(mustakbilHtml)
        allCards = allCards.concat(mustakbilCards)
      } catch (e) {
        // Continue with other sources
      }
    }

    if (source === "all" || source === "indeed") {
      try {
        const indeedHtml = await htmlFetch(buildIndeedPKUrl({ ...opts, location }))
        const indeedCards = parseIndeedPKCards(indeedHtml)
        allCards = allCards.concat(indeedCards)
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
              `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.source}${c.salary ? ` · ${c.salary}` : ""}\n  id: ${c.id}\n  ${c.url}`,
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

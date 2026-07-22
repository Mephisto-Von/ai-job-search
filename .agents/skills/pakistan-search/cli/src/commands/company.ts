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

export interface CompanyOpts {
  company: string
  location?: string
  format: "json" | "table" | "plain"
}

function buildRozeeUrl(opts: CompanyOpts): string {
  const params = new URLSearchParams()
  params.set("q", opts.company)
  if (opts.location) params.set("l", opts.location)
  return `${ROZEE_URL}?${params.toString()}`
}

function buildMustakbilUrl(opts: CompanyOpts): string {
  const params = new URLSearchParams()
  params.set("q", opts.company)
  if (opts.location) params.set("location", opts.location)
  return `${MUSTAKBIL_URL}?${params.toString()}`
}

function buildIndeedPKUrl(opts: CompanyOpts): string {
  const params = new URLSearchParams()
  params.set("q", opts.company)
  if (opts.location) params.set("l", opts.location)
  return `${INDEED_PK_URL}?${params.toString()}`
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 40).padEnd(40)
    const company = (c.company || "—").slice(0, 24).padEnd(24)
    const loc = (c.location || "—").slice(0, 20).padEnd(20)
    const source = (c.source || "").slice(0, 10).padEnd(10)
    return `${c.id.slice(0, 14).padEnd(14)} ${title} ${company} ${loc} ${source}`
  })
  const header =
    "ID".padEnd(14) +
    " " +
    "TITLE".padEnd(40) +
    " " +
    "COMPANY".padEnd(24) +
    " " +
    "LOCATION".padEnd(20) +
    " SOURCE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runCompany(opts: CompanyOpts): Promise<number> {
  try {
    const location = opts.location ? normalizeLocation(opts.location) : undefined
    let allCards: JobCard[] = []

    // Fetch from all sources
    try {
      const rozeeHtml = await htmlFetch(buildRozeeUrl({ ...opts, location }))
      const rozeeCards = parseRozeeCards(rozeeHtml)
      allCards = allCards.concat(rozeeCards)
    } catch (e) {
      // Continue with other sources
    }

    try {
      const mustakbilHtml = await htmlFetch(buildMustakbilUrl({ ...opts, location }))
      const mustakbilCards = parseMustakbilCards(mustakbilHtml)
      allCards = allCards.concat(mustakbilCards)
    } catch (e) {
      // Continue with other sources
    }

    try {
      const indeedHtml = await htmlFetch(buildIndeedPKUrl({ ...opts, location }))
      const indeedCards = parseIndeedPKCards(indeedHtml)
      allCards = allCards.concat(indeedCards)
    } catch (e) {
      // Continue with other sources
    }

    if (opts.format === "table") {
      process.stdout.write(renderTable(allCards) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        allCards
          .map(
            (c) =>
              `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.source}\n  id: ${c.id}\n  ${c.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          { meta: { count: allCards.length, company: opts.company }, results: allCards },
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

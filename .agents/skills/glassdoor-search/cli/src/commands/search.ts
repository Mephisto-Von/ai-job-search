import {
  SEARCH_URL,
  htmlFetch,
  parseJobCards,
  writeError,
  type JobCard,
} from "../helpers.js"

export interface SearchOpts {
  query?: string
  location: string
  jobage: number
  remote?: string
  page: number
  limit?: number
  minrating?: number
  minsalary?: number
  format: "json" | "table" | "plain"
}

function buildUrl(opts: SearchOpts): string {
  const params = new URLSearchParams()
  if (opts.query) params.set("sc.keyword", opts.query)
  if (opts.location) params.set("locT", "")
  if (opts.location) params.set("locId", "")
  if (opts.location) params.set("locKeyword", opts.location)
  if (opts.remote) params.set("remoteWorkType", opts.remote)
  if (opts.minsalary) params.set("minSalary", String(opts.minsalary))
  if (opts.minrating) params.set("minRating", String(opts.minrating))
  
  const pageParam = opts.page > 1 ? `_IP${opts.page}.htm` : ""
  return `${SEARCH_URL}${pageParam}?${params.toString()}`
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 42).padEnd(42)
    const company = (c.company || "—").slice(0, 26).padEnd(26)
    const loc = (c.location || "—").slice(0, 24).padEnd(24)
    const rating = c.rating ? `${c.rating}`.slice(0, 4).padEnd(4) : "—".padEnd(4)
    const salary = (c.salary || "—").slice(0, 18).padEnd(18)
    return `${c.id.slice(0, 11).padEnd(11)} ${title} ${company} ${loc} ${rating} ${salary}`
  })
  const header =
    "ID".padEnd(11) +
    " " +
    "TITLE".padEnd(42) +
    " " +
    "COMPANY".padEnd(26) +
    " " +
    "LOCATION".padEnd(24) +
    " RATE" +
    " SALARY"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const html = await htmlFetch(buildUrl(opts))
    let cards = parseJobCards(html)
    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      process.stdout.write(renderTable(cards) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map(
            (c) =>
              `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.rating ? `Rating: ${c.rating}` : "—"}${c.salary ? ` · ${c.salary}` : ""}\n  id: ${c.id}\n  ${c.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          { meta: { count: cards.length, page: opts.page }, results: cards },
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

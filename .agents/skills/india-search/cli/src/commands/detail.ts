import { htmlFetch, parseJobDetail, writeError } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

function normalizeId(input: string): string | null {
  // Accept prefixed IDs (naukri-123, indeed-in-123, monster-123)
  const prefixed = input.match(/^(naukri|indeed-in|monster)-(\d+)$/)
  if (prefixed) return input

  // Accept a raw job ID
  const bare = input.match(/^\d{4,}$/)
  if (bare) return input

  // Accept URLs from Indian portals
  const naukriMatch = input.match(/naukri\.com[^\/]*\/jobs\/([^\/\?]+)/)
  if (naukriMatch) return `naukri-${naukriMatch[1]}`

  const indeedMatch = input.match(/indeed\.com\/viewjob\?[^\s]*jk=([^&\s]+)/)
  if (indeedMatch) return `indeed-in-${indeedMatch[1]}`

  const monsterMatch = input.match(/monsterindia\.com\/job\/(\d+)/)
  if (monsterMatch) return `monster-${monsterMatch[1]}`

  return null
}

function getSourceUrl(id: string): string | null {
  const prefixed = id.match(/^(naukri|indeed-in|monster)-(\d+)$/)
  if (!prefixed) return null

  const source = prefixed[1]
  const jobId = prefixed[2]

  switch (source) {
    case "naukri":
      return `https://www.naukri.com/job/${jobId}`
    case "indeed-in":
      return `https://in.indeed.com/viewjob?jk=${jobId}`
    case "monster":
      return `https://www.monsterindia.com/job/${jobId}`
    default:
      return null
  }
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const id = normalizeId(opts.id)
  if (!id) {
    writeError(`Could not parse a job ID from "${opts.id}"`, "BAD_ID")
    return 1
  }

  const url = getSourceUrl(id)
  if (!url) {
    writeError(`Could not determine source URL for "${id}"`, "BAD_SOURCE")
    return 1
  }

  const source = id.split("-")[0] || "unknown"

  try {
    const html = await htmlFetch(url)
    if (!html) {
      writeError("Job not found", "NOT_FOUND")
      return 1
    }
    const job = parseJobDetail(html, id, source)
    job.url = url

    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.company || "—"} · ${job.location || "—"}`,
        `Source: ${job.source}`,
        "",
        job.jobType ? `Type: ${job.jobType}` : "",
        job.salary ? `Salary: ${job.salary}` : "",
        job.experience ? `Experience: ${job.experience}` : "",
        job.education ? `Education: ${job.education}` : "",
        job.skills.length > 0 ? `Skills: ${job.skills.join(", ")}` : "",
        job.benefits.length > 0 ? `Benefits: ${job.benefits.join(", ")}` : "",
        "",
        job.description || "(no description)",
        "",
        `URL: ${job.url}`,
        job.applyUrl ? `Apply: ${job.applyUrl}` : "",
      ].filter((l) => l !== "")
      process.stdout.write(lines.join("\n") + "\n")
    } else {
      process.stdout.write(JSON.stringify(job, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}

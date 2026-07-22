import { DETAIL_URL, htmlFetch, parseJobDetail, writeError } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

function normalizeId(input: string): string | null {
  // Accept a raw job ID
  const bare = input.match(/^\d{6,}$/)
  if (bare) return input
  
  // Accept a Glassdoor job-listing URL
  const urlMatch = input.match(/job-listing\?id=([^&]+)/) || input.match(/viewjob\?jobListingId=([^&]+)/)
  if (urlMatch) return urlMatch[1]
  
  // Accept a URL with job ID in path
  const pathMatch = input.match(/\/job-listing\/(\d+)/)
  if (pathMatch) return pathMatch[1]
  
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const id = normalizeId(opts.id)
  if (!id) {
    writeError(`Could not parse a job ID from "${opts.id}"`, "BAD_ID")
    return 1
  }
  try {
    const html = await htmlFetch(`${DETAIL_URL}?jobListingId=${id}`)
    if (!html) {
      writeError("Job not found", "NOT_FOUND")
      return 1
    }
    const job = parseJobDetail(html, id)

    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.company || "—"} · ${job.location || "—"}`,
        "",
        job.jobType ? `Type: ${job.jobType}` : "",
        job.salary ? `Salary: ${job.salary}` : "",
        job.companyRating ? `Rating: ${job.companyRating}/5` : "",
        job.companyReviews ? `Reviews: ${job.companyReviews}` : "",
        job.ceoApproval !== null ? `CEO Approval: ${job.ceoApproval ? "Yes" : "No"}` : "",
        job.recommendToFriend ? `${job.recommendToFriend}% recommend to friend` : "",
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

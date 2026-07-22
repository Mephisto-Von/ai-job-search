import { REVIEWS_URL, htmlFetch, parseCompanyReviews, writeError } from "../helpers.js"

export interface ReviewsOpts {
  company: string
  format: "json" | "plain"
}

function buildUrl(company: string): string {
  const encoded = encodeURIComponent(company)
  return `${REVIEWS_URL}?employerId=${encoded}`
}

function normalizeCompany(input: string): string {
  // Accept a company name or URL
  const urlMatch = input.match(/glassdoor\.com\/Reviews\/([^\/\?]+)/)
  if (urlMatch) return decodeURIComponent(urlMatch[1])
  return input
}

export async function runReviews(opts: ReviewsOpts): Promise<number> {
  const company = normalizeCompany(opts.company)
  if (!company) {
    writeError("Company name is required", "NO_COMPANY")
    return 1
  }
  try {
    const html = await htmlFetch(buildUrl(company))
    if (!html) {
      writeError("Company not found or no reviews available", "NOT_FOUND")
      return 1
    }
    const reviews = parseCompanyReviews(html, company)

    if (opts.format === "plain") {
      const lines = [
        `Company: ${reviews.company}`,
        `Rating: ${reviews.rating || "N/A"}/5`,
        `Total Reviews: ${reviews.reviews || "N/A"}`,
        `CEO: ${reviews.ceoName || "N/A"}`,
        `CEO Approval: ${reviews.ceoApproval !== null ? (reviews.ceoApproval ? "Yes" : "No") : "N/A"}`,
        `Recommend to Friend: ${reviews.recommendToFriend ? `${reviews.recommendToFriend}%` : "N/A"}`,
        "",
        "Pros:",
        ...reviews.pros.slice(0, 5).map((p) => `  - ${p}`),
        "",
        "Cons:",
        ...reviews.cons.slice(0, 5).map((c) => `  - ${c}`),
      ].filter((l) => l !== "" || l === "")
      process.stdout.write(lines.join("\n") + "\n")
    } else {
      process.stdout.write(JSON.stringify(reviews, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "REVIEWS_FAILED")
    return 1
  }
}

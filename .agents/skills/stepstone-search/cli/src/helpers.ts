// Data source: StepStone public job pages. No authentication required.
// Search returns HTML job cards; detail returns a single job's HTML.
// We parse with regex similar to the other search skills.

export const SEARCH_URL = "https://www.stepstone.de/jobs"
export const DETAIL_URL = "https://www.stepstone.de/jobs/detail"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

/** Fetch HTML with exponential backoff on 429/5xx. Returns "" on a 404. */
export async function htmlFetch(url: string): Promise<string> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return ""
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return response.text()
  }
  throw new Error("Request failed after max retries")
}

export interface JobCard {
  id: string
  title: string
  company: string | null
  location: string | null
  date: string | null
  url: string
  salary: string | null
  snippet: string | null
}

export interface JobDetail extends JobCard {
  description: string | null
  jobType: string | null
  salary: string | null
  benefits: string[]
  applyUrl: string | null
  companyProfile: string | null
}

function numericEntity(cp: number): string {
  return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => numericEntity(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => numericEntity(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ")
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function clean(html: string): string {
  return decodeHtmlEntities(stripTags(html))
}

/**
 * Parse the search response: a list of job cards from StepStone's search results.
 */
export function parseJobCards(html: string): JobCard[] {
  const results: JobCard[] = []

  // StepStone uses various card structures
  const cardPatterns = [
    // Pattern 1: data-job-id attribute
    /<article[^>]*data-job-id="([^"]+)"[^>]*class="[^"]*job-element[^"]*"/gi,
    // Pattern 2: id="job-" prefix
    /<div[^>]*id="job_(\d+)"[^>]*>/gi,
    // Pattern 3: data-test attribute with job ID
    /<div[^>]*data-test="([^"]+)"[^>]*class="[^"]*job-listing[^"]*"/gi,
  ]

  for (const pattern of cardPatterns) {
    let match: RegExpExecArray | null
    while ((match = pattern.exec(html)) !== null) {
      const id = match[1]
      if (!id) continue

      // Extract surrounding context for this card
      const startIdx = Math.max(0, match.index - 500)
      const endIdx = Math.min(html.length, match.index + 2000)
      const cardHtml = html.slice(startIdx, endIdx)

      // Title
      const titleMatch = cardHtml.match(/class="[^"]*job-title[^"]*"[^>]*>([\s\S]*?)<\/a>/i) ||
                         cardHtml.match(/class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h[23]>/i)
      const title = titleMatch ? clean(titleMatch[1]) : null
      if (!title) continue

      // Company
      const companyMatch = cardHtml.match(/class="[^"]*company-name[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ||
                           cardHtml.match(/class="[^"]*employer[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const company = companyMatch ? clean(companyMatch[1]) : null

      // Location
      const locMatch = cardHtml.match(/class="[^"]*location[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ||
                       cardHtml.match(/class="[^"]*job-location[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const location = locMatch ? clean(locMatch[1]) : null

      // Date
      const dateMatch = cardHtml.match(/class="[^"]*date[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ||
                        cardHtml.match(/class="[^"]*job-date[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const date = dateMatch ? clean(dateMatch[1]) : null

      // Salary
      const salaryMatch = cardHtml.match(/class="[^"]*salary[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ||
                          cardHtml.match(/class="[^"]*job-salary[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const salary = salaryMatch ? clean(salaryMatch[1]) : null

      // Snippet
      const snippetMatch = cardHtml.match(/class="[^"]*snippet[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                           cardHtml.match(/class="[^"]*job-snippet[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
      const snippet = snippetMatch ? clean(snippetMatch[1]) : null

      // URL
      const urlMatch = cardHtml.match(/href="(\/job\/[^"]+)"/i) ||
                       cardHtml.match(/href="(https:\/\/www\.stepstone\.de\/jobs\/[^"]+)"/i)
      const url = urlMatch ? 
        (urlMatch[1].startsWith("http") ? urlMatch[1] : `https://www.stepstone.de${decodeHtmlEntities(urlMatch[1])}`) :
        `https://www.stepstone.de/jobs/${id}`

      results.push({
        id,
        title,
        company,
        location,
        date,
        url,
        salary,
        snippet,
      })
    }
    if (results.length > 0) break
  }

  return results
}

/** Parse the single-job detail page. */
export function parseJobDetail(html: string, id: string): JobDetail {
  // Title
  const titleMatch = html.match(/class="[^"]*job-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
                     html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const title = titleMatch ? clean(titleMatch[1]) : "(untitled)"

  // Company
  const companyMatch = html.match(/class="[^"]*company-name[^"]*"[^>]*>([\s\S]*?)<\/a>/i) ||
                       html.match(/class="[^"]*employer[^"]*"[^>]*>([\s\S]*?)<\/a>/i)
  const company = companyMatch ? clean(companyMatch[1]) : null

  // Location
  const locMatch = html.match(/class="[^"]*location[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                   html.match(/class="[^"]*job-location[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  const location = locMatch ? clean(locMatch[1]) : null

  // Description
  const descMatch = html.match(/class="[^"]*job-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                    html.match(/id="jobDescription"[^>]*>([\s\S]*?)<\/div>/i)
  let description: string | null = null
  if (descMatch) {
    const withBreaks = descMatch[1]
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<\/(p|li|ul|ol|div|h\d)>/gi, "\n")
    description = decodeHtmlEntities(stripTags(withBreaks)).replace(/\n{3,}/g, "\n\n").trim() || null
  }

  // Job type
  const jobTypeMatch = html.match(/class="[^"]*job-type[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
  const jobType = jobTypeMatch ? clean(jobTypeMatch[1]) : null

  // Salary
  const salaryMatch = html.match(/class="[^"]*salary[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
  const salary = salaryMatch ? clean(salaryMatch[1]) : null

  // Benefits
  const benefits: string[] = []
  const benefitsMatch = html.match(/class="[^"]*benefits[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  if (benefitsMatch) {
    const items = benefitsMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi)
    if (items) {
      for (const item of items) {
        const text = clean(item)
        if (text) benefits.push(text)
      }
    }
  }

  // Company profile
  const profileMatch = html.match(/class="[^"]*company-profile[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  const companyProfile = profileMatch ? clean(profileMatch[1]) : null

  // Apply URL
  const applyMatch = html.match(/class="[^"]*apply-button[^"]*"[^>]*href="([^"]+)"/i) ||
                     html.match(/id="applyButton"[^>]*href="([^"]+)"/i)
  const applyUrl = applyMatch ? decodeHtmlEntities(applyMatch[1]) : null

  return {
    id,
    title,
    company,
    location,
    date: null,
    url: `https://www.stepstone.de/jobs/${id}`,
    description,
    jobType,
    salary,
    benefits,
    applyUrl,
    companyProfile,
  }
}

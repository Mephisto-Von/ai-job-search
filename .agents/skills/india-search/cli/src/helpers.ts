// Data source: Indian job portals (Naukri.com, Indeed India, Monster India).
// No authentication required for public job searches.
// We parse HTML job cards with regex similar to other search skills.

export const NAUKRI_URL = "https://www.naukri.com/jobs-in-india"
export const INDEED_IN_URL = "https://in.indeed.com/jobs"
export const MONSTER_URL = "https://www.monsterindia.com/srp/results"

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
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
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
  source: string
  experience: string | null
  snippet: string | null
}

export interface JobDetail extends JobCard {
  description: string | null
  jobType: string | null
  salary: string | null
  experience: string | null
  education: string | null
  skills: string[]
  benefits: string[]
  applyUrl: string | null
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
 * Parse Naukri.com job cards from HTML.
 */
export function parseNaukriCards(html: string): JobCard[] {
  const results: JobCard[] = []

  const cardPatterns = [
    // Pattern 1: jobTuple class
    /<div[^>]*class="[^"]*jobTuple[^"]*"[^>]*data-id="([^"]+)"/gi,
    // Pattern 2: jobTuple with ID
    /<div[^>]*id="job-card-(\d+)"[^>]*class="[^"]*jobTuple[^"]*"/gi,
    // Pattern 3: article with job ID
    /<article[^>]*data-id="(\d+)"[^>]*class="[^"]*job[^"]*"/gi,
  ]

  for (const pattern of cardPatterns) {
    let match: RegExpExecArray | null
    while ((match = pattern.exec(html)) !== null) {
      const id = match[1]
      if (!id) continue

      const startIdx = Math.max(0, match.index - 500)
      const endIdx = Math.min(html.length, match.index + 2000)
      const cardHtml = html.slice(startIdx, endIdx)

      // Title
      const titleMatch = cardHtml.match(/class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/a>/i) ||
                         cardHtml.match(/class="[^"]*desig[^"]*"[^>]*>([\s\S]*?)<\/a>/i)
      const title = titleMatch ? clean(titleMatch[1]) : null
      if (!title) continue

      // Company
      const companyMatch = cardHtml.match(/class="[^"]*company[^"]*"[^>]*>([\s\S]*?)<\/a>/i) ||
                           cardHtml.match(/class="[^"]*subTitle[^"]*"[^>]*>([\s\S]*?)<\/a>/i)
      const company = companyMatch ? clean(companyMatch[1]) : null

      // Location
      const locMatch = cardHtml.match(/class="[^"]*location[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ||
                       cardHtml.match(/class="[^"]*area[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const location = locMatch ? clean(locMatch[1]) : null

      // Experience
      const expMatch = cardHtml.match(/class="[^"]*experience[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const experience = expMatch ? clean(expMatch[1]) : null

      // Salary
      const salaryMatch = cardHtml.match(/class="[^"]*salary[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const salary = salaryMatch ? clean(salaryMatch[1]) : null

      // Date
      const dateMatch = cardHtml.match(/class="[^"]*date[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const date = dateMatch ? clean(dateMatch[1]) : null

      // Snippet
      const snippetMatch = cardHtml.match(/class="[^"]*snippet[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
      const snippet = snippetMatch ? clean(snippetMatch[1]) : null

      // URL
      const urlMatch = cardHtml.match(/href="(https:\/\/www\.naukri\.com[^"]+)"/i)
      const url = urlMatch ? decodeHtmlEntities(urlMatch[1]) : `https://www.naukri.com/job/${id}`

      results.push({
        id: `naukri-${id}`,
        title,
        company,
        location,
        date,
        url,
        salary,
        source: "naukri",
        experience,
        snippet,
      })
    }
    if (results.length > 0) break
  }

  return results
}

/**
 * Parse Indeed India job cards from HTML.
 */
export function parseIndeedINCards(html: string): JobCard[] {
  const results: JobCard[] = []

  const cardPatterns = [
    /<div[^>]*data-jk="([^"]+)"[^>]*class="[^"]*job_seen_beacon[^"]*"/gi,
    /<div[^>]*id="job_(\d+)"[^>]*>/gi,
    /<div[^>]*data-jobkey="([^"]+)"[^>]*>/gi,
  ]

  for (const pattern of cardPatterns) {
    let match: RegExpExecArray | null
    while ((match = pattern.exec(html)) !== null) {
      const id = match[1]
      if (!id) continue

      const startIdx = Math.max(0, match.index - 500)
      const endIdx = Math.min(html.length, match.index + 2000)
      const cardHtml = html.slice(startIdx, endIdx)

      const titleMatch = cardHtml.match(/class="[^"]*jobTitle[^"]*"[^>]*>([\s\S]*?)<\/a>/i)
      const title = titleMatch ? clean(titleMatch[1]) : null
      if (!title) continue

      const companyMatch = cardHtml.match(/class="[^"]*companyName[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const company = companyMatch ? clean(companyMatch[1]) : null

      const locMatch = cardHtml.match(/class="[^"]*companyLocation[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const location = locMatch ? clean(locMatch[1]) : null

      const dateMatch = cardHtml.match(/class="[^"]*date[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const date = dateMatch ? clean(dateMatch[1]) : null

      const salaryMatch = cardHtml.match(/class="[^"]*salary[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const salary = salaryMatch ? clean(salaryMatch[1]) : null

      const snippetMatch = cardHtml.match(/class="[^"]*snippet[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
      const snippet = snippetMatch ? clean(snippetMatch[1]) : null

      const urlMatch = cardHtml.match(/href="(\/rc\/clk[^"]+)"/i)
      const url = urlMatch ? `https://in.indeed.com${decodeHtmlEntities(urlMatch[1])}` : `https://in.indeed.com/viewjob?jk=${id}`

      results.push({
        id: `indeed-in-${id}`,
        title,
        company,
        location,
        date,
        url,
        salary,
        source: "indeed-in",
        experience: null,
        snippet,
      })
    }
    if (results.length > 0) break
  }

  return results
}

/**
 * Parse Monster India job cards from HTML.
 */
export function parseMonsterCards(html: string): JobCard[] {
  const results: JobCard[] = []

  const cardPatterns = [
    /<div[^>]*class="[^"]*job-card[^"]*"[^>]*data-job-id="([^"]+)"/gi,
    /<div[^>]*id="job-card-(\d+)"[^>]*class="[^"]*job-card[^"]*"/gi,
    /<a[^>]*href="[^"]*\/job\/(\d+)[^"]*"[^>]*class="[^"]*job[^"]*"/gi,
  ]

  for (const pattern of cardPatterns) {
    let match: RegExpExecArray | null
    while ((match = pattern.exec(html)) !== null) {
      const id = match[1]
      if (!id) continue

      const startIdx = Math.max(0, match.index - 500)
      const endIdx = Math.min(html.length, match.index + 2000)
      const cardHtml = html.slice(startIdx, endIdx)

      const titleMatch = cardHtml.match(/class="[^"]*job-title[^"]*"[^>]*>([\s\S]*?)<\/a>/i) ||
                         cardHtml.match(/class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h[23]>/i)
      const title = titleMatch ? clean(titleMatch[1]) : null
      if (!title) continue

      const companyMatch = cardHtml.match(/class="[^"]*company[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const company = companyMatch ? clean(companyMatch[1]) : null

      const locMatch = cardHtml.match(/class="[^"]*location[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const location = locMatch ? clean(locMatch[1]) : null

      const dateMatch = cardHtml.match(/class="[^"]*date[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const date = dateMatch ? clean(dateMatch[1]) : null

      const salaryMatch = cardHtml.match(/class="[^"]*salary[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
      const salary = salaryMatch ? clean(salaryMatch[1]) : null

      const snippetMatch = cardHtml.match(/class="[^"]*snippet[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
      const snippet = snippetMatch ? clean(snippetMatch[1]) : null

      const urlMatch = cardHtml.match(/href="(https:\/\/www\.monsterindia\.com[^"]+)"/i)
      const url = urlMatch ? decodeHtmlEntities(urlMatch[1]) : `https://www.monsterindia.com/job/${id}`

      results.push({
        id: `monster-${id}`,
        title,
        company,
        location,
        date,
        url,
        salary,
        source: "monster",
        experience: null,
        snippet,
      })
    }
    if (results.length > 0) break
  }

  return results
}

/** Parse single-job detail page (generic). */
export function parseJobDetail(html: string, id: string, source: string): JobDetail {
  // Title
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const title = titleMatch ? clean(titleMatch[1]) : "(untitled)"

  // Company
  const companyMatch = html.match(/class="[^"]*company[^"]*"[^>]*>([\s\S]*?)<\/a>/i) ||
                       html.match(/class="[^"]*employer[^"]*"[^>]*>([\s\S]*?)<\/a>/i)
  const company = companyMatch ? clean(companyMatch[1]) : null

  // Location
  const locMatch = html.match(/class="[^"]*location[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
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

  // Experience
  const experienceMatch = html.match(/class="[^"]*experience[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
  const experience = experienceMatch ? clean(experienceMatch[1]) : null

  // Education
  const educationMatch = html.match(/class="[^"]*education[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
  const education = educationMatch ? clean(educationMatch[1]) : null

  // Skills
  const skills: string[] = []
  const skillsMatch = html.match(/class="[^"]*skills[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  if (skillsMatch) {
    const items = skillsMatch[1].match(/<span[^>]*>([\s\S]*?)<\/span>/gi)
    if (items) {
      for (const item of items) {
        const text = clean(item)
        if (text) skills.push(text)
      }
    }
  }

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

  // Apply URL
  const applyMatch = html.match(/class="[^"]*apply[^"]*"[^>]*href="([^"]+)"/i)
  const applyUrl = applyMatch ? decodeHtmlEntities(applyMatch[1]) : null

  return {
    id,
    title,
    company,
    location,
    date: null,
    url: "",
    salary,
    source,
    description,
    jobType,
    experience,
    education,
    skills,
    benefits,
    applyUrl,
  }
}

/** Major Indian cities for validation. */
export const INDIA_CITIES = [
  "Mumbai",
  "Bangalore",
  "Bengaluru",
  "Delhi",
  "Delhi NCR",
  "Noida",
  "Gurgaon",
  "Gurugram",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Coimbatore",
  "Kochi",
  "Indore",
  "Bhopal",
  "Nagpur",
  "Visakhapatnam",
  "Vizag",
  "Surat",
  "Thiruvananthapuram",
]

/** Validate and normalize location. */
export function normalizeLocation(location: string): string {
  const normalized = location.trim()
  // Check if it's a known city
  const knownCity = INDIA_CITIES.find(
    (city) => city.toLowerCase() === normalized.toLowerCase()
  )
  return knownCity || normalized
}

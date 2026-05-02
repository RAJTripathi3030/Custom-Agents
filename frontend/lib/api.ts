const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function healthCheck() {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      cache: "no-store",
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data
  } catch {
    return { status: "unavailable" }
  }
}

export async function scrapeAgent(tavilyKey: string, groqKey: string, siteUrl: string) {
  try {
    const response = await fetch(`${BASE_URL}/scrape`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tavily_api_key: tavilyKey,
        groq_api_key: groqKey,
        site_url: siteUrl
      })
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.result
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    throw new Error(`Scrape failed: ${message}`)
  }
}
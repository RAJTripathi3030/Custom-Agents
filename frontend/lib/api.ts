const BASE_URL = "http://localhost:8000"

export async function healthCheck() {
  const response = await fetch(`${BASE_URL}/health`)
  const data = await response.json()
  return data
}
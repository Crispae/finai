export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.tavilyKey}`
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Tavily API error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch data from Tavily'
    })
  }
}) 
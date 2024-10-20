import { $fetch } from 'ofetch'


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.API_BASE_URL
  const apiUrl = `${apiBaseUrl}/property/content`
  // https://project-technical-test-api.up.railway.app/property/content
  // Get the id from the query parameters
  const query = getQuery(event)
  const { id, include } = query

  const params = {
    id: id,
    include: include
  }

  try {
    const response = await $fetch(apiUrl, {
      method: 'GET',
      params: params
    })

    return response
  } catch (error) {
    console.error('Error fetching property data:', error)
    return { error: 'Failed to fetch property data' }
  }
})

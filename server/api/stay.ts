import { $fetch } from 'ofetch'


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.API_BASE_URL
  const apiUrl = `${apiBaseUrl}/stay/availability/`
  // https://project-technical-test-api.up.railway.app/stay/availability/{property_id}
  // Get the id from the query parameters
  const query = getQuery(event)
  const { property_id, checkin, checkout, guest_per_room, number_of_room } = query

  const params = {
    checkin: checkin,
    checkout: checkout,
    guest_per_room: guest_per_room,
    number_of_room: number_of_room,
  }

  try {
    const response = await $fetch(apiUrl+property_id, {
      method: 'GET',
      params: params
    })

    return response
  } catch (error) {
    console.error('Error fetching property data:', error)
    return { error: 'Failed to fetch property data' }
  }
})

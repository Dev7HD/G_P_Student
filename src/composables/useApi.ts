import { createFetch } from '@vueuse/core'
import { destr } from 'destr'

export const useApi = createFetch({
 baseUrl: import.meta.env.VITE_SPRING_BOOT_API_URL  ,
  fetchOptions: {
    headers: {
      Accept: '*',
    },
 
  },
  options: {
    refetch: false,
    async beforeFetch({ options }) {
      const accessToken = useCookie('accessToken').value

      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,

        }
      }

      return { options }
    },
    afterFetch(ctx) {
      const { data, response } = ctx

      // Parse data if it's JSON

      let parsedData = null
      try {
        parsedData = destr(data)
      }
      catch (error) {
        console.error(error)
      }

      return { data: parsedData, response }
    },
  },
})

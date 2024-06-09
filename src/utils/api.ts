import { ofetch } from 'ofetch';

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_SPRING_BOOT_API_URL,
  async onRequest({ options }) {
    // const accessToken = useCookie('accessToken').value
     options.headers = {
        ...options.headers,
        // Authorization: `Bearer ${accessToken}`,

      }
    // if (accessToken) {
    //   options.headers = {
    //     ...options.headers,
    //     // Authorization: `Bearer ${accessToken}`,

    //   }
    // }
  },
})

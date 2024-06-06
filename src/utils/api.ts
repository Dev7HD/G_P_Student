import { ofetch } from 'ofetch';

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    console.log(accessToken);
    
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,

      }
    }
  },
})

import axios from "axios";

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const axiosIns = axios.create({
    baseURL: import.meta.env.VITE_SPRING_BOOT_API_URL, // Replace with your API base URL
   
  });
axiosIns.interceptors.request.use((config)=> {
  console.log('Interceptor triggered');

  const token = useCookie("accessToken").value
 
  
  if(token)
 { 
  useCookie('role').value = parseJwt(token)['sub']
  config.headers.Authorization = `Bearer ${useCookie("accessToken").value}`
}
  return config
},
(error)=> {
  console.log('Interceptor error:', error);

  return Promise.reject(error)
})
export default axiosIns

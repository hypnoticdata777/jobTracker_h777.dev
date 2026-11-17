import axios from 'axios'

// Requests use relative /api paths, so the browser always talks to the same
// origin that served the page. In development Vite proxies /api to the local
// API (see vite.config.ts); in production the host routes /api to the API.
const api = axios.create({
  withCredentials: true,
})

export default api

import axios from 'axios'

// Las rutas relativas /api mantienen el mismo origen que la página.
// Vite reenvía las solicitudes a la API local; en producción lo hace el alojamiento.
const api = axios.create({
  withCredentials: true,
})

export default api

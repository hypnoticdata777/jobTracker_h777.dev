import axios from 'axios'

/**
 * Convierte errores de solicitudes en mensajes legibles.
 * La API responde con { error: string } o { error: string[] }.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error

    if (Array.isArray(message)) return message.join('. ')
    if (typeof message === 'string') return message
    if (!error.response) return 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'
  }

  return fallback
}

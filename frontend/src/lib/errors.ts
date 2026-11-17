import axios from 'axios'

/**
 * Turns a failed request into text a person can read.
 * The API answers with { error: string } or { error: string[] }.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error

    if (Array.isArray(message)) return message.join('. ')
    if (typeof message === 'string') return message
    if (!error.response) return 'Could not reach the server. Check your connection and try again.'
  }

  return fallback
}

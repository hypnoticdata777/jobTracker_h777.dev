/**
 * La fecha de postulación se guarda a medianoche UTC. Interpretarla en una
 * zona al oeste de UTC mostraría el día anterior; se conserva el día original.
 */
export function toDateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : ''
}

export function formatCalendarDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', { timeZone: 'UTC' })
}

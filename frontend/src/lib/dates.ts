/**
 * An applied date is a calendar date stored at UTC midnight. Reading it in the
 * local time zone would show the previous day anywhere west of UTC, so both
 * helpers work in UTC.
 */
export function toDateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : ''
}

export function formatCalendarDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { timeZone: 'UTC' })
}

export function isPureObject(data: any) {
  return typeof data === 'object' && !Array.isArray(data) && data !== null
}

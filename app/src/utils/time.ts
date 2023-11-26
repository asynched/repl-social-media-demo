export function timeSince(date: string | Date) {
  if (typeof date === 'string') {
    date = new Date(date)
  }

  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  let interval = seconds / 31536000

  if (interval > 1) {
    const value = Math.floor(interval)

    return value + ' year' + (value > 1 ? 's' : '') + ' ago'
  }

  interval = seconds / 2592000

  if (interval > 1) {
    const value = Math.floor(interval)

    return value + ' month' + (value > 1 ? 's' : '') + ' ago'
  }

  interval = seconds / 86400

  if (interval > 1) {
    const value = Math.floor(interval)

    return value + ' day' + (value > 1 ? 's' : '') + ' ago'
  }

  interval = seconds / 3600

  if (interval > 1) {
    const value = Math.floor(interval)

    return value + ' hour' + (value > 1 ? 's' : '') + ' ago'
  }

  interval = seconds / 60

  if (interval > 1) {
    const value = Math.floor(interval)

    return value + ' minute' + (value > 1 ? 's' : '') + ' ago'
  }

  if (seconds < 5) {
    return 'just now'
  }

  return Math.floor(seconds) + ' second' + (seconds > 1 ? 's' : '') + ' ago'
}

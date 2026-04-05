export const scrollTo = (id: string): void => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export const openLink = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export const mailto = (addr: string): void => {
  window.location.href = `mailto:${addr}`
}

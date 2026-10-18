// Lowercase without accents, to search names the way people type them
export const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

// Same slug Rails' parameterize gives, e.g. "Logística" -> "logistica"
export const slugify = (text: string) =>
  normalize(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  return text
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by checking against existing slugs
 * @param baseSlug - The base slug to start with
 * @param checkSlugExists - Function to check if a slug already exists
 * @returns Promise<string> - Unique slug
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkSlugExists: (slug: string) => Promise<boolean>,
): Promise<string> {
  let slug = generateSlug(baseSlug)
  let counter = 1

  // Keep checking and incrementing until we find a unique slug
  while (await checkSlugExists(slug)) {
    slug = `${generateSlug(baseSlug)}-${counter}`
    counter++
  }

  return slug
}

/**
 * Validate a slug format
 * @param slug - The slug to validate
 * @returns boolean - Whether the slug is valid
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false
  }

  // Check if slug matches the expected pattern
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugPattern.test(slug)
}

/**
 * Extract slug from a URL path
 * @param path - URL path
 * @returns Extracted slug
 */
export function extractSlugFromPath(path: string): string {
  if (!path || typeof path !== 'string') {
    return ''
  }

  // Remove leading/trailing slashes and extract the last segment
  const segments = path.replace(/^\/+|\/+$/g, '').split('/')
  return segments[segments.length - 1] || ''
}

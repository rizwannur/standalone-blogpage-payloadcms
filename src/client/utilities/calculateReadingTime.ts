/**
 * Calculate estimated reading time for text content
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  if (!text || typeof text !== 'string') {
    return 0
  }

  // Remove HTML tags and extra whitespace
  const cleanText = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim()

  // Count words (split by whitespace and filter out empty strings)
  const wordCount = cleanText.split(' ').filter((word) => word.length > 0).length

  // Calculate reading time in minutes
  const readingTime = Math.ceil(wordCount / wordsPerMinute)

  return Math.max(1, readingTime) // Minimum 1 minute
}

/**
 * Extract text content from Lexical editor rich text
 * @param richText - Rich text content from Lexical editor
 * @returns Plain text string
 */
export function extractTextFromRichText(richText: any): string {
  if (!richText || !richText.root || !richText.root.children) {
    return ''
  }

  function extractFromNode(node: any): string {
    let text = ''

    if (node.text) {
      text += node.text
    }

    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        text += extractFromNode(child)
      }
    }

    return text
  }

  return extractFromNode(richText.root)
}

/**
 * Calculate reading time for a blog post with rich text content
 * @param content - Rich text content from the post
 * @param excerpt - Optional excerpt text
 * @returns Estimated reading time in minutes
 */
export function calculatePostReadingTime(content: any, excerpt?: string): number {
  let totalText = ''

  // Add excerpt if available
  if (excerpt) {
    totalText += excerpt + ' '
  }

  // Extract text from rich text content
  if (content) {
    totalText += extractTextFromRichText(content)
  }

  return calculateReadingTime(totalText)
}

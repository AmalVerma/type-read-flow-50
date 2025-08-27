import { Page, Chunk } from '@/types';

// Configuration for pagination
export const PAGINATION_CONFIG = {
  WORDS_PER_CHUNK: 50, // Target words per typing chunk
  CHUNKS_PER_PAGE: 4,  // Number of chunks per page
  MAX_CHUNK_LENGTH: 300, // Maximum characters per chunk
};

/**
 * Splits text content into pages with chunks for typing practice
 */
export function paginateTextContent(content: string): Page[] {
  if (!content || content.trim().length === 0) {
    return [];
  }

  // Clean and normalize text
  const cleanText = content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
    .trim();

  // Split into sentences while preserving paragraph breaks
  const sentences = splitIntoSentences(cleanText);
  
  // Group sentences into chunks based on word count and character limit
  const chunks = createChunks(sentences);
  
  // Group chunks into pages
  const pages = createPages(chunks);
  
  return pages;
}

/**
 * Splits text into sentences while preserving paragraph structure
 */
function splitIntoSentences(text: string): string[] {
  const sentences: string[] = [];
  const paragraphs = text.split(/\n\s*\n/);
  
  for (const paragraph of paragraphs) {
    if (paragraph.trim().length === 0) continue;
    
    // Split paragraph into sentences
    const paragraphSentences = paragraph
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.trim().length > 0);
    
    // Add paragraph break marker to the last sentence of each paragraph
    if (paragraphSentences.length > 0) {
      const lastIndex = paragraphSentences.length - 1;
      paragraphSentences[lastIndex] = paragraphSentences[lastIndex] + '\n\n';
    }
    
    sentences.push(...paragraphSentences);
  }
  
  return sentences;
}

/**
 * Groups sentences into chunks based on word count and character limits
 */
function createChunks(sentences: string[]): Chunk[] {
  const chunks: Chunk[] = [];
  let currentChunk = '';
  let currentWordCount = 0;
  let chunkId = 1;
  
  for (const sentence of sentences) {
    const sentenceWordCount = countWords(sentence);
    const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;
    
    // Check if adding this sentence would exceed limits
    const wouldExceedWords = currentWordCount + sentenceWordCount > PAGINATION_CONFIG.WORDS_PER_CHUNK;
    const wouldExceedChars = potentialChunk.length > PAGINATION_CONFIG.MAX_CHUNK_LENGTH;
    
    if ((wouldExceedWords || wouldExceedChars) && currentChunk.length > 0) {
      // Finalize current chunk
      chunks.push({
        id: chunkId++,
        text: currentChunk.trim(),
        wordCount: currentWordCount,
      });
      
      // Start new chunk with current sentence
      currentChunk = sentence;
      currentWordCount = sentenceWordCount;
    } else {
      // Add sentence to current chunk
      currentChunk = potentialChunk;
      currentWordCount += sentenceWordCount;
    }
  }
  
  // Add the last chunk if it has content
  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: chunkId,
      text: currentChunk.trim(),
      wordCount: currentWordCount,
    });
  }
  
  return chunks;
}

/**
 * Groups chunks into pages
 */
function createPages(chunks: Chunk[]): Page[] {
  const pages: Page[] = [];
  let pageNumber = 1;
  
  for (let i = 0; i < chunks.length; i += PAGINATION_CONFIG.CHUNKS_PER_PAGE) {
    const pageChunks = chunks.slice(i, i + PAGINATION_CONFIG.CHUNKS_PER_PAGE);
    
    pages.push({
      id: pageNumber,
      chunks: pageChunks,
      pageNumber: pageNumber,
    });
    
    pageNumber++;
  }
  
  return pages;
}

/**
 * Counts words in a text string
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Gets the next page for a given chapter and current page number
 */
export function getNextPage(pages: Page[], currentPageNumber: number): Page | null {
  const nextPageIndex = currentPageNumber; // pages are 1-indexed
  return nextPageIndex < pages.length ? pages[nextPageIndex] : null;
}

/**
 * Gets the previous page for a given chapter and current page number
 */
export function getPreviousPage(pages: Page[], currentPageNumber: number): Page | null {
  const prevPageIndex = currentPageNumber - 2; // pages are 1-indexed
  return prevPageIndex >= 0 ? pages[prevPageIndex] : null;
}
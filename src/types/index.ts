export interface Chapter {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'pending';
  wordCount: number;
  progress: number; // 0-100
  chunks: Chunk[];
  uploadedAt: Date;
  fileType: 'pdf' | 'epub' | 'txt';
}

export interface Chunk {
  id: number;
  text: string;
  wordCount: number;
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  totalChapters: number;
  completedChapters: number;
  currentChapter: number;
  chapters: Chapter[];
  createdAt: Date;
  lastReadAt: Date;
  tags: string[];
}

export interface UserProgress {
  novelId: string;
  chapterId: string;
  chunkNumber: number;
  totalChunks: number;
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeElapsed: number;
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeElapsed: number;
}
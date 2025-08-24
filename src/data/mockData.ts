import { Novel, Chapter } from '@/types';

// Sample text chunks for demonstration
const sampleChunks = [
  {
    id: 1,
    text: "In the world of continuous typing, every keystroke matters. The art of combining reading and typing creates a unique learning experience that enhances both comprehension and muscle memory. As you progress through each chunk of text, your fingers learn the patterns while your mind absorbs the content.",
    wordCount: 45
  },
  {
    id: 2,
    text: "This synergy between reading and typing transforms the traditional approach to both activities, creating something entirely new and engaging. The beauty of this method lies in its simplicity and effectiveness. Rather than separating reading and typing into distinct activities, we merge them into one fluid experience.",
    wordCount: 42
  },
  {
    id: 3,
    text: "Each word becomes a stepping stone, each sentence a milestone, and each paragraph a chapter in your journey toward mastery. Research has shown that active engagement with text through typing significantly improves retention and understanding when compared to passive reading alone.",
    wordCount: 40
  }
];

const sampleChapters: Chapter[] = [
  {
    id: '1',
    title: 'Introduction to Continuous Typing',
    status: 'completed',
    wordCount: 1250,
    progress: 100,
    chunks: sampleChunks,
    uploadedAt: new Date('2024-01-15'),
    fileType: 'txt'
  },
  {
    id: '2',
    title: 'The Science Behind Reading and Typing',
    status: 'completed',
    wordCount: 2100,
    progress: 100,
    chunks: sampleChunks,
    uploadedAt: new Date('2024-01-16'),
    fileType: 'pdf'
  },
  {
    id: '3',
    title: 'Building Muscle Memory',
    status: 'current',
    wordCount: 1800,
    progress: 65,
    chunks: sampleChunks,
    uploadedAt: new Date('2024-01-17'),
    fileType: 'epub'
  },
  {
    id: '4',
    title: 'Advanced Techniques',
    status: 'pending',
    wordCount: 2200,
    progress: 0,
    chunks: [],
    uploadedAt: new Date('2024-01-18'),
    fileType: 'pdf'
  },
  {
    id: '5',
    title: 'Mastering Speed and Accuracy',
    status: 'pending',
    wordCount: 1950,
    progress: 0,
    chunks: [],
    uploadedAt: new Date('2024-01-19'),
    fileType: 'txt'
  }
];

export const mockNovels: Novel[] = [
  {
    id: '1',
    title: 'The Complete Guide to Continuous Typing',
    author: 'Dr. Sarah Chen',
    description: 'A comprehensive guide that merges reading and typing practice into one seamless experience. Learn the fundamentals, science, and advanced techniques.',
    totalChapters: 5,
    completedChapters: 2,
    currentChapter: 3,
    chapters: sampleChapters,
    createdAt: new Date('2024-01-15'),
    lastReadAt: new Date('2024-01-20'),
    tags: ['Education', 'Typing', 'Tutorial']
  },
  {
    id: '2',
    title: 'Re:Zero − Starting Life in Another World',
    author: 'Tappei Nagatsuki',
    description: 'When Subaru Natsuki leaves the convenience store, the last thing he expects is to be wrenched from his everyday life and dropped into a fantasy world.',
    totalChapters: 12,
    completedChapters: 7,
    currentChapter: 8,
    chapters: [
      {
        id: '1',
        title: 'The End of the Beginning and the Beginning of the End',
        status: 'completed',
        wordCount: 3200,
        progress: 100,
        chunks: sampleChunks,
        uploadedAt: new Date('2024-01-10'),
        fileType: 'epub'
      },
      {
        id: '2',
        title: 'A Struggle Too Late',
        status: 'completed',
        wordCount: 2900,
        progress: 100,
        chunks: sampleChunks,
        uploadedAt: new Date('2024-01-11'),
        fileType: 'epub'
      },
      {
        id: '3',
        title: 'Starting Life from Zero in Another World',
        status: 'current',
        wordCount: 3100,
        progress: 45,
        chunks: sampleChunks,
        uploadedAt: new Date('2024-01-12'),
        fileType: 'epub'
      }
    ],
    createdAt: new Date('2024-01-10'),
    lastReadAt: new Date('2024-01-21'),
    tags: ['Light Novel', 'Fantasy', 'Isekai']
  },
  {
    id: '3',
    title: 'Advanced JavaScript Concepts',
    author: 'Alex Morgan',
    description: 'Deep dive into modern JavaScript, covering closures, async/await, design patterns, and advanced programming techniques.',
    totalChapters: 8,
    completedChapters: 3,
    currentChapter: 4,
    chapters: [
      {
        id: '1',
        title: 'Understanding Closures and Scope',
        status: 'completed',
        wordCount: 2400,
        progress: 100,
        chunks: sampleChunks,
        uploadedAt: new Date('2024-01-05'),
        fileType: 'pdf'
      },
      {
        id: '2',
        title: 'Asynchronous JavaScript Mastery',
        status: 'current',
        wordCount: 2800,
        progress: 25,
        chunks: sampleChunks,
        uploadedAt: new Date('2024-01-06'),
        fileType: 'pdf'
      }
    ],
    createdAt: new Date('2024-01-05'),
    lastReadAt: new Date('2024-01-19'),
    tags: ['Programming', 'JavaScript', 'Technical']
  }
];
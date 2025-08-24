import { useState } from 'react';
import TextManager from '@/components/TextManager';

interface UserProgress {
  chapter: number;
  chunkNumber: number;
  totalChunks: number;
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeElapsed: number;
}

const Index = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  const handleProgressUpdate = (progress: UserProgress) => {
    setUserProgress(progress);
    console.log('Progress updated:', progress);
  };

  return (
    <main>
      <TextManager onProgressUpdate={handleProgressUpdate} />
    </main>
  );
};

export default Index;

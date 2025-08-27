import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Book } from 'lucide-react';
import TypingInterface from '@/components/TypingInterface';
import { useNovels, useChapters } from '@/hooks/useIndexedDB';
import { Novel, Chapter, TypingStats } from '@/types';

const ReadingInterface = () => {
  const { novelId, chapterId } = useParams<{ novelId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  
  const { novels } = useNovels();
  const { chapters } = useChapters(novelId || '');

  useEffect(() => {
    if (novelId && novels.length > 0) {
      const foundNovel = novels.find(n => n.id === novelId);
      if (foundNovel) {
        setNovel(foundNovel);
      }
    }
  }, [novelId, novels]);

  useEffect(() => {
    if (chapterId && chapters.length > 0) {
      const foundChapter = chapters.find(c => c.id === chapterId);
      if (foundChapter) {
        setChapter(foundChapter);
      }
    }
  }, [chapterId, chapters]);

  if (!novel || !chapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center bg-gradient-surface border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-4">Content Not Found</h2>
          <p className="text-muted-foreground mb-6">The chapter you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')} className="bg-gradient-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const handleChunkComplete = (stats: TypingStats) => {
    console.log('Chunk completed:', stats);
    
    // Move to next chunk after a delay
    setTimeout(() => {
      if (currentChunkIndex < chapter.chunks.length - 1) {
        setCurrentChunkIndex(prev => prev + 1);
      } else {
        // Chapter completed
        alert('Chapter completed! 🎉');
        navigate(`/novel/${novelId}`);
      }
    }, 2000);
  };

  const currentChunk = chapter?.chunks[currentChunkIndex];
  const chapterNumber = chapters.findIndex(c => c.id === chapterId) + 1;

  if (!currentChunk) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center bg-gradient-surface border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-4">No Content Available</h2>
          <p className="text-muted-foreground mb-6">This chapter doesn't have any content to read yet.</p>
          <Button onClick={() => navigate(`/novel/${novelId}`)} className="bg-gradient-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chapters
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/novel/${novelId}`)}
              className="border-border hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chapters
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="border-border hover:bg-secondary"
            >
              <Book className="w-4 h-4 mr-2" />
              Library
            </Button>
          </div>

          {/* Chapter Info */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {novel.title}
            </h1>
            <h2 className="text-xl text-foreground">
              Chapter {chapterNumber}: {chapter.title}
            </h2>
            <p className="text-muted-foreground">
              Chunk {currentChunkIndex + 1} of {chapter.chunks.length}
            </p>
          </div>
        </div>

        {/* Typing Interface */}
        <TypingInterface
          initialCurrentPage={chapter.chunks.map(chunk => chunk.text)}
          initialNextPage={['Next chapter chunk 1', 'Next chapter chunk 2']}
          onChunkComplete={handleChunkComplete}
        />

        {/* Chapter Progress */}
        <div className="mt-8 text-center">
          <Card className="inline-block p-4 bg-gradient-surface border-border/50 shadow-card">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-lg font-bold text-accent">{currentChunkIndex + 1}</div>
                <div className="text-xs text-muted-foreground">Current</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{chapter.chunks.length}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {Math.round(((currentChunkIndex) / chapter.chunks.length) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReadingInterface;
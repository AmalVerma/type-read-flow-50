import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Book, ChevronLeft, ChevronRight } from 'lucide-react';
import TypingInterface from '@/components/TypingInterface';
import { useNovels, useChapters } from '@/hooks/useIndexedDB';
import { Novel, Chapter, TypingStats, Page } from '@/types';
import { getNextPage, getPreviousPage } from '@/utils/textPagination';

const ReadingInterface = () => {
  const { novelId, chapterId } = useParams<{ novelId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
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

  const currentPage = chapter.pages[currentPageIndex];
  const nextPage = getNextPage(chapter.pages, currentPageIndex + 1);
  const previousPage = getPreviousPage(chapter.pages, currentPageIndex + 1);
  const chapterNumber = chapters.findIndex(c => c.id === chapterId) + 1;
  const totalPages = chapter.pages.length;

  const handlePageComplete = (stats: TypingStats) => {
    console.log('Page completed:', stats);
    
    // Move to next page after a delay
    setTimeout(() => {
      if (currentPageIndex < chapter.pages.length - 1) {
        setCurrentPageIndex(prev => prev + 1);
      } else {
        // Chapter completed
        alert('Chapter completed! 🎉');
        navigate(`/novel/${novelId}`);
      }
    }, 2000);
  };

  const handleNextPage = () => {
    if (currentPageIndex < chapter.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  if (!currentPage || !currentPage.chunks.length) {
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

  // Convert page chunks to strings for TypingInterface
  const currentPageContent = currentPage.chunks.map(chunk => chunk.text);
  const nextPageContent = nextPage ? nextPage.chunks.map(chunk => chunk.text) : [];

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
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handlePreviousPage}
                disabled={currentPageIndex === 0}
                className="border-border hover:bg-secondary"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous Page
              </Button>
              <Button 
                variant="outline" 
                onClick={handleNextPage}
                disabled={currentPageIndex >= totalPages - 1}
                className="border-border hover:bg-secondary"
              >
                Next Page
                <ChevronRight className="w-4 h-4 ml-1" />
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
              Page {currentPageIndex + 1} of {totalPages} • {currentPage.chunks.length} chunks
            </p>
          </div>
        </div>

        {/* Typing Interface */}
        <TypingInterface
          initialCurrentPage={currentPageContent}
          initialNextPage={nextPageContent}
          onPageComplete={handlePageComplete}
          currentPageNumber={currentPageIndex + 1}
        />

        {/* Chapter Progress */}
        <div className="mt-8 text-center">
          <Card className="inline-block p-4 bg-gradient-surface border-border/50 shadow-card">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-lg font-bold text-accent">{currentPageIndex + 1}</div>
                <div className="text-xs text-muted-foreground">Current Page</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{totalPages}</div>
                <div className="text-xs text-muted-foreground">Total Pages</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {Math.round(((currentPageIndex + 1) / totalPages) * 100)}%
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
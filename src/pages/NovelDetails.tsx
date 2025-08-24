import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Book, Calendar, FileText, Plus, Settings } from 'lucide-react';
import ChapterCard from '@/components/ChapterCard';
import AddChapterDialog from '@/components/AddChapterDialog';
import { mockNovels } from '@/data/mockData';
import { Novel } from '@/types';

const NovelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [novel, setNovel] = useState<Novel | null>(
    mockNovels.find(n => n.id === id) || null
  );

  if (!novel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center bg-gradient-surface border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-4">Novel Not Found</h2>
          <p className="text-muted-foreground mb-6">The novel you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')} className="bg-gradient-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const progressPercentage = (novel.completedChapters / novel.totalChapters) * 100;
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleChapterAdded = () => {
    // In a real app, this would refresh the novel data
    console.log('Chapter added successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="border-border hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Button>
            <div className="flex items-center space-x-3">
              <AddChapterDialog novelId={novel.id} onChapterAdded={handleChapterAdded} />
              <Button variant="outline" className="border-border hover:bg-secondary">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Novel Info Card */}
          <Card className="p-8 bg-gradient-surface border-border/50 shadow-card">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Book Cover Placeholder */}
              <div className="md:col-span-1">
                <div className="aspect-[3/4] bg-gradient-primary rounded-lg flex items-center justify-center shadow-typing">
                  <Book className="w-16 h-16 text-primary-foreground" />
                </div>
              </div>

              {/* Book Details */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {novel.title}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-4">by {novel.author}</p>
                  <p className="text-foreground leading-relaxed">
                    {novel.description}
                  </p>
                </div>

                {/* Progress Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Reading Progress</h3>
                    <span className="text-2xl font-bold text-primary">
                      {novel.completedChapters}/{novel.totalChapters}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{Math.round(progressPercentage)}% complete</span>
                    <span>Chapter {novel.currentChapter} in progress</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Added {formatDate(novel.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>Last read {formatDate(novel.lastReadAt)}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {novel.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Chapters Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Chapters</h2>
            <div className="text-sm text-muted-foreground">
              {novel.chapters.length} of {novel.totalChapters} chapters available
            </div>
          </div>

          {/* Chapters Grid */}
          {novel.chapters.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-surface border-border/50">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No chapters yet</h3>
              <p className="text-muted-foreground mb-6">
                Start building your novel by adding the first chapter.
              </p>
              <AddChapterDialog novelId={novel.id} onChapterAdded={handleChapterAdded} />
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {novel.chapters.map((chapter, index) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  novelId={novel.id}
                  chapterNumber={index + 1}
                />
              ))}
              
              {/* Add Chapter Card */}
              <Card className="p-6 border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors duration-300">
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Add New Chapter</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload your next chapter to continue the story
                    </p>
                    <AddChapterDialog novelId={novel.id} onChapterAdded={handleChapterAdded} />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 flex justify-center">
          <Card className="p-6 bg-gradient-surface border-border/50 shadow-card">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{novel.completedChapters}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-current">1</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  {novel.totalChapters - novel.completedChapters - 1}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NovelDetails;
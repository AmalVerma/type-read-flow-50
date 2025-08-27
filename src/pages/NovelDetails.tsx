import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  BookOpen,
  Clock,
  Target,
  Plus,
  Play,
  FileText,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { Novel, Chapter } from '@/types';
import { useNovels, useChapters } from '@/hooks/useIndexedDB';
import ChapterCard from '@/components/ChapterCard';
import AddChapterDialog from '@/components/AddChapterDialog';
import { useToast } from '@/hooks/use-toast';

const NovelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { novels } = useNovels();
  const { chapters, isLoading: chaptersLoading, refreshChapters } = useChapters(id || '');
  const { toast } = useToast();

  useEffect(() => {
    if (id && novels.length > 0) {
      const foundNovel = novels.find(n => n.id === id);
      if (foundNovel) {
        setNovel(foundNovel);
      } else {
        toast({
          title: "Novel not found",
          description: "The requested novel could not be found.",
          variant: "destructive"
        });
        navigate('/dashboard/library');
      }
      setIsLoading(false);
    }
  }, [id, novels, navigate, toast]);

  const handleChapterAdded = () => {
    refreshChapters();
  };

  const handleStartReading = (chapterId: string) => {
    if (novel) {
      navigate(`/reading/${novel.id}/${chapterId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  if (!novel) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-muted-foreground">Novel not found</h1>
        <Button onClick={() => navigate('/dashboard/library')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Button>
      </div>
    );
  }

  const progressPercentage = novel.totalChapters > 0 ? (novel.completedChapters / novel.totalChapters) * 100 : 0;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/library')}
          className="border-border hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Novel Details
        </h1>
      </div>

      {/* Novel Info */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Novel Cover & Basic Info */}
        <Card className="lg:col-span-1 bg-gradient-surface border-border/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Cover */}
              <div className="w-full h-64 bg-gradient-primary rounded-lg flex items-center justify-center">
                {novel.coverImage ? (
                  <img 
                    src={novel.coverImage} 
                    alt={`${novel.title} cover`} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <BookOpen className="w-16 h-16 text-primary-foreground" />
                )}
              </div>

              {/* Title & Author */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">{novel.title}</h2>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{novel.author}</span>
                </div>
              </div>

              {/* Tags */}
              {novel.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium">
                    <Tag className="w-4 h-4" />
                    <span>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {novel.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{novel.completedChapters}/{novel.totalChapters}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  {progressPercentage.toFixed(1)}% Complete
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {novel.description && (
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {novel.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-surface border-border/50 text-center">
              <div className="text-2xl font-bold text-foreground">{chapters.length}</div>
              <div className="text-sm text-muted-foreground">Total Chapters</div>
            </Card>
            
            <Card className="p-4 bg-gradient-surface border-border/50 text-center">
              <div className="text-2xl font-bold text-foreground">{novel.completedChapters}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </Card>
            
            <Card className="p-4 bg-gradient-surface border-border/50 text-center">
              <div className="text-2xl font-bold text-foreground">
                {chapters.reduce((acc, ch) => acc + ch.wordCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Words</div>
            </Card>
            
            <Card className="p-4 bg-gradient-surface border-border/50 text-center">
              <div className="text-2xl font-bold text-foreground">
                {chapters.filter(ch => ch.status === 'current').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Chapters Section */}
      <Card className="bg-gradient-surface border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Chapters ({chapters.length})</span>
            </CardTitle>
            <AddChapterDialog 
              novelId={novel.id}
              onChapterAdded={handleChapterAdded}
            />
          </div>
        </CardHeader>
        <CardContent>
          {chaptersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading chapters...</p>
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No chapters yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first chapter to start your typing journey with this novel.
              </p>
              <AddChapterDialog 
                novelId={novel.id}
                onChapterAdded={handleChapterAdded}
                trigger={
                  <Button className="bg-gradient-primary hover:shadow-typing transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Chapter
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="grid gap-4">
              {chapters.map((chapter, index) => (
                <ChapterCard 
                  key={chapter.id} 
                  chapter={chapter} 
                  novelId={novel.id}
                  chapterNumber={index + 1}
                  onStartReading={() => handleStartReading(chapter.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NovelDetails;
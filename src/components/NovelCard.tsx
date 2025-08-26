import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, Calendar, User } from 'lucide-react';
import { Novel } from '@/types';
import { useNavigate } from 'react-router-dom';

interface NovelCardProps {
  novel: Novel;
}

const NovelCard: React.FC<NovelCardProps> = ({ novel }) => {
  const navigate = useNavigate();
  const progressPercentage = novel.totalChapters > 0 ? (novel.completedChapters / novel.totalChapters) * 100 : 0;

  const handleViewDetails = () => {
    navigate(`/novel/${novel.id}`);
  };

  const handleContinueReading = () => {
    // Find the current chapter or first incomplete chapter
    const currentChapter = novel.chapters.find(ch => ch.status === 'current') || 
                          novel.chapters.find(ch => ch.status === 'pending');
    
    if (currentChapter) {
      navigate(`/reading/${novel.id}/${currentChapter.id}`);
    } else {
      handleViewDetails(); // Go to details if no chapters to read
    }
  };

  return (
    <Card className="bg-gradient-surface border-border/50 shadow-card hover:shadow-glow transition-all duration-300 overflow-hidden group">
      <CardContent className="p-0">
        <div className="flex h-48">
          {/* Cover Image */}
          <div className="w-32 flex-shrink-0 bg-gradient-primary flex items-center justify-center">
            {novel.coverImage ? (
              <img 
                src={novel.coverImage} 
                alt={`${novel.title} cover`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="w-12 h-12 text-primary-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div className="space-y-2">
              {/* Title & Author */}
              <div>
                <h3 
                  className="font-semibold text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={handleViewDetails}
                >
                  {novel.title}
                </h3>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{novel.author}</span>
                </div>
              </div>

              {/* Description */}
              {novel.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {novel.description}
                </p>
              )}

              {/* Tags */}
              {novel.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {novel.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {novel.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{novel.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="space-y-3">
              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{novel.completedChapters}/{novel.totalChapters} chapters</span>
                </div>
                <Progress value={progressPercentage} className="h-1.5" />
              </div>

              {/* Last Read */}
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Last read: {novel.lastReadAt.toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={handleContinueReading}
                  className="flex-1 bg-gradient-primary hover:shadow-typing transition-all duration-300"
                  disabled={novel.chapters.length === 0}
                >
                  <Play className="w-3 h-3 mr-1" />
                  {novel.completedChapters > 0 ? 'Continue' : 'Start'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleViewDetails}
                  className="border-border hover:bg-secondary"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NovelCard;
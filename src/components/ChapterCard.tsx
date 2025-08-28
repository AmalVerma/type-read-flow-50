import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Play, FileText, Clock, Trash2, ChevronUp, ChevronDown, MoreVertical } from 'lucide-react';
import { Chapter } from '@/types';
import { useNavigate } from 'react-router-dom';

interface ChapterCardProps {
  chapter: Chapter;
  novelId: string;
  chapterNumber: number;
  onStartReading?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ 
  chapter, 
  novelId, 
  chapterNumber, 
  onStartReading, 
  onDelete, 
  onMoveUp, 
  onMoveDown 
}) => {
  const navigate = useNavigate();

  const getStatusIcon = () => {
    switch (chapter.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-accent" />;
      case 'current':
        return <Circle className="w-5 h-5 text-current fill-current" />;
      case 'pending':
        return <Circle className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (chapter.status) {
      case 'completed':
        return 'border-accent/50 bg-accent/5';
      case 'current':
        return 'border-current/50 bg-gradient-primary/5 shadow-typing';
      case 'pending':
        return 'border-border/50 bg-muted/20';
      default:
        return 'border-border/50';
    }
  };

  const getFileTypeIcon = () => {
    switch (chapter.fileType) {
      case 'pdf':
        return '📄';
      case 'epub':
        return '📖';
      case 'txt':
        return '📝';
      default:
        return '📄';
    }
  };

  const handleStartReading = () => {
    if (onStartReading) {
      onStartReading();
    } else {
      // Navigate to typing interface with this chapter
      navigate(`/read/${novelId}/${chapter.id}`);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className={`p-6 transition-all duration-300 hover:shadow-card ${getStatusColor()}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {getStatusIcon()}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Chapter {chapterNumber}
                </span>
                <span className="text-lg">{getFileTypeIcon()}</span>
              </div>
              <h3 className="font-bold text-lg text-foreground">
                {chapter.title}
              </h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              variant={chapter.status === 'completed' ? 'default' : 'secondary'}
              className={
                chapter.status === 'completed' 
                  ? 'bg-accent text-accent-foreground' 
                  : chapter.status === 'current'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }
            >
              {chapter.status === 'completed' ? 'Completed' : 
               chapter.status === 'current' ? 'In Progress' : 'Pending'}
            </Badge>
            
            {/* Chapter Controls */}
            <div className="flex flex-col space-y-1">
              {onMoveUp && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMoveUp}
                  className="h-6 w-6 p-0 hover:bg-secondary"
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
              )}
              {onMoveDown && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMoveDown}
                  className="h-6 w-6 p-0 hover:bg-secondary"
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress for current/completed chapters */}
        {chapter.status !== 'pending' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-accent font-medium">{chapter.progress}%</span>
            </div>
            <Progress value={chapter.progress} className="h-2" />
          </div>
        )}

        {/* Chapter Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>{chapter.wordCount.toLocaleString()} words</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Added {formatDate(chapter.uploadedAt)}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {chapter.fileType.toUpperCase()}
          </Badge>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {chapter.status === 'pending' ? (
            <Button 
              variant="outline" 
              className="w-full border-border hover:bg-secondary" 
              disabled
            >
              Not Available
            </Button>
          ) : (
            <Button 
              onClick={handleStartReading}
              className="w-full bg-gradient-primary hover:shadow-typing transition-all duration-300"
            >
              <Play className="w-4 h-4 mr-2" />
              {chapter.status === 'completed' ? 'Read Again' : 'Continue Reading'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChapterCard;
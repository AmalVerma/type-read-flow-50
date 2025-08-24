import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Book, Calendar, FileText, Clock } from 'lucide-react';
import { Novel } from '@/types';
import { useNavigate } from 'react-router-dom';

interface NovelCardProps {
  novel: Novel;
}

const NovelCard: React.FC<NovelCardProps> = ({ novel }) => {
  const navigate = useNavigate();
  
  const progressPercentage = (novel.completedChapters / novel.totalChapters) * 100;
  
  const handleClick = () => {
    navigate(`/novel/${novel.id}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card 
      className="p-6 bg-gradient-surface border-border/50 shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-typing">
              <Book className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {novel.title}
              </h3>
              <p className="text-sm text-muted-foreground">by {novel.author}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-2xl font-bold text-primary">
              {novel.completedChapters}/{novel.totalChapters}
            </div>
            <div className="text-xs text-muted-foreground">chapters</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {novel.description}
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-accent font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Current Chapter */}
        <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-lg">
          <FileText className="w-4 h-4 text-current" />
          <span className="text-sm text-foreground">
            Chapter {novel.currentChapter}: {novel.chapters[novel.currentChapter - 1]?.title || 'Not started'}
          </span>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Added {formatDate(novel.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Last read {formatDate(novel.lastReadAt)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {novel.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default NovelCard;
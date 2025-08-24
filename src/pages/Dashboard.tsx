import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, BookOpen, TrendingUp, Clock, Target } from 'lucide-react';
import NovelCard from '@/components/NovelCard';
import { mockNovels } from '@/data/mockData';
import { Novel } from '@/types';

const Dashboard = () => {
  const [novels] = useState<Novel[]>(mockNovels);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Filter novels based on search and tags
  const filteredNovels = novels.filter((novel) => {
    const matchesSearch = novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         novel.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || novel.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = Array.from(new Set(novels.flatMap(novel => novel.tags)));

  // Calculate dashboard stats
  const totalChapters = novels.reduce((acc, novel) => acc + novel.totalChapters, 0);
  const completedChapters = novels.reduce((acc, novel) => acc + novel.completedChapters, 0);
  const averageProgress = novels.length > 0 ? (completedChapters / totalChapters) * 100 : 0;
  const recentlyRead = novels.filter(novel => {
    const daysSinceLastRead = (Date.now() - novel.lastReadAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastRead <= 7;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Your Library
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Continue your typing journey through your favorite novels
              </p>
            </div>
            <Button className="bg-gradient-primary hover:shadow-typing transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Add Novel
            </Button>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 bg-gradient-surface border-border/50 shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{novels.length}</div>
                  <div className="text-sm text-muted-foreground">Novels</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-surface border-border/50 shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{completedChapters}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-surface border-border/50 shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{Math.round(averageProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Avg Progress</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-surface border-border/50 shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{recentlyRead}</div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search novels or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border focus:border-primary"
            />
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedTag === '' ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedTag('')}
            >
              All
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'secondary'}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Novels Grid */}
        <div className="space-y-6">
          {filteredNovels.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-surface border-border/50">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No novels found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedTag 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start your typing journey by adding your first novel.'
                }
              </p>
              {!searchQuery && !selectedTag && (
                <Button className="bg-gradient-primary hover:shadow-typing transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Novel
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNovels.map((novel) => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-12 text-center text-muted-foreground text-sm">
          <p>
            You have {novels.length} novel{novels.length !== 1 ? 's' : ''} in your library with{' '}
            {totalChapters} total chapters. Keep up the great work! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
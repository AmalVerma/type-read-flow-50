import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, BookOpen, Filter, SortAsc } from 'lucide-react';
import NovelCard from '@/components/NovelCard';
import AddNovelDialog from '@/components/AddNovelDialog';
import { db } from '@/lib/indexeddb';
import { Novel } from '@/types';

const DashboardLibrary = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'title' | 'progress' | 'lastRead'>('lastRead');

  // Load novels from IndexedDB
  useEffect(() => {
    const loadNovels = async () => {
      try {
        const storedNovels = await db.getAllNovels();
        setNovels(storedNovels);
      } catch (error) {
        console.error('Failed to load novels:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNovels();
  }, []);

  // Filter and sort novels
  const filteredNovels = novels
    .filter((novel) => {
      const matchesSearch = novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           novel.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || novel.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'progress':
          return (b.completedChapters / b.totalChapters) - (a.completedChapters / a.totalChapters);
        case 'lastRead':
        default:
          return b.lastReadAt.getTime() - a.lastReadAt.getTime();
      }
    });

  // Get all unique tags
  const allTags = Array.from(new Set(novels.flatMap(novel => novel.tags)));

  // Calculate stats
  const totalChapters = novels.reduce((acc, novel) => acc + novel.totalChapters, 0);
  const completedChapters = novels.reduce((acc, novel) => acc + novel.completedChapters, 0);
  const inProgress = novels.filter(n => n.completedChapters > 0 && n.completedChapters < n.totalChapters).length;
  const completed = novels.filter(n => n.completedChapters === n.totalChapters).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            My Library
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your novel collection
          </p>
        </div>
        <AddNovelDialog onNovelAdded={() => {
          const loadNovels = async () => {
            try {
              const storedNovels = await db.getAllNovels();
              setNovels(storedNovels);
            } catch (error) {
              console.error('Failed to load novels:', error);
            }
          };
          loadNovels();
        }} />
      </div>

      {/* Library Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-surface border-border/50 shadow-card">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{novels.length}</div>
            <div className="text-sm text-muted-foreground">Total Novels</div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-surface border-border/50 shadow-card">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-surface border-border/50 shadow-card">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-surface border-border/50 shadow-card">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{totalChapters}</div>
            <div className="text-sm text-muted-foreground">Total Chapters</div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search novels or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border focus:border-primary"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'progress' | 'lastRead')}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="lastRead">Recently Read</option>
            <option value="title">Title A-Z</option>
            <option value="progress">Progress</option>
          </select>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTag === '' ? 'default' : 'secondary'}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setSelectedTag('')}
          >
            All ({novels.length})
          </Badge>
          {allTags.map((tag) => {
            const count = novels.filter(n => n.tags.includes(tag)).length;
            return (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'secondary'}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedTag(tag)}
              >
                {tag} ({count})
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Novels Grid */}
      <div className="space-y-6">
        {isLoading ? (
          <Card className="p-12 text-center bg-gradient-surface border-border/50">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your library...</p>
          </Card>
        ) : filteredNovels.length === 0 ? (
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

      {/* Results Summary */}
      {filteredNovels.length > 0 && (
        <div className="text-center text-muted-foreground text-sm">
          <p>
            Showing {filteredNovels.length} of {novels.length} novels
            {(searchQuery || selectedTag) && (
              <span>
                {' '}with current filters
                <Button 
                  variant="link" 
                  className="p-0 ml-1 h-auto text-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag('');
                  }}
                >
                  Clear filters
                </Button>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardLibrary;
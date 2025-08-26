import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Target, 
  Plus,
  Zap,
  Calendar,
  Trophy,
  ChevronRight,
  Activity,
  Timer
} from 'lucide-react';
import NovelCard from '@/components/NovelCard';
import AddNovelDialog from '@/components/AddNovelDialog';
import { db } from '@/lib/indexeddb';
import { Novel } from '@/types';

const DashboardOverview = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load novels from IndexedDB
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

  useEffect(() => {
    loadNovels();
  }, []);

  // Calculate dashboard stats
  const totalChapters = novels.reduce((acc, novel) => acc + novel.totalChapters, 0);
  const completedChapters = novels.reduce((acc, novel) => acc + novel.completedChapters, 0);
  const averageProgress = novels.length > 0 ? (completedChapters / totalChapters) * 100 : 0;
  const recentlyRead = novels.filter(novel => {
    const daysSinceLastRead = (Date.now() - novel.lastReadAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastRead <= 7;
  }).length;

  // Get current reading novels
  const currentlyReading = novels.filter(novel => 
    novel.completedChapters > 0 && novel.completedChapters < novel.totalChapters
  ).slice(0, 3);

  // Mock data for recent activity and quick stats
  const recentActivity = [
    { action: "Completed Chapter 5", novel: "The Great Gatsby", time: "2 hours ago", wpm: 65 },
    { action: "Started new session", novel: "Pride and Prejudice", time: "5 hours ago", wpm: 58 },
    { action: "Achieved 70 WPM", novel: "1984", time: "1 day ago", wpm: 70 },
  ];

  const weeklyGoals = {
    chaptersGoal: 5,
    chaptersCompleted: 3,
    wpmGoal: 70,
    currentWpm: 65,
    minutesGoal: 300,
    minutesCompleted: 180
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Welcome back! 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your typing journey? Here's your progress overview.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-surface border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{novels.length}</div>
                <div className="text-sm text-muted-foreground">Novels</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-surface border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{completedChapters}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-surface border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">65</div>
                <div className="text-sm text-muted-foreground">Avg WPM</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-surface border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{recentlyRead}</div>
                <div className="text-sm text-muted-foreground">This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Goals */}
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Weekly Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Chapters Read</span>
                  <span>{weeklyGoals.chaptersCompleted}/{weeklyGoals.chaptersGoal}</span>
                </div>
                <Progress value={(weeklyGoals.chaptersCompleted / weeklyGoals.chaptersGoal) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>WPM Target</span>
                  <span>{weeklyGoals.currentWpm}/{weeklyGoals.wpmGoal} WPM</span>
                </div>
                <Progress value={(weeklyGoals.currentWpm / weeklyGoals.wpmGoal) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Reading Time</span>
                  <span>{weeklyGoals.minutesCompleted}/{weeklyGoals.minutesGoal} min</span>
                </div>
                <Progress value={(weeklyGoals.minutesCompleted / weeklyGoals.minutesGoal) * 100} />
              </div>
            </CardContent>
          </Card>

          {/* Continue Reading */}
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span>Continue Reading</span>
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {currentlyReading.map((novel) => (
                  <div key={novel.id} className="flex items-center space-x-4 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="w-12 h-16 bg-gradient-primary rounded flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{novel.title}</h4>
                      <p className="text-sm text-muted-foreground">{novel.author}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={(novel.completedChapters / novel.totalChapters) * 100} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground">
                          {novel.completedChapters}/{novel.totalChapters}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Continue
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <AddNovelDialog 
                onNovelAdded={loadNovels}
                trigger={
                  <Button className="w-full bg-gradient-primary hover:shadow-typing transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Novel
                  </Button>
                }
              />
              <Button variant="outline" className="w-full">
                <Timer className="w-4 h-4 mr-2" />
                Start Session
              </Button>
              <Button variant="outline" className="w-full">
                <Activity className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-muted-foreground">{activity.novel}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                        <Badge variant="secondary" className="text-xs">
                          {activity.wpm} WPM
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievement */}
          <Card className="bg-gradient-accent border-border/50">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-accent-foreground mx-auto mb-2" />
              <h4 className="font-medium text-accent-foreground">Speed Demon!</h4>
              <p className="text-sm text-accent-foreground/80 mt-1">
                You've reached 70+ WPM this week
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
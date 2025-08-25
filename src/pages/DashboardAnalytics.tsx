import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap,
  Calendar,
  Trophy,
  Activity,
  BookOpen
} from 'lucide-react';

const DashboardAnalytics = () => {
  // Mock analytics data
  const weeklyStats = {
    wpm: [45, 52, 48, 55, 62, 58, 65],
    accuracy: [88, 91, 89, 93, 95, 92, 94],
    timeSpent: [45, 60, 30, 75, 90, 45, 80], // minutes
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  const monthlyProgress = {
    chaptersRead: 24,
    totalWords: 125000,
    avgWPM: 58,
    totalTime: 45, // hours
    accuracy: 92,
    improvement: 12 // percentage
  };

  const achievements = [
    { title: "Speed Demon", description: "Reached 70+ WPM", unlocked: true, icon: "⚡" },
    { title: "Consistent Reader", description: "Read 7 days in a row", unlocked: true, icon: "📅" },
    { title: "Chapter Master", description: "Completed 50 chapters", unlocked: false, icon: "📚" },
    { title: "Accuracy Expert", description: "Maintain 95% accuracy", unlocked: false, icon: "🎯" },
  ];

  const novels = [
    { title: "The Great Gatsby", progress: 85, wpm: 62, chapters: 8, accuracy: 94 },
    { title: "Pride and Prejudice", progress: 45, wpm: 58, chapters: 12, accuracy: 91 },
    { title: "1984", progress: 70, wpm: 65, chapters: 15, accuracy: 96 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your typing progress and performance insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-surface border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{monthlyProgress.avgWPM}</div>
                <div className="text-sm text-muted-foreground">Avg WPM</div>
                <div className="text-xs text-accent flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{monthlyProgress.improvement}%
                </div>
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
                <div className="text-2xl font-bold text-foreground">{monthlyProgress.accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
                <div className="text-xs text-accent">Excellent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-surface border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{monthlyProgress.totalTime}h</div>
                <div className="text-sm text-muted-foreground">This Month</div>
                <div className="text-xs text-muted-foreground">~1.5h/day</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-surface border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{monthlyProgress.chaptersRead}</div>
                <div className="text-sm text-muted-foreground">Chapters</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Performance Chart */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Weekly Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* WPM Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Words Per Minute</h4>
                  <div className="flex items-end space-x-2 h-32">
                    {weeklyStats.wpm.map((wpm, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-primary rounded-t"
                          style={{ height: `${(wpm / 70) * 100}%` }}
                        />
                        <div className="text-xs text-muted-foreground mt-2">{weeklyStats.days[index]}</div>
                        <div className="text-xs font-medium">{wpm}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accuracy Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Accuracy %</h4>
                  <div className="flex items-end space-x-2 h-24">
                    {weeklyStats.accuracy.map((acc, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-accent rounded-t"
                          style={{ height: `${(acc / 100) * 100}%` }}
                        />
                        <div className="text-xs text-muted-foreground mt-2">{weeklyStats.days[index]}</div>
                        <div className="text-xs font-medium">{acc}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Novel Progress */}
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>Novel Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {novels.map((novel, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{novel.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{novel.wpm} WPM</Badge>
                        <Badge variant="outline">{novel.accuracy}%</Badge>
                      </div>
                    </div>
                    <Progress value={novel.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{novel.chapters} chapters completed</span>
                      <span>{novel.progress}% complete</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Monthly Goals */}
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Reading Time</span>
                  <span>45/60 hours</span>
                </div>
                <Progress value={75} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>WPM Target</span>
                  <span>58/65 WPM</span>
                </div>
                <Progress value={89} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Chapters</span>
                  <span>24/30</span>
                </div>
                <Progress value={80} />
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-3 p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-muted/30' : 'opacity-50'
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                    {achievement.unlocked && (
                      <div className="w-2 h-2 bg-accent rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Streak */}
          <Card className="bg-gradient-accent border-border/50">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-accent-foreground mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent-foreground">7</div>
              <div className="text-sm text-accent-foreground/80">Day Streak</div>
              <div className="text-xs text-accent-foreground/60 mt-1">Keep it up!</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
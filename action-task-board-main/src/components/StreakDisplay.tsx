
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Award, Trophy, Flame, Calendar, BarChart3 } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const StreakDisplay: React.FC = () => {
  const { streak, points, achievements, tasks } = useTaskContext();
  
  // Get earned achievements
  const earnedAchievements = achievements.filter(achievement => achievement.earned);
  const achievementProgress = Math.round((earnedAchievements.length / achievements.length) * 100);
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'award':
        return <Award className="w-5 h-5 text-indigo-500" />;
      case 'star':
        return <Star className="w-5 h-5 text-blue-500" />;
      default:
        return <Award className="w-5 h-5 text-purple-500" />;
    }
  };

  // Calculate level based on points
  const level = Math.floor(points / 100) + 1;
  const pointsToNextLevel = 100 - (points % 100);
  const levelProgress = (points % 100);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-none shadow-sm overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium">Daily Streak</p>
                <h2 className="text-2xl font-bold">{streak} {streak === 1 ? 'day' : 'days'}</h2>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div>
                <p className="font-medium text-right">Level {level}</p>
                <h2 className="text-2xl font-bold text-right">{points} XP</h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </div>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Level Progress</span>
                  <span>{levelProgress}%</span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Level {level}</h4>
                <p className="text-xs text-muted-foreground">
                  Complete more tasks to earn XP. You need {pointsToNextLevel} more XP to reach level {level + 1}.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
          
          <div className="flex justify-end mt-2">
            <Link to="/analytics" className="text-xs text-primary flex items-center hover:underline">
              <BarChart3 className="h-3 w-3 mr-1" />
              View Analytics
            </Link>
          </div>
        </CardContent>
      </Card>

      {earnedAchievements.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Achievements ({earnedAchievements.length}/{achievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Progress value={achievementProgress} className="h-2 mb-3" />
            <div className="grid grid-cols-2 gap-2">
              {earnedAchievements.map((achievement) => (
                <HoverCard key={achievement.id}>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center space-x-2 p-2 rounded-md bg-muted/50 cursor-pointer">
                      {getIconComponent(achievement.icon)}
                      <div>
                        <p className="font-medium text-sm">{achievement.title}</p>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{achievement.title}</h4>
                      <p className="text-xs">{achievement.description}</p>
                      {achievement.earnedAt && (
                        <p className="text-xs text-muted-foreground">
                          Earned on {format(new Date(achievement.earnedAt), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StreakDisplay;

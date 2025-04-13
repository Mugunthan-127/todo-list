
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Award, Trophy, Flame } from 'lucide-react';

const StreakDisplay = () => {
  const { streak, points, achievements } = useTaskContext();
  
  // Get earned achievements
  const earnedAchievements = achievements.filter(achievement => achievement.earned);
  
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'award':
        return <Award className="w-5 h-5 text-indigo-500" />;
      case 'compass':
        return <Star className="w-5 h-5 text-blue-500" />;
      default:
        return <Award className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <div>
                <p className="font-medium">Current Streak</p>
                <h2 className="text-2xl font-bold">{streak} {streak === 1 ? 'day' : 'days'}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="font-medium">Points</p>
                <h2 className="text-2xl font-bold">{points}</h2>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {earnedAchievements.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {earnedAchievements.map((achievement) => (
                <li key={achievement.id} className="flex items-center space-x-2 p-2 rounded-md bg-muted/50">
                  {getIconComponent(achievement.icon)}
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StreakDisplay;

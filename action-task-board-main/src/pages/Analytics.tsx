
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, Clock, BarChart3, Calendar, PieChart } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isSameDay, isWithinInterval, addDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Analytics: React.FC = () => {
  const { tasks, points, streak } = useTaskContext();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  
  // Calculate tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort categories by number of tasks
  const sortedCategories = Object.entries(tasksByCategory)
    .sort(([, countA], [, countB]) => countB - countA);
  
  // Tasks completed this week
  const tasksThisWeek = tasks.filter(task => 
    task.completed && 
    task.completedAt && 
    isWithinInterval(new Date(task.completedAt), {
      start: weekStart,
      end: weekEnd
    })
  );
  
  // Create daily activity data for the current week
  const weekDays = [...Array(7)].map((_, i) => {
    const date = addDays(weekStart, i);
    const dayTasks = tasksThisWeek.filter(task => 
      task.completedAt && isSameDay(new Date(task.completedAt), date)
    );
    return {
      day: format(date, 'EEE'),
      date: format(date, 'MMM d'),
      count: dayTasks.length
    };
  });
  
  // Calculate productivity score (based on completion rate and streak)
  const productivityScore = Math.min(100, completionRate + (streak * 5));
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Analytics</h1>
        <Button asChild variant="outline">
          <Link to="/">
            <Clock className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-2">{streak} days</div>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Keep it up to earn more achievements!
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivityScore}</div>
            <Progress 
              value={productivityScore} 
              className="h-2 mt-2"
              style={{
                background: 'linear-gradient(to right, #4338ca, #3b82f6, #10b981)',
              }} 
            />
            <p className="text-xs text-muted-foreground mt-2">
              Based on completion rate and streak
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary" />
              Tasks by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {sortedCategories.map(([category, count]) => (
                <div key={category} className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium capitalize">{category}</span>
                    <span className="text-sm text-muted-foreground">{count} tasks</span>
                  </div>
                  <Progress 
                    value={(count / totalTasks) * 100}
                    className={`h-2 bg-gray-100 category-${category}`}
                  />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center">
              {weekDays.map((day) => (
                <div key={day.day} className="flex flex-col items-center">
                  <span className="text-xs font-medium">{day.day}</span>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 text-xs font-medium ${
                      day.count > 0 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {day.count}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Tasks completed each day this week
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

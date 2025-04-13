
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

// Sample initial tasks
const initialTasks = [
  {
    id: uuidv4(),
    title: 'Complete Task Mate Project',
    description: 'Finish building the Task Mate application before the deadline',
    dueDate: '2025-04-14',
    category: 'work',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Grocery Shopping',
    description: 'Buy fruits, vegetables, and milk from the supermarket',
    dueDate: '2025-04-13',
    category: 'shopping',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Morning Workout',
    description: '30 minutes of cardio and strength training',
    dueDate: '2025-04-13',
    category: 'health',
    completed: true,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
];

// Sample initial achievements
const initialAchievements = [
  {
    id: uuidv4(),
    title: 'First Task',
    description: 'Complete your first task',
    earned: false,
    icon: 'trophy',
  },
  {
    id: uuidv4(),
    title: 'Task Streak',
    description: 'Complete tasks for 3 days in a row',
    earned: false,
    icon: 'flame',
  },
  {
    id: uuidv4(),
    title: 'Productivity Master',
    description: 'Complete 10 tasks',
    earned: false,
    icon: 'award',
  },
  {
    id: uuidv4(),
    title: 'Category Explorer',
    description: 'Complete tasks across all categories',
    earned: false,
    icon: 'compass',
  },
];

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Add streak tracking
  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem('streak');
    return savedStreak ? parseInt(savedStreak) : 0;
  });
  
  // Add points system
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints) : 0;
  });
  
  // Add achievements
  const [achievements, setAchievements] = useState(() => {
    const savedAchievements = localStorage.getItem('achievements');
    return savedAchievements ? JSON.parse(savedAchievements) : initialAchievements;
  });
  
  // Last active date for streak tracking
  const [lastActiveDate, setLastActiveDate] = useState(() => {
    const savedDate = localStorage.getItem('lastActiveDate');
    return savedDate || new Date().toDateString();
  });

  // Save to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('streak', streak);
    localStorage.setItem('points', points);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('lastActiveDate', lastActiveDate);
  }, [tasks, streak, points, achievements, lastActiveDate]);

  // Check and update streak on app load
  useEffect(() => {
    checkAndUpdateStreak();
  }, []);

  // Check achievements after any task update
  useEffect(() => {
    checkAchievements();
  }, [tasks]);

  const checkAndUpdateStreak = () => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    if (lastActiveDate === today) {
      // Already logged in today, do nothing
      return;
    } else if (lastActiveDate === yesterdayString) {
      // Consecutive day, increase streak
      setStreak(prevStreak => prevStreak + 1);
      showStreakNotification(streak + 1);
    } else if (lastActiveDate !== yesterdayString) {
      // Streak broken
      if (streak > 0) {
        toast({
          title: "Streak Reset",
          description: `Oh no! You've lost your ${streak} day streak.`,
        });
      }
      setStreak(1); // Reset to 1 for today
    }
    
    setLastActiveDate(today);
  };

  const showStreakNotification = (currentStreak) => {
    if (currentStreak > 0 && currentStreak % 3 === 0) {
      // Give bonus points every 3 days
      const bonus = currentStreak * 2;
      addPoints(bonus);
      toast({
        title: `${currentStreak} Day Streak!`,
        description: `Impressive! You earned ${bonus} bonus points!`,
      });
    } else {
      toast({
        title: `${currentStreak} Day Streak!`,
        description: "Keep it up!",
      });
    }
  };

  const addPoints = (pointsToAdd) => {
    setPoints(prevPoints => {
      const newPoints = prevPoints + pointsToAdd;
      return newPoints;
    });
  };

  const checkAchievements = () => {
    // Check for completed tasks achievement
    const completedTasks = tasks.filter(task => task.completed);
    
    // Check for first task completion
    if (completedTasks.length > 0) {
      unlockAchievement('First Task');
    }
    
    // Check for 10 completed tasks
    if (completedTasks.length >= 10) {
      unlockAchievement('Productivity Master');
    }
    
    // Check for all categories
    const completedCategories = new Set(completedTasks.map(task => task.category));
    if (completedCategories.size >= 5) { // At least 5 categories
      unlockAchievement('Category Explorer');
    }
    
    // Check for streak achievement
    if (streak >= 3) {
      unlockAchievement('Task Streak');
    }
  };

  const unlockAchievement = (achievementTitle) => {
    setAchievements(prevAchievements => {
      return prevAchievements.map(achievement => {
        if (achievement.title === achievementTitle && !achievement.earned) {
          // Add points for earning achievement
          addPoints(50);
          
          // Show notification
          toast({
            title: "Achievement Unlocked!",
            description: `${achievementTitle}: ${achievement.description}`,
          });
          
          return {
            ...achievement,
            earned: true,
            earnedAt: new Date().toISOString()
          };
        }
        return achievement;
      });
    });
  };

  const addTask = (newTaskData) => {
    const newTask = {
      ...newTaskData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    
    // Award points for adding a task
    addPoints(5);
    
    toast({
      title: "Task Added",
      description: "Task added successfully"
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "Task deleted"
    });
  };

  const editTask = (id, updatedTask) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, ...updatedTask } : task)));
    toast({
      title: "Task Updated",
      description: "Task updated"
    });
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map(task => {
        if (task.id === id) {
          const completed = !task.completed;
          
          // If completing a task, set completedAt and award points
          if (completed) {
            // Add points for completing a task
            addPoints(10);
            
            // Check for completing task before due date
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            const now = new Date();
            
            if (dueDate && now < dueDate) {
              // Bonus for early completion
              addPoints(5);
              toast({
                title: "Early Bird Bonus",
                description: "You completed this task before the deadline! +5 bonus points"
              });
            }
            
            toast({
              title: "Task Completed",
              description: "+10 points"
            });
            
            return { 
              ...task, 
              completed,
              completedAt: new Date().toISOString()
            };
          } else {
            // If un-completing a task
            toast({
              title: "Task Incomplete",
              description: "Task marked as incomplete"
            });
            
            return { 
              ...task, 
              completed,
              completedAt: undefined 
            };
          }
        }
        return task;
      })
    );
    
    // Check streak after task completion
    checkAndUpdateStreak();
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        searchTerm,
        selectedCategory,
        addTask,
        deleteTask,
        editTask,
        toggleComplete,
        setSearchTerm,
        setSelectedCategory,
        streak,
        points,
        achievements,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskContextType, Category, Achievement } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { isToday } from 'date-fns';

// Sample initial tasks
const initialTasks: Task[] = [
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
    completedAt: new Date(Date.now() - 86400000).toISOString(), // Completed yesterday
  },
];

// Initial achievements
const initialAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Getting Started',
    description: 'Complete your first task',
    earned: false,
    icon: 'award',
  },
  {
    id: '2',
    title: 'On a Roll',
    description: 'Maintain a 3-day streak',
    earned: false,
    icon: 'flame',
  },
  {
    id: '3',
    title: 'Task Master',
    description: 'Complete 10 tasks',
    earned: false,
    icon: 'trophy',
  },
  {
    id: '4',
    title: 'Early Bird',
    description: 'Complete a task before the due date',
    earned: false,
    icon: 'award',
  }
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  
  // New state for gamification features
  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem('streak');
    return savedStreak ? parseInt(savedStreak) : 0;
  });
  
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints) : 0;
  });
  
  const [achievements, setAchievements] = useState(() => {
    const savedAchievements = localStorage.getItem('achievements');
    return savedAchievements ? JSON.parse(savedAchievements) : initialAchievements;
  });

  // Check and update streak on component mount and when tasks change
  useEffect(() => {
    const lastActivity = localStorage.getItem('lastActivity');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastActivity) {
      const lastDate = new Date(lastActivity).toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      // If last activity was yesterday, continue streak
      if (lastDate === yesterday) {
        // Check if any task was completed today
        const completedToday = tasks.some(task => 
          task.completed && 
          task.completedAt && 
          isToday(new Date(task.completedAt))
        );
        
        if (completedToday) {
          localStorage.setItem('lastActivity', today);
        }
      } 
      // If last activity was not yesterday or today, reset streak
      else if (lastDate !== today) {
        setStreak(0);
      }
    }
  }, [tasks]);

  // Save state to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('streak', streak.toString());
    localStorage.setItem('points', points.toString());
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [tasks, streak, points, achievements]);

  // Check for achievements
  useEffect(() => {
    const updatedAchievements = [...achievements];
    let achievementEarned = false;
    
    // Getting Started achievement
    const completedTasks = tasks.filter(task => task.completed);
    if (completedTasks.length > 0 && !achievements[0].earned) {
      updatedAchievements[0].earned = true;
      updatedAchievements[0].earnedAt = new Date().toISOString();
      achievementEarned = true;
    }
    
    // On a Roll achievement
    if (streak >= 3 && !achievements[1].earned) {
      updatedAchievements[1].earned = true;
      updatedAchievements[1].earnedAt = new Date().toISOString();
      achievementEarned = true;
    }
    
    // Task Master achievement
    if (completedTasks.length >= 10 && !achievements[2].earned) {
      updatedAchievements[2].earned = true;
      updatedAchievements[2].earnedAt = new Date().toISOString();
      achievementEarned = true;
    }
    
    // Early Bird achievement
    const earlyCompletions = tasks.some(task => {
      if (task.completed && task.completedAt && task.dueDate) {
        const completedDate = new Date(task.completedAt);
        const dueDate = new Date(task.dueDate);
        return completedDate < dueDate;
      }
      return false;
    });
    
    if (earlyCompletions && !achievements[3].earned) {
      updatedAchievements[3].earned = true;
      updatedAchievements[3].earnedAt = new Date().toISOString();
      achievementEarned = true;
    }
    
    if (achievementEarned) {
      setAchievements(updatedAchievements);
      toast({
        title: "Achievement Unlocked!",
        description: "You've earned a new achievement!"
      });
    }
  }, [tasks, streak, achievements]);

  const addTask = (newTaskData) => {
    const newTask = {
      ...newTaskData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    // Award points for creating a task
    setPoints(prevPoints => prevPoints + 5);
    toast({
      title: "Task added successfully",
      description: "You earned 5 points!"
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted"
    });
  };

  const editTask = (id, updatedTask) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, ...updatedTask } : task)));
    toast({
      title: "Task updated"
    });
  };

  const toggleComplete = (id) => {
    let pointsEarned = 0;
    const now = new Date();
    
    setTasks(
      tasks.map(task => {
        if (task.id === id) {
          const completed = !task.completed;
          
          if (completed) {
            // Award points for completing a task
            pointsEarned = 10;
            
            // Bonus points for completing before due date
            if (task.dueDate) {
              const dueDate = new Date(task.dueDate);
              if (now < dueDate) {
                pointsEarned += 5;
              }
            }
            
            // Update streak if completing a task today
            const today = now.toISOString().split('T')[0];
            const lastActivity = localStorage.getItem('lastActivity');
            
            if (!lastActivity || lastActivity !== today) {
              setStreak(prevStreak => prevStreak + 1);
              localStorage.setItem('lastActivity', today);
            }
            
            setPoints(prevPoints => prevPoints + pointsEarned);
            
            return { 
              ...task, 
              completed: true,
              completedAt: now.toISOString()
            };
          } else {
            // Remove the completedAt date when marking as incomplete
            const { completedAt, ...rest } = task;
            return { ...rest, completed: false };
          }
        }
        return task;
      })
    );
    
    if (pointsEarned > 0) {
      toast({
        title: "Task completed",
        description: `You earned ${pointsEarned} points!`
      });
    } else {
      toast({
        title: "Task marked as incomplete"
      });
    }
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
        achievements
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

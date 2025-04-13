
export type Category = 'work' | 'personal' | 'shopping' | 'health' | 'education' | 'other';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: Category;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  priority?: Priority; // New field for task priority
}

export interface TaskContextType {
  tasks: Task[];
  searchTerm: string;
  selectedCategory: Category | 'all';
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, task: Partial<Task>) => void;
  toggleComplete: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: Category | 'all') => void;
  streak: number;
  points: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  icon: string;
  earnedAt?: string;
}


import React from 'react';
import { TaskProvider } from '@/context/TaskContext';
import TaskList from '@/components/TaskList';
import AddTaskForm from '@/components/AddTaskForm';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import StreakDisplay from '@/components/StreakDisplay';
import { CheckSquare, ListChecks, BarChart3, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare size={28} />
                <h1 className="text-2xl font-bold">Task Mate</h1>
              </div>
              <Button variant="ghost" className="text-white hover:bg-white/20" asChild>
                <Link to="/analytics" className="flex items-center gap-1">
                  <BarChart3 size={16} />
                  <span className="hidden sm:inline">Analytics</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Streak and Points Display */}
          <div className="mb-6">
            <StreakDisplay />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <ListChecks className="text-primary" />
                <h2 className="text-xl font-semibold">Your Tasks</h2>
              </div>
              <AddTaskForm />
            </div>
            
            <div className="space-y-4">
              <SearchBar />
              
              <div className="py-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by category:</h3>
                <CategoryFilter />
              </div>
              
              <Separator />
              
              <TaskList />
            </div>
          </div>
        </main>
        
        <footer className="text-center text-gray-500 py-6">
          <p>© 2025 Task Mate - Advanced To-Do List Web App</p>
        </footer>
      </div>
    </TaskProvider>
  );
};

export default Index;

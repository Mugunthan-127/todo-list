
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import TaskItem from './TaskItem';
import { Task } from '@/types';

const TaskList: React.FC = () => {
  const { tasks, searchTerm, selectedCategory } = useTaskContext();

  const filteredTasks = tasks.filter((task) => {
    // Apply category filter
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Sort tasks by dueDate and completion status
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed tasks go to the bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Sort by due date (null dates go at the end)
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && !b.dueDate) return -1;
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    // Sort by creation date if no due date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (sortedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h3 className="text-xl font-medium mb-2">No tasks found</h3>
        <p className="text-muted-foreground">
          {searchTerm || selectedCategory !== 'all'
            ? "Try changing your search or filter criteria"
            : "Click the 'Add Task' button to create your first task"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;

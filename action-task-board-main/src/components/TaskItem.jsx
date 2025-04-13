
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarIcon, EditIcon, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isPast, isToday, formatDistanceToNow } from 'date-fns';
import AddTaskForm from './AddTaskForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const TaskItem = ({ task }) => {
  const { toggleComplete, deleteTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleCompleteToggle = () => {
    toggleComplete(task.id);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    deleteTask(task.id);
  };

  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDateObj && isPast(dueDateObj) && !isToday(dueDateObj) && !task.completed;
  const completedDate = task.completedAt ? new Date(task.completedAt) : null;

  return (
    <>
      <Card className={cn("task-item task-animation", task.completed && "completed", "hover:shadow-md transition-shadow")}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox 
              checked={task.completed} 
              onCheckedChange={handleCompleteToggle}
              className="mt-1"
            />
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between items-start">
                <h3 className={cn("font-medium text-lg task-title", task.completed && "text-muted-foreground line-through")}>
                  {task.title}
                </h3>
                <span className={cn("category-badge", `category-${task.category}`)}>
                  {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                </span>
              </div>
              
              {task.description && (
                <p className="text-sm text-muted-foreground">{task.description}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {dueDateObj && (
                  <div className="flex items-center">
                    <CalendarIcon size={14} className="mr-1" />
                    <span className={cn(
                      isOverdue && "text-destructive font-medium",
                      isToday(dueDateObj) && !task.completed && "text-yellow-600 font-medium"
                    )}>
                      {isToday(dueDateObj) 
                        ? "Today" 
                        : format(dueDateObj, "MMM d, yyyy")}
                      
                      {isOverdue && " (Overdue)"}
                    </span>
                  </div>
                )}
                
                {completedDate && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 size={14} className="mr-1" />
                    <span>
                      Completed {formatDistanceToNow(completedDate, { addSuffix: true })}
                    </span>
                  </div>
                )}
                
                {!task.completed && dueDateObj && !isOverdue && (
                  <div className="flex items-center text-blue-600">
                    <Clock size={14} className="mr-1" />
                    <span>
                      Due {formatDistanceToNow(dueDateObj, { addSuffix: true })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={handleEditClick}>
            <EditIcon size={16} className="mr-1" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteClick}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      {isEditing && (
        <AddTaskForm 
          editTask={task} 
          onClose={() => setIsEditing(false)} 
        />
      )}
    </>
  );
};

export default TaskItem;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Category, Task } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { CalendarIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface AddTaskFormProps {
  editTask?: Task;
  onClose?: () => void;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

const AddTaskForm: React.FC<AddTaskFormProps> = ({ editTask, onClose }) => {
  const { addTask, editTask: updateTask } = useTaskContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState<Category>('work');

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setDueDate(editTask.dueDate ? new Date(editTask.dueDate) : undefined);
      setCategory(editTask.category);
      setOpen(true);
    }
  }, [editTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(undefined);
    setCategory('work');
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
    if (onClose) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      title,
      description,
      dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : '',
      category,
      completed: editTask ? editTask.completed : false,
    };

    if (editTask) {
      updateTask(editTask.id, taskData);
    } else {
      addTask(taskData);
    }

    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!editTask && (
          <Button className="gap-2">
            <Plus size={16} />
            Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{editTask ? 'Save Changes' : 'Add Task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskForm;

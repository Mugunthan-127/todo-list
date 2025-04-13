
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

const CategoryFilter: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useTaskContext();

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant="outline"
          size="sm"
          className={cn(
            'text-sm font-medium',
            selectedCategory === category.value && 'bg-primary text-primary-foreground'
          )}
          onClick={() => setSelectedCategory(category.value)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;

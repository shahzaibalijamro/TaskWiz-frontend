import React, { useState } from 'react';
import { MoreVertical, Trash2, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { updateTask, deleteTask } from '../store/tasksSlice';
import { tasksService } from '../services/tasksService';
import { toast } from 'sonner';
import { cn } from '../utils/cn';

const STATUS_CONFIG = {
  OPEN: {
    label: 'Open',
    className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  DONE: {
    label: 'Done',
    className: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
};

export const TaskCard = ({ task, onViewDetails }) => {
  const dispatch = useDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const updatedTask = await tasksService.updateTaskStatus(task.id, newStatus);
      dispatch(updateTask(updatedTask));
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    try {
      await tasksService.deleteTask(task.id);
      dispatch(deleteTask(task.id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <>
      <Card
        className="p-6 space-y-4 transition-all duration-200 hover:shadow-md hover:border-primary/20 cursor-pointer"
        data-testid={`task-card-${task.id}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0" onClick={() => onViewDetails(task)}>
            <h3
              className="text-lg font-medium text-foreground truncate mb-1"
              data-testid={`task-title-${task.id}`}
            >
              {task.title}
            </h3>
            <p
              className="text-sm text-muted-foreground line-clamp-2"
              data-testid={`task-description-${task.id}`}
            >
              {task.description}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                data-testid={`task-menu-${task.id}`}
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onViewDetails(task)}
                data-testid={`view-task-${task.id}`}
              >
                <Eye size={16} className="mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
                data-testid={`delete-task-${task.id}`}
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <div
            className={cn(
              'inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium',
              STATUS_CONFIG[task.status].className
            )}
            data-testid={`task-status-badge-${task.id}`}
          >
            {STATUS_CONFIG[task.status].label}
          </div>

          <Select
            value={task.status}
            onValueChange={handleStatusChange}
            disabled={updatingStatus}
            data-testid={`task-status-select-${task.id}`}
          >
            <SelectTrigger className="w-full" data-testid={`task-status-trigger-${task.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent data-testid={`delete-dialog-${task.id}`}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete-button">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="confirm-delete-button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
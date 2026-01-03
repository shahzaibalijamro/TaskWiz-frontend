import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Trash2, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
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
import { Label } from './ui/label';
import { tasksService } from '../services/tasksService';
import { updateTask, deleteTask } from '../store/tasksSlice';
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

export const TaskDetailDialog = ({ task, open, onOpenChange, onSuccess }) => {
  const dispatch = useDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const updatedTask = await tasksService.updateTaskStatus(task.id, newStatus);
      dispatch(updateTask(updatedTask));
      toast.success('Status updated');
      onSuccess();
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
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl" data-testid="task-detail-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium" data-testid="task-detail-title">
              {task.title}
            </DialogTitle>
            <DialogDescription data-testid="task-detail-id">
              Task ID: {task.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium',
                    STATUS_CONFIG[task.status].className
                  )}
                  data-testid="task-detail-status-badge"
                >
                  {STATUS_CONFIG[task.status].label}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-update" className="text-sm font-medium">
                Update Status
              </Label>
              <Select
                value={task.status}
                onValueChange={handleStatusChange}
                disabled={updatingStatus}
                data-testid="task-detail-status-select"
              >
                <SelectTrigger id="status-update">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <div
                className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-md"
                data-testid="task-detail-description"
              >
                {task.description}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              data-testid="task-detail-delete-button"
            >
              <Trash2 size={18} className="mr-2" />
              Delete Task
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="task-detail-close-button"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent data-testid="task-detail-delete-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="task-detail-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="task-detail-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
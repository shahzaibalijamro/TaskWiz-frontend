import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Eye, Trash2 } from 'lucide-react';

const STATUS_CONFIG = {
  OPEN: {
    label: 'Open',
    className: 'bg-slate-100 text-slate-700 border border-slate-200',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-orange-50 text-orange-700 border border-orange-200',
  },
  DONE: {
    label: 'Done',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
};

const TaskCard = ({ task, onStatusUpdate, onDelete, onView }) => {
  const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.OPEN;

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 space-y-4"
      data-testid="task-card"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold text-slate-900 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {task.title}
          </h3>
          <span className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${statusConfig.className}`}>
            {statusConfig.label}
          </span>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          {truncateText(task.description)}
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700 uppercase tracking-widest">Status</label>
          <Select
            value={task.status}
            onValueChange={(value) => onStatusUpdate(task.id, value)}
            data-testid={`task-status-select-${task.id}`}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(task)}
            data-testid={`view-task-button-${task.id}`}
            className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                data-testid={`delete-task-button-${task.id}`}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-testid="delete-cancel-button">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(task.id)}
                  data-testid="delete-confirm-button"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

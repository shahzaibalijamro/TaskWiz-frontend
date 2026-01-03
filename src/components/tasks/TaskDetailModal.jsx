import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Trash2 } from 'lucide-react';

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

const TaskDetailModal = ({ task, isOpen, onClose, onStatusUpdate, onDelete }) => {
  const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.OPEN;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="task-detail-modal">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <DialogTitle className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {task.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-mono">
                ID: {task.id}
              </DialogDescription>
            </div>
            <span className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${statusConfig.className}`}>
              {statusConfig.label}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{task.description}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Update Status</label>
            <Select
              value={task.status}
              onValueChange={(value) => onStatusUpdate(task.id, value)}
              data-testid="modal-status-select"
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  data-testid="modal-delete-button"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Task
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
                  <AlertDialogCancel data-testid="modal-delete-cancel-button">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(task.id)}
                    data-testid="modal-delete-confirm-button"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;

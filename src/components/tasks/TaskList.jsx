import React from 'react';
import TaskCard from './TaskCard';
import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TaskList = ({ tasks, onStatusUpdate, onDelete, onView }) => {
  const navigate = useNavigate();

  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-12 text-center" data-testid="empty-state">
        <FileX className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
          No tasks found
        </h3>
        <p className="text-slate-600 mb-6">Create your first task to get started</p>
        <Button
          onClick={() => navigate('/tasks/create')}
          data-testid="create-first-task-button"
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm transition-all active:scale-95"
        >
          Create Task
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusUpdate={onStatusUpdate}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default TaskList;

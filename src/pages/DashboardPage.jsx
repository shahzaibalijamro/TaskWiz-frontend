import React, { useState, useEffect } from 'react';
import { tasksService } from '@/services/tasks.service';
import { toast } from 'sonner';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskList from '@/components/tasks/TaskList';
import TaskDetailModal from '@/components/tasks/TaskDetailModal';
import { Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksService.getAllTasks(filters);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await tasksService.updateTaskStatus(taskId, newStatus);
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await tasksService.deleteTask(taskId);
      toast.success('Task deleted successfully');
      fetchTasks();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12" data-testid="dashboard-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Dashboard
          </h1>
          <p className="mt-2 text-slate-600">Manage and track all your tasks</p>
        </div>

        <TaskFilters filters={filters} setFilters={setFilters} />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
            onView={handleViewTask}
          />
        )}
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default DashboardPage;

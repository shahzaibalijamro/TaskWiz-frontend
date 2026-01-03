import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, CheckSquare } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { TaskCard } from '../components/TaskCard';
import { TaskFilters } from '../components/TaskFilters';
import { CreateTaskDialog } from '../components/CreateTaskDialog';
import { TaskDetailDialog } from '../components/TaskDetailDialog';
import { Button } from '../components/ui/button';
import { tasksService } from '../services/tasksService';
import { setTasks, setLoading, setError } from '../store/tasksSlice';
import { toast } from 'sonner';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { tasks, loading, filters } = useSelector((state) => state.tasks);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchTasks = async () => {
    dispatch(setLoading(true));
    try {
      const data = await tasksService.getTasks(filters);
      dispatch(setTasks(data));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch tasks'));
      toast.error('Failed to load tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesSearch =
      !filters.search ||
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8" data-testid="dashboard-page">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-medium tracking-tight text-foreground">
              Your Tasks
            </h2>
            <p className="text-base text-muted-foreground mt-1">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="toggle-filters-button"
            >
              <Filter size={18} className="mr-2" />
              Filters
            </Button>
            <Button
              onClick={() => setShowCreateDialog(true)}
              data-testid="create-task-button"
            >
              <Plus size={18} className="mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <TaskFilters />
          </motion.div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-xl border bg-card animate-pulse"
                data-testid="task-skeleton"
              />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
            data-testid="empty-state"
          >
            <div
              className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center"
            >
              <CheckSquare size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-medium mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Get started by creating your first task and stay organized
            </p>
            <Button onClick={() => setShowCreateDialog(true)} data-testid="empty-state-create-button">
              <Plus size={18} className="mr-2" />
              Create Your First Task
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-testid="tasks-grid"
          >
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskCard task={task} onViewDetails={setSelectedTask} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <CreateTaskDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={fetchTasks}
      />

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          onSuccess={fetchTasks}
        />
      )}
    </DashboardLayout>
  );
}
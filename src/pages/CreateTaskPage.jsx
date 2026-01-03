import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksService } from '@/services/tasks.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const CreateTaskPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim().length === 0) {
      toast.error('Title is required');
      return;
    }

    if (description.trim().length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      await tasksService.createTask({ title, description });
      toast.success('Task created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12" data-testid="create-task-page">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            data-testid="back-button"
            className="mb-4 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Create New Task
          </h1>
          <p className="mt-2 text-slate-600">Add a new task to your list</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="create-task-form">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
                data-testid="task-title-input"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your task (minimum 10 characters)"
                required
                minLength={10}
                rows={6}
                data-testid="task-description-input"
                className="resize-none"
              />
              <p className="text-xs text-slate-500">
                {description.length} / 10 characters minimum
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                data-testid="create-task-submit-button"
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm transition-all active:scale-95"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                data-testid="cancel-button"
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;

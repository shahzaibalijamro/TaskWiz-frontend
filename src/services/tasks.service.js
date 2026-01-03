import api from './api';

export const tasksService = {
  getAllTasks: async (filters = {}) => {
    const params = {};
    if (filters.status) {
      params.status = filters.status;
    }
    if (filters.search) {
      params.search = filters.search;
    }
    const response = await api.get('/task', { params });
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/task/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/task', {
      title: taskData.title.trim(),
      description: taskData.description.trim(),
    });
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/task/${id}`, { status });
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/task/${id}`);
    return response.data;
  },
};

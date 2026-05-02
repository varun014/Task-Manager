import axiosInstance from './axiosInstance';

export const getMyTasksApi = async () => {
  const { data } = await axiosInstance.get('/tasks');
  return data;
};

export const getProjectTasksApi = async (projectId) => {
  const { data } = await axiosInstance.get(`/tasks/project/${projectId}`);
  return data;
};

export const createTaskApi = async (payload) => {
  const { data } = await axiosInstance.post('/tasks', payload);
  return data;
};

export const getTaskByIdApi = async (taskId) => {
  const { data } = await axiosInstance.get(`/tasks/${taskId}`);
  return data;
};

export const updateTaskApi = async (taskId, payload) => {
  const { data } = await axiosInstance.put(`/tasks/${taskId}`, payload);
  return data;
};

export const deleteTaskApi = async (taskId) => {
  const { data } = await axiosInstance.delete(`/tasks/${taskId}`);
  return data;
};

export const getDashboardStatsApi = async () => {
  const { data } = await axiosInstance.get('/dashboard');
  return data;
};

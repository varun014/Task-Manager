import { useState } from 'react';
import {
  createTaskApi,
  deleteTaskApi,
  getMyTasksApi,
  getProjectTasksApi,
  getTaskByIdApi,
  updateTaskApi
} from '../api/taskApi';

const extractMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.message ||
    error.message ||
    'Something went wrong'
  );
};

const useTasks = () => {
  const [loading, setLoading] = useState(false);

  const run = async (callback) => {
    setLoading(true);
    try {
      return await callback();
    } catch (error) {
      throw new Error(extractMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const getMyTasks = () => run(async () => (await getMyTasksApi()).tasks || []);

  const getProjectTasks = (projectId) =>
    run(async () => (await getProjectTasksApi(projectId)).tasks || []);

  const getTaskById = (taskId) => run(async () => (await getTaskByIdApi(taskId)).task);

  const createTask = (payload) => run(async () => (await createTaskApi(payload)).task);

  const updateTask = (taskId, payload) =>
    run(async () => (await updateTaskApi(taskId, payload)).task);

  const deleteTask = (taskId) => run(async () => deleteTaskApi(taskId));

  return {
    loading,
    getMyTasks,
    getProjectTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
  };
};

export default useTasks;

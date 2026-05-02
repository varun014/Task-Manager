import axiosInstance from './axiosInstance';

export const getProjectsApi = async () => {
  const { data } = await axiosInstance.get('/projects');
  return data;
};

export const getProjectByIdApi = async (projectId) => {
  const { data } = await axiosInstance.get(`/projects/${projectId}`);
  return data;
};

export const createProjectApi = async (payload) => {
  const { data } = await axiosInstance.post('/projects', payload);
  return data;
};

export const updateProjectApi = async (projectId, payload) => {
  const { data } = await axiosInstance.put(`/projects/${projectId}`, payload);
  return data;
};

export const deleteProjectApi = async (projectId) => {
  const { data } = await axiosInstance.delete(`/projects/${projectId}`);
  return data;
};

export const addProjectMemberApi = async (projectId, payload) => {
  const { data } = await axiosInstance.post(`/projects/${projectId}/members`, payload);
  return data;
};

export const removeProjectMemberApi = async (projectId, userId) => {
  const { data } = await axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
  return data;
};

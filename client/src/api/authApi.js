import axiosInstance from './axiosInstance';

export const signupApi = async (payload) => {
  const { data } = await axiosInstance.post('/auth/signup', payload);
  return data;
};

export const loginApi = async (payload) => {
  const { data } = await axiosInstance.post('/auth/login', payload);
  return data;
};

export const meApi = async () => {
  const { data } = await axiosInstance.get('/auth/me');
  return data;
};

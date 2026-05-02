import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createProjectApi,
  deleteProjectApi,
  getProjectsApi,
  updateProjectApi
} from '../api/projectApi';
import { AuthContext } from './AuthContext';

export const ProjectContext = createContext(null);

const extractMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.message ||
    error.message ||
    'Something went wrong'
  );
};

export const ProjectProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await getProjectsApi();
      setProjects(response.projects || []);
      return response.projects || [];
    } catch (error) {
      throw new Error(extractMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (payload) => {
    const response = await createProjectApi(payload);
    setProjects((prev) => [response.project, ...prev]);
    return response.project;
  };

  const updateProject = async (projectId, payload) => {
    const response = await updateProjectApi(projectId, payload);
    setProjects((prev) =>
      prev.map((project) =>
        project._id === response.project._id ? response.project : project
      )
    );
    return response.project;
  };

  const deleteProject = async (projectId) => {
    await deleteProjectApi(projectId);
    setProjects((prev) => prev.filter((project) => project._id !== projectId));

    if (activeProject?._id === projectId) {
      setActiveProject(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects().catch(() => {
        setProjects([]);
      });
    } else {
      setProjects([]);
      setActiveProject(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      projects,
      loading,
      activeProject,
      setActiveProject,
      loadProjects,
      createProject,
      updateProject,
      deleteProject,
      extractMessage
    }),
    [projects, loading, activeProject]
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

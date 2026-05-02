import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectCard from '../components/projects/ProjectCard';
import Loader from '../components/common/Loader';
import useProjects from '../hooks/useProjects';
import useAuth from '../hooks/useAuth';

const ProjectsPage = () => {
  const { user } = useAuth();
  const { projects, loading, createProject, deleteProject, extractMessage } = useProjects();
  const [isModalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCreateProject = async (payload) => {
    setSubmitting(true);
    setError('');
    try {
      await createProject(payload);
      setModalOpen(false);
    } catch (requestError) {
      setError(extractMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;

    setError('');
    try {
      await deleteProject(projectId);
    } catch (requestError) {
      setError(extractMessage(requestError));
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl gap-6 p-4 md:p-6">
        <Sidebar projects={projects} title="Quick Access" />

        <section className="flex-1 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-ink">Projects</h1>
              <p className="mt-1 text-sm text-slate-600">Create, browse, and manage team projects.</p>
            </div>
            <Button onClick={() => setModalOpen(true)}>New Project</Button>
          </div>

          {error ? (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          {loading ? <Loader message="Loading projects..." /> : null}

          {!loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => {
                const currentUserMember = project.members?.find(
                  (member) => member.user?._id === user?._id
                );

                return (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    isAdmin={currentUserMember?.role === 'Admin'}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>
          ) : null}

          {!loading && !projects.length ? (
            <p className="rounded-xl border border-teal-100 bg-white p-4 text-sm text-slate-600">
              No projects yet. Start by creating your first project.
            </p>
          ) : null}
        </section>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create New Project">
        <ProjectForm onSubmit={handleCreateProject} submitting={submitting} />
      </Modal>
    </>
  );
};

export default ProjectsPage;

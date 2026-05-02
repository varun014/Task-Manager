import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import MemberList from '../components/projects/MemberList';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import useProjects from '../hooks/useProjects';
import useTasks from '../hooks/useTasks';
import {
  addProjectMemberApi,
  getProjectByIdApi,
  removeProjectMemberApi
} from '../api/projectApi';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { projects, extractMessage } = useProjects();
  const { getProjectTasks, createTask, loading: taskLoading } = useTasks();

  const [project, setProject] = useState(null);
  const [role, setRole] = useState('Member');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberLoading, setMemberLoading] = useState(false);

  const loadProjectData = async () => {
    setLoading(true);
    try {
      const [projectResponse, taskResponse] = await Promise.all([
        getProjectByIdApi(projectId),
        getProjectTasks(projectId)
      ]);

      setProject(projectResponse.project);
      setRole(projectResponse.role);
      setTasks(taskResponse);
    } catch (requestError) {
      setError(extractMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const handleCreateTask = async (payload) => {
    setError('');

    try {
      const createdTask = await createTask({
        ...payload,
        project: projectId,
        dueDate: payload.dueDate || null,
        assignedTo: payload.assignedTo || null
      });

      setTasks((prev) => [createdTask, ...prev]);
      setTaskModalOpen(false);
    } catch (requestError) {
      setError(extractMessage(requestError));
    }
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    if (!memberEmail) return;

    setMemberLoading(true);
    setError('');

    try {
      const response = await addProjectMemberApi(projectId, { email: memberEmail });
      setProject(response.project);
      setMemberEmail('');
    } catch (requestError) {
      setError(extractMessage(requestError));
    } finally {
      setMemberLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    setError('');

    try {
      const response = await removeProjectMemberApi(projectId, userId);
      setProject(response.project);
    } catch (requestError) {
      setError(extractMessage(requestError));
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl gap-6 p-4 md:p-6">
        <Sidebar projects={projects} title="Projects" />

        <section className="flex-1 space-y-5">
          {loading ? <Loader message="Loading project..." /> : null}

          {error ? (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          {!loading && project ? (
            <>
              <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-3xl font-bold text-ink">{project.name}</h1>
                    <p className="mt-2 text-sm text-slate-600">
                      {project.description || 'No project description'}
                    </p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                      Your role: {role}
                    </p>
                  </div>

                  {role === 'Admin' ? (
                    <Button onClick={() => setTaskModalOpen(true)}>Create Task</Button>
                  ) : null}
                </div>

                {role === 'Admin' ? (
                  <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleAddMember}>
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={(event) => setMemberEmail(event.target.value)}
                      placeholder="Add member by email"
                      className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring"
                    />
                    <Button type="submit" disabled={memberLoading}>
                      {memberLoading ? 'Adding...' : 'Add Member'}
                    </Button>
                  </form>
                ) : null}
              </div>

              <div className="grid gap-5 xl:grid-cols-3">
                <div className="space-y-4 xl:col-span-2">
                  <h2 className="text-2xl font-bold text-ink">Tasks</h2>

                  {taskLoading ? <Loader message="Loading tasks..." /> : null}

                  {!taskLoading && tasks.length ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {tasks.map((task) => (
                        <TaskCard key={task._id} task={task} />
                      ))}
                    </div>
                  ) : null}

                  {!taskLoading && !tasks.length ? (
                    <p className="rounded-xl border border-teal-100 bg-white p-4 text-sm text-slate-600">
                      No tasks yet.
                    </p>
                  ) : null}
                </div>

                <MemberList
                  members={project.members || []}
                  isAdmin={role === 'Admin'}
                  onRemove={handleRemoveMember}
                />
              </div>
            </>
          ) : null}
        </section>
      </main>

      <Modal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} title="Create Task">
        <TaskForm
          members={project?.members || []}
          onSubmit={handleCreateTask}
          submitting={taskLoading}
        />
      </Modal>
    </>
  );
};

export default ProjectDetailPage;

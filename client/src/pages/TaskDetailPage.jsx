import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import useProjects from '../hooks/useProjects';
import useTasks from '../hooks/useTasks';
import { getProjectByIdApi } from '../api/projectApi';
import { priorityOptions, statusOptions } from '../utils/statusOptions';
import formatDate from '../utils/formatDate';

const TaskDetailPage = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { projects, extractMessage } = useProjects();
  const { getTaskById, updateTask, deleteTask, loading: taskLoading } = useTasks();

  const [task, setTask] = useState(null);
  const [projectRole, setProjectRole] = useState('Member');
  const [projectMembers, setProjectMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    assignedTo: '',
    dueDate: ''
  });

  const isAdmin = projectRole === 'Admin';

  const assigneeOptions = useMemo(
    () =>
      projectMembers
        .filter((member) => member.user)
        .map((member) => ({ value: member.user._id, label: member.user.name })),
    [projectMembers]
  );

  const loadTaskDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const [taskResponse, projectResponse] = await Promise.all([
        getTaskById(taskId),
        getProjectByIdApi(projectId)
      ]);

      setTask(taskResponse);
      setProjectRole(projectResponse.role);
      setProjectMembers(projectResponse.project?.members || []);

      setForm({
        title: taskResponse.title || '',
        description: taskResponse.description || '',
        status: taskResponse.status || 'To Do',
        priority: taskResponse.priority || 'Medium',
        assignedTo: taskResponse.assignedTo?._id || '',
        dueDate: taskResponse.dueDate ? taskResponse.dueDate.slice(0, 10) : ''
      });
    } catch (requestError) {
      setError(extractMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaskDetails();
  }, [taskId, projectId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const payload = isAdmin
        ? {
            title: form.title,
            description: form.description,
            status: form.status,
            priority: form.priority,
            assignedTo: form.assignedTo || null,
            dueDate: form.dueDate || null
          }
        : { status: form.status };

      const updatedTask = await updateTask(taskId, payload);
      setTask(updatedTask);
    } catch (requestError) {
      setError(extractMessage(requestError));
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) return;
    if (!window.confirm('Delete this task?')) return;

    setError('');
    try {
      await deleteTask(taskId);
      navigate(`/projects/${projectId}`);
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-ink">Task Details</h1>
            <Link
              to={`/projects/${projectId}`}
              className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-sea hover:bg-teal-50"
            >
              Back to Project
            </Link>
          </div>

          {loading ? <Loader message="Loading task..." /> : null}

          {error ? (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          {!loading && task ? (
            <article className="rounded-2xl border border-teal-100 bg-white p-6 shadow-card">
              <p className="mb-4 text-sm text-slate-500">
                Created by {task.createdBy?.name || 'Unknown'} | Due {formatDate(task.dueDate)}
              </p>

              <form className="space-y-4" onSubmit={handleSave}>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    disabled={!isAdmin}
                    className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block text-sm font-semibold text-slate-700"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    disabled={!isAdmin}
                    className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring disabled:bg-slate-100"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="priority">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      disabled={!isAdmin}
                      className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring disabled:bg-slate-100"
                    >
                      {priorityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="dueDate">
                      Due Date
                    </label>
                    <input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={form.dueDate}
                      onChange={handleChange}
                      disabled={!isAdmin}
                      className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring disabled:bg-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="assignedTo">
                    Assignee
                  </label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    disabled={!isAdmin}
                    className="w-full rounded-xl border border-teal-200 px-3 py-2 outline-none ring-sea transition focus:ring disabled:bg-slate-100"
                  >
                    <option value="">Unassigned</option>
                    {assigneeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={taskLoading}>
                    {taskLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  {isAdmin ? (
                    <Button type="button" variant="danger" onClick={handleDelete}>
                      Delete Task
                    </Button>
                  ) : null}
                </div>
              </form>
            </article>
          ) : null}
        </section>
      </main>
    </>
  );
};

export default TaskDetailPage;

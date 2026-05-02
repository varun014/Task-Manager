import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Loader from '../components/common/Loader';
import StatsCard from '../components/dashboard/StatsCard';
import TaskStatusChart from '../components/dashboard/TaskStatusChart';
import OverdueTaskList from '../components/dashboard/OverdueTaskList';
import { getDashboardStatsApi, getMyTasksApi } from '../api/taskApi';
import useProjects from '../hooks/useProjects';
import useAuth from '../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalTasks: 0,
    byStatus: { 'To Do': 0, 'In Progress': 0, Done: 0 },
    overdueTasks: 0,
    tasksByUser: []
  });
  const [myTasks, setMyTasks] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [dashboardResponse, tasksResponse] = await Promise.all([
          getDashboardStatsApi(),
          getMyTasksApi()
        ]);

        setStats(dashboardResponse.stats);
        setMyTasks(tasksResponse.tasks || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || requestError.message || 'Failed to load dashboard'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const overdueTasks = myTasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done'
  );

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl gap-6 p-4 md:p-6">
        <Sidebar projects={projects} title="Projects" />

        <section className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-ink">Hello, {user?.name || 'there'}</h1>
            <p className="mt-1 text-sm text-slate-600">Here is how your projects are moving today.</p>
          </div>

          {loading ? <Loader message="Loading dashboard..." /> : null}

          {error ? (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          {!loading && !error ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatsCard label="Total Tasks" value={stats.totalTasks} />
                <StatsCard
                  label="To Do"
                  value={stats.byStatus['To Do'] || 0}
                  accent="from-orange-500 to-amber-400"
                />
                <StatsCard
                  label="In Progress"
                  value={stats.byStatus['In Progress'] || 0}
                  accent="from-teal-500 to-cyan-400"
                />
                <StatsCard label="Done" value={stats.byStatus.Done || 0} accent="from-blue-500 to-sky-400" />
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <TaskStatusChart byStatus={stats.byStatus} />
                </div>
                <OverdueTaskList tasks={overdueTasks} />
              </div>

              <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-card">
                <h3 className="mb-4 text-lg font-semibold text-ink">Tasks By Assignee</h3>
                {stats.tasksByUser.length ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {stats.tasksByUser.map((entry) => (
                      <li key={entry.user} className="rounded-xl bg-teal-50 p-3">
                        <p className="font-semibold text-ink">{entry.user}</p>
                        <p className="text-sm text-slate-600">{entry.count} tasks</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">No assignments yet.</p>
                )}
              </div>
            </>
          ) : null}
        </section>
      </main>
    </>
  );
};

export default DashboardPage;

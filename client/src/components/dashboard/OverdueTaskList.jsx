const OverdueTaskList = ({ tasks = [] }) => {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-ink">Overdue Tasks</h3>

      {tasks.length ? (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task._id} className="rounded-xl bg-rose-50 p-3">
              <p className="font-semibold text-ink">{task.title}</p>
              <p className="text-xs text-rose-700">Due date passed</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No overdue tasks. Great momentum.</p>
      )}
    </div>
  );
};

export default OverdueTaskList;
